import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://jkpgroup.fi";
  const paths = ["", "/talotekniikka", "/lvia-valvonta", "/vuokraus", "/referenssit", "/en", "/en/talotekniikka", "/en/lvia-valvonta", "/en/vuokraus", "/en/referenssit"];
  return paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "" || path === "/en" ? "weekly" : "monthly", priority: path === "" || path === "/en" ? 1 : 0.8 }));
}
