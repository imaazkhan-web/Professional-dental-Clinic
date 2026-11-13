import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentForm } from "@/components/AppointmentForm";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Schedule your dental consultation or treatment visit with Professional Dental Clinic.",
};

export default function BookPage() {
  return (
    <div className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-[720px] mx-auto px-6">
        {/* Breadcrumb Navigation (Home > Book) */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-[#3E5575] mb-6"
        >
          <Link href="/" className="hover:text-[#2F6FD0] transition-colors">
            Home
          </Link>
          <span className="text-[#BDD3F0]">/</span>
          <span className="text-[#0F2A4A] font-semibold">Book</span>
        </nav>

        {/* Page Heading */}
        <div className="mb-6">
          <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
            Online Scheduling
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F2A4A] tracking-tight mt-1">
            Request an appointment
          </h1>
          <p className="text-[#3E5575] text-sm sm:text-base mt-2 leading-relaxed">
            Please fill in your details below. Our reception team will call you
            back to confirm your preferred visit time.
          </p>
        </div>

        {/* Appointment Form */}
        <AppointmentForm />
      </div>
    </div>
  );
}

