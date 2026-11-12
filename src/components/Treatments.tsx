import Link from "next/link";
import { treatments } from "@/data/treatments";

export function Treatments() {
  return (
    <section id="treatments" className="bg-[#EAF2FD] py-16 sm:py-20 scroll-mt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F2A4A] tracking-tight mb-7">
          Treatments
        </h2>

        {/* 3x2 Grid on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatments.map((treatment) => (
            <div
              key={treatment.slug}
              className="bg-white border border-[#BDD3F0] rounded-2xl p-6 hover:border-[#2F6FD0] transition-colors flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-heading font-bold text-[#0F2A4A]">
                    {treatment.title}
                  </h3>
                  <span className="text-xs font-medium text-[#1F57AE] bg-[#EAF2FD] px-2.5 py-1 rounded-full shrink-0">
                    {treatment.duration}
                  </span>
                </div>

                <p className="text-[#3E5575] text-sm sm:text-base leading-relaxed my-3">
                  {treatment.shortDescription}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/treatments/${treatment.slug}`}
                  className="font-semibold text-sm sm:text-base text-[#1F57AE] inline-flex items-center gap-1 group-hover:underline"
                >
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
