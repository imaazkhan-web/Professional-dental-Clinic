import { reviews } from "@/data/reviews";

export function Reviews() {
  return (
    <section id="reviews" className="bg-[#EAF2FD] py-16 sm:py-20 scroll-mt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0F2A4A] tracking-tight mb-2">
          What patients say
        </h2>
        <p className="text-[#3E5575] text-sm sm:text-base mb-8 max-w-[650px] leading-relaxed">
          Sample reviews for practice demonstration. Replace with real verified
          patient reviews, with permission.
        </p>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-[#BDD3F0] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#2F6FD0] transition-colors"
            >
              <div>
                <span className="inline-block text-[11px] font-semibold tracking-wider text-[#1F57AE] bg-[#EAF2FD] px-2.5 py-0.5 rounded-full mb-3 uppercase">
                  Sample review
                </span>
                <p className="text-[#3E5575] text-base leading-relaxed mb-4 italic">
                  &ldquo;{review.reviewText}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-[#D3E2F7]/60">
                <b className="font-heading font-semibold text-[#0F2A4A]">
                  {review.patientName}
                </b>
                <span className="block text-xs text-[#3E5575] mt-0.5">
                  Sample patient
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

