"use server";

import { headers } from "next/headers";
import { appointmentSchema } from "@/lib/appointment-schema";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { checkIpRateLimit } from "@/lib/rate-limit";
import { sendAppointmentEmail } from "@/lib/email";

export type ActionResponse = {
  success: boolean;
  message?: string;
};

const GENERIC_ERROR_MESSAGE = "Something went wrong, please call us";
const RATE_LIMIT_MESSAGE = "Too many requests, please call us";

// Rate limit for requests without identifiable IP ("unknown" bucket) - lower limit (1 request per 5 min)
const UNKNOWN_WINDOW_MS = 5 * 60 * 1000;
const UNKNOWN_MAX_REQUESTS = 1;
const unknownRequests: number[] = [];

function checkUnknownRateLimit(): boolean {
  const now = Date.now();
  const activeTimestamps = unknownRequests.filter(
    (timestamp) => now - timestamp < UNKNOWN_WINDOW_MS
  );

  if (activeTimestamps.length >= UNKNOWN_MAX_REQUESTS) {
    unknownRequests.length = 0;
    unknownRequests.push(...activeTimestamps);
    return false;
  }

  activeTimestamps.push(now);
  unknownRequests.length = 0;
  unknownRequests.push(...activeTimestamps);
  return true;
}

export async function createAppointment(
  data: unknown
): Promise<ActionResponse> {
  try {
    // 1. Re-validate on the server using Zod schema
    const parseResult = appointmentSchema.safeParse(data);
    if (!parseResult.success) {
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    const validData = parseResult.data;

    // 2. Honeypot check: if filled by a bot, quietly return success without writing to database
    if (validData.website && validData.website.trim().length > 0) {
      return {
        success: true,
      };
    }

    // 3. Verify Cloudflare Turnstile token (Zod validation ke baad, IP rate limit se pehle)
    const turnstileToken =
      validData.turnstileToken ||
      (typeof data === "object" && data !== null && "turnstileToken" in data
        ? String((data as Record<string, unknown>).turnstileToken || "")
        : "");

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

    if (!turnstileToken || !turnstileSecret) {
      console.error("turnstile failed");
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    try {
      const verifyFormData = new URLSearchParams();
      verifyFormData.append("secret", turnstileSecret);
      verifyFormData.append("response", turnstileToken);

      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: verifyFormData.toString(),
          signal: AbortSignal.timeout(6000),
        }
      );

      if (!turnstileRes.ok) {
        console.error("turnstile failed");
        return {
          success: false,
          message: GENERIC_ERROR_MESSAGE,
        };
      }

      const turnstileOutcome = (await turnstileRes.json()) as {
        success: boolean;
      };

      if (!turnstileOutcome.success) {
        console.error("turnstile failed");
        return {
          success: false,
          message: GENERIC_ERROR_MESSAGE,
        };
      }
    } catch {
      console.error("turnstile failed");
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    // 4. IP Rate limit check: x-real-ip pehle, phir x-forwarded-for ka pehla hissa, warna "unknown" bucket (alag aur kam limit)
    const headerList = await headers();
    const realIp = headerList.get("x-real-ip");
    const forwardedFor = headerList.get("x-forwarded-for");

    let clientIp: string;
    if (realIp && realIp.trim().length > 0) {
      clientIp = realIp.trim();
    } else if (forwardedFor && forwardedFor.trim().length > 0) {
      clientIp = forwardedFor.split(",")[0].trim();
    } else {
      clientIp = "unknown";
    }

    const isAllowed =
      clientIp === "unknown"
        ? checkUnknownRateLimit()
        : checkIpRateLimit(clientIp);

    if (!isAllowed) {
      return {
        success: false,
        message: RATE_LIMIT_MESSAGE,
      };
    }

    // 4. Initialize server-only Supabase client
    const supabase = getSupabaseServerClient();

    // 5. Database duplicate phone check: no duplicate requests within 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentAppointments, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("phone", validData.phone)
      .gte("created_at", tenMinutesAgo)
      .limit(1);

    if (checkError) {
      if (checkError.code) {
        console.error(checkError.code);
      }
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    // Duplicate hone par chupchap success return karo (insert aur email dono na ho)
    if (recentAppointments && recentAppointments.length > 0) {
      return {
        success: true,
      };
    }

    // 6. Insert into appointments table with exact required fields only (no extra fields)
    const { error: insertError } = await supabase.from("appointments").insert({
      full_name: validData.fullName,
      phone: validData.phone,
      treatment: validData.treatment,
      preferred_time: validData.preferredTime,
    });

    if (insertError) {
      if (insertError.code) {
        console.error(insertError.code);
      }
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    // 7. Global email throttle: pichle 1 ghante me appointments me 20 se zyada rows hon to row save karo lekin email mat bhejo
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneHourAgo);

    if (count !== null && count > 20) {
      console.log("email throttled");
    } else {
      try {
        await sendAppointmentEmail({
          fullName: validData.fullName,
          phone: validData.phone,
          treatment: validData.treatment,
          preferredTime: validData.preferredTime,
        });
      } catch {
        console.error("Failed to send appointment notification email");
      }
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error(err instanceof Error ? err.name : "Error");
    return {
      success: false,
      message: GENERIC_ERROR_MESSAGE,
    };
  }
}
