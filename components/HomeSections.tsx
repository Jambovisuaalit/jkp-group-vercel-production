import Link from "next/link";
import type { SiteContent } from "@/content/defaults";

export function HomeSections({ content, locale = "fi" }: { content: SiteContent; locale?: "fi" | "en" }) {
  const en = locale === "en";
  const prefix = en ? "/en" : "";
  const tiles = [
    { slug: "talotekniikka", title: en ? "Building services project management" : "Talotekniikan rakennuttamispalvelut" },
    { slug: "lvia-valvonta", title: en ? "Supervision services" : "Valvontapalvelut" },
    { slug: "vuokraus", title: en ? "Property rental" : "Vuokrauspalvelut" },
  ];
  const gallery = content.media.referenceImages.filter(Boolean);
  return (
    <>
      <section className="section home-service-section" id={en ? "services" : "palvelut"}>
        <div className="shell">
          <h2 className="home-service-heading">{en ? "BUILDING SERVICES PROJECT MANAGEMENT AND SUPERVISION — YEARS OF EXPERIENCE" : "TALOTEKNIIKAN RAKENNUTTAMIS- JA VALVONTATEHTÄVIÄ VUOSIEN KOKEMUKSELLA"}</h2>
          <div className="home-service-grid">
            {tiles.map((tile, index) => (
              <Link className="home-service-tile" href={`${prefix}/${tile.slug}`} key={tile.slug}>
                {content.media.serviceImages[index] ? (
                  <img src={content.media.serviceImages[index]} alt={tile.title} loading="lazy" />
                ) : (
                  <span className="home-image-placeholder" aria-hidden="true"><span>JKP</span></span>
                )}
                <span className="home-service-text"><strong>{tile.title}</strong><span className="home-service-cta">{en ? "Explore service" : "Tutustu palveluun"} →</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-references-section">
        <div className="shell">
          <div className="home-reference-heading"><h2>{en ? "References" : "Referenssejä"}</h2><Link href={`${prefix}/referenssit`}>{en ? "View the project reference list" : "Katso referenssiluettelo"} →</Link></div>
          {gallery.length ? (
            <div className="home-reference-gallery">{gallery.map((src, index) => <Link href={`${prefix}/referenssit`} key={index}><img src={src} alt={en ? `JKP Group project reference photo ${index + 1}` : `JKP Groupin referenssikuva ${index + 1}`} loading="lazy" /></Link>)}</div>
          ) : (
            <div className="home-reference-empty"><p>{en ? "Project photographs will be added when approved for publication." : "Referenssikuvat lisätään, kun niiden julkaisu on vahvistettu."}</p><Link href={`${prefix}/referenssit`}>{en ? "Read the project list" : "Tutustu projektireferensseihin"} →</Link></div>
          )}
        </div>
      </section>
    </>
  );
}
