import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.VERCEL_ENV === "production" ? "https://www.jkpgroup.fi" : process.env.NEXT_PUBLIC_SITE_URL || "https://jkp-group-asiakas.vercel.app";
  const paths = [
    "",
    "/yritys",
    "/talotekniikka",
    "/lvia-valvonta",
    "/vuokraus",
    "/referenssit",
    "/en",
    "/en/yritys",
    "/en/talotekniikka",
    "/en/lvia-valvonta",
    "/en/vuokraus",
    "/en/referenssit",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/en" ? "weekly" : "monthly",
    priority: path === "" || path === "/en" ? 1 : 0.8,
  }));
}
