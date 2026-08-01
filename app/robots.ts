import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://jkpgroup.fi").replace(/\/$/, "");
  const indexingEnabled = process.env.SITE_INDEXING_ENABLED === "true";

  return {
    rules: indexingEnabled
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
