import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
};

export default function PrivacyPage() {
  return (
    <div className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-[760px] mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-[#3E5575] mb-6"
        >
          <Link href="/" className="hover:text-[#2F6FD0] transition-colors">
            Home
          </Link>
          <span className="text-[#BDD3F0]">/</span>
          <span className="text-[#0F2A4A] font-semibold">Privacy policy</span>
        </nav>

        {/* Page Heading */}
        <div className="mb-8">
          <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
            {siteConfig.name}
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F2A4A] tracking-tight mt-1">
            Privacy policy
          </h1>
          <p className="text-[#64748b] text-sm mt-2">
            Last updated: November 14, 2026
          </p>
        </div>

        {/* Notice Banner */}
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm leading-relaxed">
          <p className="font-semibold mb-1">Practice notice</p>
          <p>
            This website is a practice project and does not represent a real clinic. Please do not submit real personal data.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-[#1E293B] text-base leading-relaxed">
          {/* What we collect */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              What we collect
            </h2>
            <p>
              When you submit an appointment request, we collect your full name, phone number, requested treatment, and preferred time.
            </p>
            <p className="mt-2 text-[#475569]">
              Please do not write or submit any medical history, dental records, or health details.
            </p>
          </section>

          {/* Why */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              Why we collect it
            </h2>
            <p>
              We collect this information solely to call you back regarding your appointment request.
            </p>
          </section>

          {/* Who handles it */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              Who handles your data
            </h2>
            <p>Your request is processed through the following services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#334155]">
              <li>
                <strong>Supabase:</strong> stores appointment records in a database.
              </li>
              <li>
                <strong>Resend:</strong> sends an email notification to the clinic about new appointment requests.
              </li>
              <li>
                <strong>Vercel:</strong> provides website hosting and server infrastructure.
              </li>
            </ul>
            <p className="mt-3">
              Please note that servers for these providers may be located outside Pakistan.
            </p>
            <p className="mt-2 text-[#475569]">
              The map loads only when you click &ldquo;Load map&rdquo;. Google may then receive your IP address and device information.
            </p>
          </section>

          {/* Technical data */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              Technical data
            </h2>
            <p>
              To prevent abuse and repeated spam requests, your IP address is used temporarily for rate limiting. In addition, our hosting provider may maintain standard server access logs.
            </p>
            <p className="mt-2 text-[#475569]">
              This form uses Cloudflare Turnstile to prevent spam, which may process technical data like your IP address and browser details.
            </p>
          </section>

          {/* How long */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              How long we keep it
            </h2>
            <p>We keep requests for up to [RETENTION] days.</p>
          </section>

          {/* Your choices */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              Your choices
            </h2>
            <p>
              This is a practice project. No one monitors requests sent here, so please do not submit real personal data.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-heading font-bold text-[#0F2A4A] mb-2">
              Cookies
            </h2>
            <p>
              This site does not use analytics or advertising cookies. Google Maps may set its own.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

