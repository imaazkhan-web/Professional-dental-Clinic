"use server";

import { createClient, requireAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminCreateAppointmentSchema,
  updateAppointmentSchema,
} from "@/lib/admin-schema";

export type AdminActionResult = {
  success: boolean;
  error?: string;
};

export async function logoutAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminUserId = process.env.ADMIN_USER_ID;

  if (!user || !adminUserId || user.id !== adminUserId) {
    redirect("/admin/login");
  }

  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createAppointmentAdminAction(
  data: unknown
): Promise<AdminActionResult> {
  // 1. Guard check
  await requireAdmin();

  // 2. Validate input with Zod
  const parseResult = adminCreateAppointmentSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid appointment data",
    };
  }

  const validData = parseResult.data;

  // 3. Insert using user session client (respecting Supabase RLS)
  const supabase = await createClient();
  const { error: insertError } = await supabase.from("appointments").insert({
    full_name: validData.fullName,
    phone: validData.phone,
    treatment: validData.treatment,
    preferred_time: validData.preferredTime,
    status: "new",
    notes: validData.notes || null,
  });

  if (insertError) {
    console.error("appointment create failed:", insertError.code || insertError.message);
    return {
      success: false,
      error: "Failed to create appointment. Please try again.",
    };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function updateAppointmentAction(
  data: unknown
): Promise<AdminActionResult> {
  // 1. Guard check
  await requireAdmin();

  // 2. Validate input with Zod
  const parseResult = updateAppointmentSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid update data",
    };
  }

  const validData = parseResult.data;

  // 3. Update using user session client (respecting Supabase RLS)
  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from("appointments")
    .update({
      status: validData.status,
      notes: validData.notes || null,
    })
    .eq("id", validData.id);

  if (updateError) {
    console.error("appointment update failed:", updateError.code || updateError.message);
    return {
      success: false,
      error: "Failed to update appointment. Please try again.",
    };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteAppointmentAction(
  id: string
): Promise<AdminActionResult> {
  // 1. Guard check
  await requireAdmin();

  if (!id || typeof id !== "string") {
    return {
      success: false,
      error: "Invalid appointment ID",
    };
  }

  // 2. Delete using user session client (respecting Supabase RLS)
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("appointment delete failed:", deleteError.code || deleteError.message);
    return {
      success: false,
      error: "Failed to delete appointment. Please try again.",
    };
  }

  revalidatePath("/admin");
  return { success: true };
}
