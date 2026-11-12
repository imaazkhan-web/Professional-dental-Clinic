import Link from "next/link";
import { AppointmentForm } from "@/components/AppointmentForm";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12 sm:py-14 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div>
            <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
              Family and Cosmetic Dentistry
            </span>

            <h1 className="mt-3.5 mb-4 text-4xl sm:text-5xl lg:text-[54px] font-heading font-bold text-[#0F2A4A] tracking-tight leading-[1.1]">
              Gentle dental care, explained clearly.
            </h1>

            <p className="max-w-[520px] mb-7 text-base sm:text-lg text-[#3E5575] leading-relaxed">
              Checkups, cleaning and treatment in a calm clinic. We explain the
              plan before we start, and you can ask about the cost first.
            </p>

            {/* 3 Call-To-Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white hover:bg-[#255bb0] hover:border-[#255bb0] active:scale-[0.98] transition-all"
              >
                Call now
              </a>

              <a
                href={`https://wa.me/${siteConfig.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full font-semibold text-base border-2 border-[#3FC16F] bg-[#3FC16F] text-[#0F2A4A] hover:bg-[#36aa61] hover:border-[#36aa61] active:scale-[0.98] transition-all"
              >
                WhatsApp us
              </a>

              <Link
                href="#treatments"
                className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-white text-[#1F57AE] hover:bg-[#EAF2FD] active:scale-[0.98] transition-all"
              >
                View treatments
              </Link>
            </div>
          </div>

          {/* Right Column: Appointment Form Card (stacks below on mobile) */}
          <div className="w-full">
            <AppointmentForm />
          </div>
        </div>
      </div>
    </section>
  );
}
