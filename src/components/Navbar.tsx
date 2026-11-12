"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="border-b border-[#D3E2F7] bg-white sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-2.5 sm:px-6 h-[64px] sm:h-[76px] flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand / Logo (Single line, responsive font with truncation protection) */}
        <Link
          href="/"
          onClick={closeMenu}
          className="font-heading font-bold text-xs min-[360px]:text-sm sm:text-base md:text-[22px] text-[#1F57AE] tracking-tight hover:opacity-95 truncate whitespace-nowrap max-w-[130px] min-[360px]:max-w-[165px] sm:max-w-none"
          title={siteConfig.name}
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 shrink-0">
          <Link
            href="/#treatments"
            className="text-[#0F2A4A] font-medium hover:text-[#2F6FD0] transition-colors"
          >
            Treatments
          </Link>
          <Link
            href="/#dentist"
            className="text-[#0F2A4A] font-medium hover:text-[#2F6FD0] transition-colors"
          >
            Our dentist
          </Link>
          <Link
            href="/#reviews"
            className="text-[#0F2A4A] font-medium hover:text-[#2F6FD0] transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="/#find-us"
            className="text-[#0F2A4A] font-medium hover:text-[#2F6FD0] transition-colors"
          >
            Find us
          </Link>
        </nav>

        {/* Right Side Actions on Mobile: Book a visit CTA + Hamburger Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/#book"
            onClick={closeMenu}
            className="inline-flex items-center justify-center min-h-[36px] sm:min-h-[44px] md:min-h-[48px] px-2.5 sm:px-4 md:px-6 rounded-full font-semibold text-xs sm:text-sm md:text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white hover:bg-[#255bb0] hover:border-[#255bb0] transition-colors whitespace-nowrap shrink-0"
          >
            Book a visit
          </Link>

          {/* Hamburger Button (Clean, borderless, normal 3-line mobile icon) */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            className="md:hidden inline-flex items-center justify-center p-1 text-[#0F2A4A] hover:text-[#2F6FD0] active:scale-95 transition-colors shrink-0 cursor-pointer focus:outline-none"
          >
            {isOpen ? (
              <X className="size-6 text-[#0F2A4A]" />
            ) : (
              <Menu className="size-6 text-[#0F2A4A]" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[64px] sm:top-[76px] bg-black/25 backdrop-blur-[2px] z-30 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Dropdown Panel */}
          <nav
            aria-label="Mobile Navigation"
            className="absolute top-[64px] sm:top-[76px] left-0 right-0 bg-white border-b border-[#BDD3F0] shadow-xl p-4 flex flex-col gap-1 z-40 md:hidden"
          >
            <Link
              href="/#treatments"
              onClick={closeMenu}
              className="text-[#0F2A4A] font-semibold text-base py-2.5 px-3 rounded-lg hover:bg-[#EAF2FD] active:bg-[#EAF2FD] transition-colors"
            >
              Treatments
            </Link>
            <Link
              href="/#dentist"
              onClick={closeMenu}
              className="text-[#0F2A4A] font-semibold text-base py-2.5 px-3 rounded-lg hover:bg-[#EAF2FD] active:bg-[#EAF2FD] transition-colors"
            >
              Our dentist
            </Link>
            <Link
              href="/#reviews"
              onClick={closeMenu}
              className="text-[#0F2A4A] font-semibold text-base py-2.5 px-3 rounded-lg hover:bg-[#EAF2FD] active:bg-[#EAF2FD] transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/#find-us"
              onClick={closeMenu}
              className="text-[#0F2A4A] font-semibold text-base py-2.5 px-3 rounded-lg hover:bg-[#EAF2FD] active:bg-[#EAF2FD] transition-colors"
            >
              Find us
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
