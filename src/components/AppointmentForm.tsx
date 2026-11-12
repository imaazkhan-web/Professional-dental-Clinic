"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod validation schema matching strict requirements
const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters long"),
  phone: z
    .string()
    .regex(
      /^(?:\+92\s?3|03)\d{2}[\s-]?\d{7}$/,
      "Please enter a valid Pakistani phone number (e.g. 03XX XXXXXXX or +92 3XX XXXXXXX)"
    ),
  treatment: z
    .string()
    .refine((val) => val !== "" && val !== "Select treatment", {
      message: "Please select a treatment",
    }),
  preferredTime: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function AppointmentForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      treatment: "Select treatment",
      preferredTime: "Any time",
    },
  });

  const onSubmit = () => {
    // Client-only as specified
    setIsSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
  };

  return (
    <div
      id="book"
      className="bg-[#EAF2FD] border border-[#BDD3F0] rounded-[20px] p-6 sm:p-7 shadow-sm scroll-mt-24"
    >
      <h2 className="text-2xl sm:text-[26px] font-heading font-bold text-[#0F2A4A] tracking-tight">
        Request an appointment
      </h2>

      {isSubmitted ? (
        <div className="mt-5 p-6 rounded-xl bg-white border border-[#3FC16F]/40 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3FC16F]/15 text-[#0F2A4A] font-bold text-xl mb-3">
            ✓
          </div>
          <h3 className="text-xl font-heading font-bold text-[#0F2A4A]">
            Request received, we will call you
          </h3>
          <p className="text-sm text-[#3E5575] mt-2 leading-relaxed">
            Thank you! Our clinic team will call your number to confirm your
            preferred appointment time slot.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-semibold text-sm border-2 border-[#2F6FD0] text-[#2F6FD0] hover:bg-[#2F6FD0] hover:text-white transition-colors"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-3.5" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-[#0F2A4A] mb-1.5"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Ahmad Ali"
              {...register("fullName")}
              className={`w-full min-h-[48px] rounded-[10px] border-2 bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:outline-none ${
                errors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#5F7FAE] focus:border-[#2F6FD0]"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-600 text-xs sm:text-sm font-medium mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-[#0F2A4A] mb-1.5"
            >
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="03XX XXXXXXX"
              {...register("phone")}
              className={`w-full min-h-[48px] rounded-[10px] border-2 bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:outline-none ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#5F7FAE] focus:border-[#2F6FD0]"
              }`}
            />
            {errors.phone && (
              <p className="text-red-600 text-xs sm:text-sm font-medium mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Treatment Selection */}
          <div>
            <label
              htmlFor="treatment"
              className="block text-sm font-semibold text-[#0F2A4A] mb-1.5"
            >
              Treatment
            </label>
            <select
              id="treatment"
              {...register("treatment")}
              className={`w-full min-h-[48px] rounded-[10px] border-2 bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:outline-none ${
                errors.treatment
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#5F7FAE] focus:border-[#2F6FD0]"
              }`}
            >
              <option value="Select treatment">Select treatment</option>
              <option value="Checkup and cleaning">Checkup and cleaning</option>
              <option value="Filling or root canal">Filling or root canal</option>
              <option value="Whitening">Whitening</option>
              <option value="Braces and aligners">Braces and aligners</option>
              <option value="Implants and crowns">Implants and crowns</option>
              <option value="Children's dentistry">Children&apos;s dentistry</option>
              <option value="Not sure">Not sure</option>
            </select>
            {errors.treatment && (
              <p className="text-red-600 text-xs sm:text-sm font-medium mt-1">
                {errors.treatment.message}
              </p>
            )}
          </div>

          {/* Preferred Time (Optional) */}
          <div>
            <label
              htmlFor="preferredTime"
              className="block text-sm font-semibold text-[#0F2A4A] mb-1.5"
            >
              Preferred time <span className="font-normal text-xs text-[#3E5575]">(optional)</span>
            </label>
            <select
              id="preferredTime"
              {...register("preferredTime")}
              className="w-full min-h-[48px] rounded-[10px] border-2 border-[#5F7FAE] bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:border-[#2F6FD0] focus:outline-none"
            >
              <option value="Any time">Any time</option>
              <option value="Morning">Morning (9 AM – 1 PM)</option>
              <option value="Afternoon">Afternoon (1 PM – 5 PM)</option>
              <option value="Evening">Evening (5 PM – 9 PM)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] mt-4 inline-flex items-center justify-center rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white hover:bg-[#255bb0] hover:border-[#255bb0] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send request"}
          </button>

          {/* Privacy Note */}
          <p className="text-xs sm:text-sm text-[#3E5575] mt-3 leading-relaxed">
            We call you back to confirm the time. Your number is used only for
            your appointment.
          </p>
        </form>
      )}
    </div>
  );
}

