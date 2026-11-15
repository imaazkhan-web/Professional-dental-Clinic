import * as z from "zod";
import { treatments } from "@/data/treatments";

export const treatmentSlugs = treatments.map((t) => t.slug) as unknown as readonly [
  string,
  ...string[]
];

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
    .refine((val) => !/[\x00-\x1F\x7F]/.test(val), {
      message: "Name must not contain control characters",
    })
    .refine((val) => !/(?:https?:\/\/|www\.)/i.test(val), {
      message: "Name must not contain website links",
    })
    .pipe(
      z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(80, "Name must not exceed 80 characters")
    ),
  phone: z
    .string({ message: "Phone number is required" })
    .transform((val) => {
      const cleaned = val.replace(/[\s-]/g, "");
      return cleaned.startsWith("+92") ? "0" + cleaned.slice(3) : cleaned;
    })
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
  website: z.string().max(200).optional(),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type AppointmentOutput = z.output<typeof appointmentSchema>;
