import { siteConfig } from "@/lib/site";

export function FindUs() {
  return (
    <section id="find-us" className="py-16 sm:py-20 scroll-mt-[80px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Details & Directions CTA */}
          <div>
            <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
              Location &amp; Visiting Hours
            </span>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F2A4A] tracking-tight mt-1 mb-4">
              Find us
            </h2>

            <p className="text-[#3E5575] text-base sm:text-lg leading-relaxed mb-2 font-medium">
              {siteConfig.address.formatted}
            </p>

            <p className="text-[#3E5575] text-base leading-relaxed mb-1">
              {siteConfig.hours.monSat}
            </p>
            <p className="text-[#3E5575] text-sm leading-relaxed mb-6">
              {siteConfig.hours.sunday}
            </p>

            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-white text-[#1F57AE] hover:bg-[#EAF2FD] active:scale-[0.98] transition-all"
            >
              Get directions
            </a>
          </div>

          {/* Google Maps Embed iframe */}
          <div className="w-full h-[320px] sm:h-[360px] rounded-[20px] overflow-hidden border border-[#BDD3F0] bg-[#CFE0F7] shadow-xs">
            <iframe
              src={siteConfig.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location - Professional Dental Clinic"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

