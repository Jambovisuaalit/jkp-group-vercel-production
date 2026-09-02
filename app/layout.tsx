import type { Metadata } from "next";
import "./globals.css";
import "./client-theme.css";
import "./home-mobile-fix.css";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = configuredSiteUrl || "https://jkpgroup.fi";
const isProductionDomain = configuredSiteUrl === "https://jkpgroup.fi";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "JKP Group Oy | Rakennuttaminen, talotekniikka ja vuokraus", template: "%s | JKP Group Oy" },
  description: "JKP Group Oy tarjoaa rakennuttamisen, taloteknisen valvonnan ja projektinjohdon asiantuntijapalveluja sekä vuokraa omia liike- ja toimitiloja, asuntoja ja loma-asuntoja.",
  robots: isProductionDomain
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  alternates: { canonical: "/" },
  openGraph: {
    locale: "fi_FI",
    type: "website",
    siteName: "JKP Group Oy",
    title: "JKP Group Oy | Rakennuttaminen, talotekniikka ja vuokraus",
    description: "Rakennuttamisen ja talotekniikan asiantuntijapalvelut sekä omien kohteiden vuokraustoiminta.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "JKP Group Oy",
    legalName: "JKP Group Oy",
    url: siteUrl,
    email: "jari.koskela@jkpgroup.fi",
    telephone: "+358500689855",
    areaServed: "Keski-Suomi",
    foundingDate: "1993-05-12",
    identifier: "0923519-9",
    employee: {
      "@type": "Person",
      name: "Jari Koskela",
      jobTitle: "Toimitusjohtaja",
    },
  };

  return (
    <html lang="fi">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}
