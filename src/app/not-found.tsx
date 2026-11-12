import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white py-16 px-6">
      <div className="max-w-md w-full bg-[#EAF2FD] border border-[#BDD3F0] rounded-[24px] p-8 sm:p-10 text-center shadow-sm">
        <span className="inline-block text-5xl sm:text-6xl font-heading font-bold text-[#1F57AE] mb-3">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#0F2A4A] tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-[#3E5575] text-sm sm:text-base leading-relaxed mb-7">
          The dental care page or treatment resource you are looking for does
          not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white hover:bg-[#255bb0] hover:border-[#255bb0] active:scale-[0.98] transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

