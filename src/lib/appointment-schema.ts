import * as z from "zod";

export const treatmentSlugs = [
  "checkup-and-cleaning",
  "fillings-and-root-canal",
  "teeth-whitening",
  "braces-and-aligners",
  "implants-and-crowns",
  "childrens-dentistry",
] as const;

export type TreatmentSlug = (typeof treatmentSlugs)[number];

export const preferredTimeOptions = [
  "any",
  "morning",
  "afternoon",
  "evening",
] as const;

export type PreferredTimeOption = (typeof preferredTimeOptions)[number];

export const appointmentSchema = z.object({
  fullName: z
    .string({ message: "Full name is required" })
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name must not exceed 80 characters"),
  phone: z
    .string({ message: "Phone number is required" })
    .transform((val) => val.replace(/[\s-]/g, ""))
    .pipe(
      z
        .string()
        .regex(
          /^(?:03\d{9}|\+923\d{9})$/,
          "Please enter a valid Pakistani phone number (e.g. 03001234567 or +923001234567)"
        )
    ),
  treatment: z.enum(treatmentSlugs, {
    message: "Please select a treatment",
  }),
  preferredTime: z
    .enum(preferredTimeOptions, {
      message: "Please select a preferred time",
    })
    .default("any"),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type AppointmentOutput = z.output<typeof appointmentSchema>;
