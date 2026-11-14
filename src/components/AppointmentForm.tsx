"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentSchema,
  type AppointmentInput,
  type TreatmentSlug,
} from "@/lib/appointment-schema";
import { createAppointment } from "@/app/book/actions";
import { treatments } from "@/data/treatments";

export function AppointmentForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      treatment: "" as unknown as TreatmentSlug,
      preferredTime: "any",
      website: "",
    },
  });

  const onSubmit = async (data: AppointmentInput) => {
    setServerError(null);
    try {
      const response = await createAppointment(data);
      if (response.success) {
        setIsSubmitted(true);
      } else {
        setServerError(response.message || "Something went wrong, please call us");
      }
    } catch {
      setServerError("Something went wrong, please call us");
    }
  };

  const handleReset = () => {
    reset();
    setServerError(null);
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-3.5 relative" noValidate>
          {/* Honeypot field (hidden via CSS, not display:none, aria-hidden, tabIndex -1, autocomplete off) */}
          <div
            className="absolute opacity-0 pointer-events-none -z-50 h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

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
              className={`w-full min-h-[48px] rounded-[10px] border-2 bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:outline-none ${errors.fullName
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
              className={`w-full min-h-[48px] rounded-[10px] border-2 bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:outline-none ${errors.phone
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
              className={`w-full min-h-[48px] rounded-[10px] border-2 bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:outline-none ${errors.treatment
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#5F7FAE] focus:border-[#2F6FD0]"
                }`}
            >
              <option value="">Select treatment</option>
              {treatments.map((treatment) => (
                <option key={treatment.slug} value={treatment.slug}>
                  {treatment.title}
                </option>
              ))}
            </select>
            {errors.treatment && (
              <p className="text-red-600 text-xs sm:text-sm font-medium mt-1">
                {errors.treatment.message}
              </p>
            )}
          </div>

          {/* Preferred Time */}
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
              <option value="any">Any time</option>
              <option value="morning">Morning (9 AM – 1 PM)</option>
              <option value="afternoon">Afternoon (1 PM – 5 PM)</option>
              <option value="evening">Evening (5 PM – 9 PM)</option>
            </select>
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
              {serverError}
            </div>
          )}

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
            We use your number only to call you about this request.{" "}
            <Link
              href="/privacy"
              className="underline hover:text-[#0F2A4A] transition-colors"
            >
              Privacy policy
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
