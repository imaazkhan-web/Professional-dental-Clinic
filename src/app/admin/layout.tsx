import type { Metadata } from "next";
import Link from "next/link";
import { logoutAdmin } from "./actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin | Professional Dental Clinic",
    template: "%s | Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // If client initialization or getUser fails, user remains null
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-sans text-[#0F2A4A]">
      {/* Dedicated Admin Header */}
      <header className="border-b border-[#BDD3F0] bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-heading font-bold text-lg sm:text-xl text-[#0F2A4A] tracking-tight hover:opacity-90"
            >
              <span className="w-8 h-8 rounded-lg bg-[#2F6FD0] text-white flex items-center justify-center text-sm font-bold">
                P
              </span>
              <span>Dental Clinic Admin</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF2FD] text-[#1F57AE] border border-[#BDD3F0]">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs sm:text-sm font-medium text-[#3E5575] hover:text-[#0F2A4A] transition-colors"
            >
              View Public Site ↗
            </Link>
            {user && (
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center min-h-[36px] px-4 rounded-full text-xs sm:text-sm font-semibold border border-red-300 text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Log out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
