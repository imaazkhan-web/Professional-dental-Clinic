import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { treatments } from "@/data/treatments";
import { siteConfig } from "@/lib/site";

interface TreatmentPageProps {
  params: Promise<{ slug: string }>;
}

// Prerender all treatment slugs statically at build time
export async function generateStaticParams() {
  return treatments.map((treatment) => ({
    slug: treatment.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    return {
      title: "Treatment Not Found",
    };
  }

  return {
    title: treatment.title,
    description: treatment.shortDescription,
    openGraph: {
      title: `${treatment.title} | ${siteConfig.name}`,
      description: treatment.shortDescription,
      url: `${siteConfig.url}/treatments/${treatment.slug}`,
      siteName: siteConfig.name,
    },
  };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  // In Next.js 16, params is a Promise and must be awaited
  const { slug } = await params;
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    notFound();
  }

  return (
    <div className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-[#3E5575] mb-8"
        >
          <Link
            href="/"
            className="hover:text-[#2F6FD0] transition-colors"
          >
            Home
          </Link>
          <span className="text-[#BDD3F0]">/</span>
          <Link
            href="/#treatments"
            className="hover:text-[#2F6FD0] transition-colors"
          >
            Treatments
          </Link>
          <span className="text-[#BDD3F0]">/</span>
          <span className="text-[#0F2A4A] font-semibold">
            {treatment.title}
          </span>
        </nav>

        {/* Header with Title and Duration Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D3E2F7]">
          <div>
            <span className="text-xs sm:text-[13px] font-bold tracking-widest text-[#1F57AE] uppercase">
              Dental Treatment Overview
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#0F2A4A] tracking-tight mt-1">
              {treatment.title}
            </h1>
          </div>
          <span className="self-start sm:self-center inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-[#1F57AE] bg-[#EAF2FD] border border-[#BDD3F0] shrink-0">
            Estimated Duration: {treatment.duration}
          </span>
        </div>

        {/* Overview Section */}
        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0F2A4A] mb-3">
            About this care
          </h2>
          <p className="text-base sm:text-lg text-[#3E5575] leading-relaxed bg-[#EAF2FD]/50 border border-[#BDD3F0] rounded-2xl p-6">
            {treatment.overview}
          </p>
        </div>

        {/* What to Expect Section */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0F2A4A] mb-4">
            What to expect during your visit
          </h2>
          <ul className="space-y-3.5">
            {treatment.whatToExpect.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-3 bg-white border border-[#BDD3F0] rounded-xl p-4 shadow-xs"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#EAF2FD] text-[#1F57AE] font-bold text-xs shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-base text-[#0F2A4A] leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action Box */}
        <div className="mt-12 bg-[#0F2A4A] text-white rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
            Ready to book your {treatment.title.toLowerCase()}?
          </h3>
          <p className="text-white/80 max-w-[500px] mt-2 mb-6 text-sm sm:text-base leading-relaxed">
            Our clinic staff will confirm a convenient appointment slot and
            clarify any questions you have beforehand.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white hover:bg-[#255bb0] hover:border-[#255bb0] active:scale-[0.98] transition-all"
          >
            Request an appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

