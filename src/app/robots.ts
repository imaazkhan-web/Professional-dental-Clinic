import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // NOTE: Abhi practice project ke liye site noindex rakhi hai.
      // Real clinic launch ke waqt disallow hata kar allow: "/" karna hai.
      disallow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
