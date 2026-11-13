import type { MetadataRoute } from "next";
import { treatments } from "@/data/treatments";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const treatmentRoutes: MetadataRoute.Sitemap = treatments.map((treatment) => ({
    url: `${siteUrl}/treatments/${treatment.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/book`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...treatmentRoutes,
  ];
}
