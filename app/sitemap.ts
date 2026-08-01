import type { MetadataRoute } from "next";
import { getPublishedRentals } from "@/lib/rentals";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://jkpgroup.fi").replace(/\/$/, "");
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/talotekniikka`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/vuokraus`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/referenssit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const rentals = await getPublishedRentals();
  return [
    ...staticPages,
    ...rentals.map((property) => ({
      url: `${base}/vuokraus/${encodeURIComponent(property.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
