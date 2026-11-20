"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileCallBar } from "@/components/MobileCallBar";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <MobileCallBar />
    </>
  );
}

