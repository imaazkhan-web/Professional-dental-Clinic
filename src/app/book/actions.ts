"use server";

import { appointmentSchema } from "@/lib/appointment-schema";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export type ActionResponse = {
  success: boolean;
  message?: string;
};

const GENERIC_ERROR_MESSAGE = "Something went wrong, please call us";

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

    // 2. Initialize server-only Supabase client
    const supabase = getSupabaseServerClient();

    // 3. Insert into appointments table with exact required fields only
    const { error } = await supabase.from("appointments").insert({
      full_name: validData.fullName,
      phone: validData.phone,
      treatment: validData.treatment,
      preferred_time: validData.preferredTime,
    });

    if (error) {
      return {
        success: false,
        message: GENERIC_ERROR_MESSAGE,
      };
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

