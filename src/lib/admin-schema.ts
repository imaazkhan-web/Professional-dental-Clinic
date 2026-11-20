import { z } from "zod";
import { appointmentSchema, treatmentSlugs, preferredTimeOptions } from "@/lib/appointment-schema";

export const appointmentStatusOptions = ["new", "confirmed", "cancelled"] as const;
export type AppointmentStatus = (typeof appointmentStatusOptions)[number];

// Schema for URL query params on /admin
export const adminQuerySchema = z.object({
  status: z.enum(["all", "new", "confirmed", "cancelled"]).default("all").catch("all"),
  search: z.string().default("").catch(""),
  page: z.coerce.number().int().positive().default(1).catch(1),
});

export type AdminQueryParams = z.infer<typeof adminQuerySchema>;

// Schema for updating appointment status and notes
export const updateAppointmentSchema = z.object({
  id: z.string().min(1, "Appointment ID is required"),
  status: z.enum(appointmentStatusOptions, {
    message: "Invalid status selected",
  }),
  notes: z
    .string()
    .max(500, "Notes must be 500 characters or less")
    .optional()
    .default(""),
});

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;

// Schema for admin creating a new appointment (same as appointmentSchema, but without honeypot or Turnstile)
export const adminCreateAppointmentSchema = z.object({
  fullName: appointmentSchema.shape.fullName,
  phone: appointmentSchema.shape.phone,
  treatment: z.enum(treatmentSlugs, {
    message: "Please select a treatment",
  }),
  preferredTime: z
    .enum(preferredTimeOptions, {
      message: "Please select a preferred time",
    })
    .default("any"),
  notes: z
    .string()
    .max(500, "Notes must be 500 characters or less")
    .optional()
    .default(""),
});

export type AdminCreateAppointmentInput = z.infer<typeof adminCreateAppointmentSchema>;

