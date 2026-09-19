import type { Metadata } from "next";

/**
 * Six direct FI/EN page pairs use the same production URL map.
 * Preview deployments remain noindex via the root layout; SEO references
 * always point to the canonical production host, not a Vercel preview.
 */
const ORIGIN = "https://www.jkpgroup.fi";
export type SiteLocale = "fi" | "en";

export function withLocalizedSeo(
  pageMetadata: Metadata,
  route: "" | "/yritys" | "/talotekniikka" | "/lvia-valvonta" | "/vuokraus" | "/referenssit",
  locale: SiteLocale,
): Metadata {
  const fiUrl = ORIGIN + (route || "");
  const enUrl = ORIGIN + (route === "/tietosuoja" ? "/en/privacy" : "/en" + route);
  const currentUrl = locale === "fi" ? fiUrl : enUrl;
  const ogLocale = locale === "fi" ? "fi_FI" : "en_GB";
  const alternateOgLocale = locale === "fi" ? "en_GB" : "fi_FI";

  return {
    ...pageMetadata,
    alternates: {
      ...pageMetadata.alternates,
      canonical: currentUrl,
      languages: { fi: fiUrl, en: enUrl },
    },
    openGraph: {
      ...pageMetadata.openGraph,
      type: "website",
      siteName: "JKP Group Oy",
      title: typeof pageMetadata.title === "string"
        ? pageMetadata.title
        : "JKP Group Oy | Rakennuttaminen, talotekniikka ja vuokraus",
      description: pageMetadata.description ?? undefined,
      url: currentUrl,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
    },
  };
}
