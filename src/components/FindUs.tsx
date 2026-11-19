"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";

export function FindUs() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address.formatted
  )}`;

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
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-white text-[#1F57AE] hover:bg-[#EAF2FD] active:scale-[0.98] transition-all"
            >
              Get directions
            </a>
          </div>

          {/* Map Column */}
          <div className="w-full">
            <div className="w-full h-[320px] sm:h-[360px] rounded-[20px] overflow-hidden border border-[#BDD3F0] bg-[#EAF2FD] shadow-xs flex items-center justify-center">
              {!isMapLoaded ? (
                <div className="w-full h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1F57AE] border border-[#BDD3F0] flex items-center justify-center mb-3 shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.75}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-[#0F2A4A] mb-1">
                    Clinic location
                  </h3>
                  <p className="text-[#3E5575] text-sm leading-relaxed max-w-[340px] mb-5">
                    {siteConfig.address.formatted}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMapLoaded(true)}
                      className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-semibold text-sm bg-[#2F6FD0] text-white hover:bg-[#255bb0] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                    >
                      Load map
                    </button>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-semibold text-sm border-2 border-[#2F6FD0] bg-white text-[#1F57AE] hover:bg-[#EAF2FD] active:scale-[0.98] transition-all"
                    >
                      Get directions
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  src={siteConfig.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Google Maps Location - Professional Dental Clinic"
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Map ke neeche hamesha ek saaf Get directions button */}
            <div className="mt-3.5 flex justify-center sm:justify-start">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-semibold text-sm border-2 border-[#2F6FD0] bg-white text-[#1F57AE] hover:bg-[#EAF2FD] active:scale-[0.98] transition-all"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
