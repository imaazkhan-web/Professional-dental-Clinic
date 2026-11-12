import { siteConfig } from "@/lib/site";

export function MobileCallBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#BDD3F0] p-2.5 flex gap-2.5 shadow-lg">
      <a
        href={`tel:${siteConfig.phoneRaw}`}
        className="flex-1 inline-flex items-center justify-center min-h-[48px] px-4 rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white active:scale-[0.98] transition-all"
      >
        Call
      </a>
      <a
        href={`https://wa.me/${siteConfig.whatsappRaw}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center min-h-[48px] px-4 rounded-full font-semibold text-base border-2 border-[#3FC16F] bg-[#3FC16F] text-[#0F2A4A] active:scale-[0.98] transition-all"
      >
        WhatsApp
      </a>
    </div>
  );
}
