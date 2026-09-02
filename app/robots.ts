import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isProductionDomain = configuredSiteUrl === "https://jkpgroup.fi";

  if (!isProductionDomain) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: "https://jkpgroup.fi/sitemap.xml",
  };
}
