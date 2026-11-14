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

    // 3. IP Rate limit check: max 3 requests per 5 minutes per IP
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : headerList.get("x-real-ip") || "127.0.0.1";

    if (!checkIpRateLimit(clientIp)) {
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
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    if (recentAppointments && recentAppointments.length > 0) {
      return {
        success: false,
        message: RATE_LIMIT_MESSAGE,
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
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
    }

    // 7. Insert kamyab hone ke BAAD email notification bhejo
    // Email fail ho to bhi appointment save rahe aur user ko success dikhe
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

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: GENERIC_ERROR_MESSAGE,
    };
  }
}
