import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[#0F2A4A] text-white pt-12 pb-8 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-base">
          {/* Clinic Name & Address */}
          <div>
            <b className="text-lg font-heading">{siteConfig.name}</b>
            <p className="mt-2 text-white/80 leading-relaxed">
              {siteConfig.address.street},
              <br />
              {siteConfig.address.city}, {siteConfig.address.country}
            </p>
          </div>

          {/* Operating Hours */}
          <div>
            <b className="text-lg font-heading">Hours</b>
            <p className="mt-2 text-white/80 leading-relaxed">
              {siteConfig.hours.monSat}
              <br />
              {siteConfig.hours.sunday}
            </p>
          </div>

          {/* Contact Details */}
          <div>
            <b className="text-lg font-heading">Contact</b>
            <p className="mt-2 text-white/80 leading-relaxed">
              Phone: {siteConfig.phone}
              <br />
              WhatsApp: +{siteConfig.whatsappRaw}
              <br />
              Email: {siteConfig.email}
            </p>
          </div>
        </div>

        {/* Legal / Project Disclaimer */}
        <p className="mt-8 pt-8 border-t border-white/10 text-sm text-[#C5D6EE] leading-relaxed">
          &copy; {new Date().getFullYear()} {siteConfig.name} &middot;{" "}
          <Link
            href="/privacy"
            className="hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Privacy policy
          </Link>{" "}
          &middot; Practice project, not a real clinic
        </p>
      </div>
    </footer>
  );
}
