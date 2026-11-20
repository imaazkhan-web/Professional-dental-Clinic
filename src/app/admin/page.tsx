import type { Metadata } from "next";
import { requireAdmin } from "@/lib/supabase/server";
import { logoutAdmin } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-[720px] mx-auto bg-white border border-[#BDD3F0] rounded-[20px] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#0F2A4A] tracking-tight">
              Admin dashboard
            </h1>
            <p className="text-sm text-[#3E5575] mt-1.5">
              Logged-in email: <span className="font-semibold text-[#0F2A4A]">{user.email}</span>
            </p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-semibold text-sm border-2 border-red-600 text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

