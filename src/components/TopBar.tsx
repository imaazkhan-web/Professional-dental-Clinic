import { siteConfig } from "@/lib/site";

export function TopBar() {
  return (
    <div className="bg-[#0F2A4A] text-white text-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-1.5 text-center sm:text-left">
        <span className="text-white/90">{siteConfig.hours.monSat}</span>
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="font-semibold text-white hover:text-white/80 transition-colors"
        >
          Emergency pain? Call {siteConfig.phone}
        </a>
      </div>
    </div>
  );
}
