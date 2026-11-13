import Link from "next/link";

export function Dentist() {
  return (
    <section id="dentist" className="py-16 sm:py-20 scroll-mt-[80px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Photo Placeholder */}
          <div className="bg-[#CFE0F7] border border-[#BDD3F0] rounded-[20px] min-h-[320px] sm:min-h-[380px] flex flex-col items-center justify-center p-6 text-center text-[#0F2A4A] shadow-xs">
            <div className="w-20 h-20 rounded-full bg-white/70 border border-[#BDD3F0] flex items-center justify-center text-3xl mb-3 text-[#1F57AE]">
              👨‍⚕️
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight">
              [DENTIST PHOTO]
            </span>
            <span className="text-xs text-[#3E5575] mt-1">
              Sample photo placeholder
            </span>
          </div>

          {/* Bio & Details */}
          <div>
            <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
              Principal Dental Surgeon
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-bold text-[#0F2A4A] tracking-tight mt-2 mb-4 leading-tight">
              Meet Dr. [Sample Name]
            </h2>

            <p className="text-[#3E5575] text-base sm:text-lg leading-relaxed mb-4">
              [DEGREE, PMDC REGISTRATION NUMBER AND YEARS OF PRACTICE].
            </p>

            <p className="text-sm text-[#3E5575] bg-[#EAF2FD] border border-[#BDD3F0] rounded-xl p-4 mb-7 leading-relaxed">
              <strong>Notice:</strong> This is sample placeholder text for
              practice. Real clinical qualifications, PMDC registration number,
              and professional certifications will be added when provided by a
              licensed dental clinic.
            </p>

            <Link
              href="/book"
              className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-white text-[#1F57AE] hover:bg-[#EAF2FD] active:scale-[0.98] transition-all"
            >
              Book with Dr. [Sample Name]
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

