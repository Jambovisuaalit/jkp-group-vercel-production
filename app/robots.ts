import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: "https://jkpgroup.fi/sitemap.xml",
  };
}
