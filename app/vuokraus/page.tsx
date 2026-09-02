import type { Metadata } from "next";
import Link from "next/link";
import { BusinessPremisesForm, ApartmentApplicationForm } from "@/components/RentalForms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";
import { getPublishedRentals } from "@/lib/rentals";

export const metadata: Metadata = {
  title: "Liike- ja toimitilat, asunnot ja loma-asunnot",
  description: "JKP Group vuokraa omia liike- ja toimitiloja, asuntoja sekä loma-asuntoja ja lomakohteita.",
  alternates: { canonical: "/vuokraus" },
};
export const dynamic = "force-dynamic";

const typeLabels = {
  holiday: "Loma-asunto tai lomakohde",
  commercial: "Liike- tai toimitila",
  residential: "Vuokra-asunto",
} as const;

export default async function VuokrausPage() {
  const [content, properties] = await Promise.all([getSiteContent(), getPublishedRentals()]);

  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero rental-hero">
          <div className="shell subhero-grid">
            <div>
              <p className="eyebrow">Vuokraus / omat kohteet</p>
              <h1>{content.rental.title}</h1>
              <p>{content.rental.lead}</p>
              <div className="hero-actions technical-hero-actions">
                <a className="button" href="#toimitilakysely">Kysy liike- tai toimitilaa</a>
                <a className="text-link" href="#vuokrahakemus">Asuntohakemus →</a>
              </div>
            </div>
            <div className="hero-visual rental-blueprint"><div><span>JKP / SPACE</span><strong>Omat kohteet.</strong><p>Liike- ja toimitilat · asunnot · loma-asunnot</p></div></div>
          </div>
        </section>

        <section className="section">
          <div className="shell section-heading">
            <div><p className="eyebrow">Vuokrattavat kohteet</p><h2>Kohteet yritysten, asumisen ja vapaa-ajan tarpeisiin.</h2></div>
            <p>Liike- ja toimitiloissa painotus on Jyväskylän seudulla. Loma-asuntojen tarkat sijainnit julkaistaan kohdekohtaisesti vain vahvistettujen tietojen perusteella.</p>
          </div>

          {properties.length > 0 ? (
            <div className="shell property-grid">
              {properties.map((property) => (
                <Link className="property-card" href={`/vuokraus/${property.slug}`} key={property.id}>
                  <div className="property-media" style={property.mainImage ? { backgroundImage: `url("${property.mainImage}")` } : undefined} />
                  <div className="property-content">
                    <small>{property.city || typeLabels[property.type]}</small>
                    <h3>{property.title}</h3>
                    <p>{property.summary || property.description}</p>
                    <div className="hero-actions">
                      {property.price ? <strong>{property.price}</strong> : null}
                      <span>Tutustu kohteeseen →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="shell rental-category-grid">
              <article className="rental-category"><span>01</span><h3>Liike- ja toimitilat</h3><p>Omat liike- ja toimitilat yritysten tarpeisiin, erityisesti Jyväskylän seudulla.</p></article>
              <article className="rental-category"><span>02</span><h3>Asunnot</h3><p>Omat vuokra-asunnot. Vapaat kohteet julkaistaan, kun niiden tiedot on vahvistettu.</p></article>
              <article className="rental-category"><span>03</span><h3>Loma-asunnot</h3><p>Loma-asuntoja ja lomakohteita. Tarkat kohdetiedot julkaistaan erikseen vahvistettuna.</p></article>
            </div>
          )}
        </section>

        <section className="contact-section" id="toimitilakysely">
          <div className="shell contact-grid">
            <div><p className="eyebrow">Yrityksille</p><h2>Kerro tilatarpeesta.</h2><p>Yritys, käyttötarkoitus, tarvittava pinta-ala, sijainti ja tavoiteaikataulu riittävät ensimmäiseen arvioon.</p></div>
            <BusinessPremisesForm />
          </div>
        </section>

        <section className="section" id="vuokrahakemus">
          <div className="shell contact-grid">
            <div><p className="eyebrow">Asuntovuokraus</p><h2>Vuokralaisen hakemuslomake</h2><p>Täytä hakemus, kun olet ollut yhteydessä JKP Groupiin julkaistusta tai tarjotusta kohteesta.</p></div>
            <ApartmentApplicationForm />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
