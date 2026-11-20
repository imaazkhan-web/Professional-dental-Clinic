import type { Metadata } from "next";
import Script from "next/script";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-12 px-6 flex items-center justify-center">
      {/* Cloudflare Turnstile script loaded for admin login */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div className="w-full max-w-[420px] bg-white border border-[#BDD3F0] rounded-[20px] p-6 sm:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
            Internal Area
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#0F2A4A] tracking-tight mt-1">
            Admin login
          </h1>
          <p className="text-sm text-[#3E5575] mt-1.5">
            Please enter your administrator credentials.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

