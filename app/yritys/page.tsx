import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Yritys",
  description:
    "JKP Group Oy on vuonna 1993 perustettu rakennuttamisen, talotekniikan ja kiinteistöjen asiantuntijayhtiö Jyväskylässä ja Keski-Suomessa.",
  alternates: { canonical: "/yritys" },
};

export const dynamic = "force-dynamic";

export default async function YritysPage() {
  const content = await getSiteContent();

  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero">
          <div className="shell narrow">
            <p className="eyebrow">JKP Group Oy / vuodesta 1993</p>
            <h1>Rakennuttamisen, talotekniikan ja kiinteistöjen asiantuntijayhtiö.</h1>
            <p>
              JKP Group Oy palvelee rakennushankkeissa, taloteknisessä valvonnassa ja
              projektinjohdossa sekä vuokraa omia liike- ja toimitiloja, asuntoja ja
              loma-asuntoja.
            </p>
          </div>
        </section>

        <section className="section about-section">
          <div className="shell about-grid">
            <div className="about-panel">
              <span>1993</span>
              <strong>perustettu</strong>
              <p>{content.company.area}</p>
            </div>
            <div className="about-copy">
              <p className="eyebrow">Toimintatapa</p>
              <h2>{content.about.title}</h2>
              <p>{content.about.body}</p>
              <Link className="text-link dark-link" href="/referenssit">
                Katso referenssit →
              </Link>
            </div>
          </div>
        </section>

        <section className="section business-section">
          <div className="shell section-heading">
            <div>
              <p className="eyebrow">Palvelukokonaisuudet</p>
              <h2>Kaksi liiketoiminta-aluetta, selkeä yhteyshenkilö.</h2>
            </div>
            <p>
              Rakennuttaminen ja talotekniikka sekä omien kohteiden vuokraustoiminta
              muodostavat JKP Groupin kaksi palvelukokonaisuutta.
            </p>
          </div>
          <div className="shell business-grid">
            {content.businessAreas.map((area, index) => (
              <Link className="business-card" href={`/${area.slug}`} key={area.slug}>
                <span className="eyebrow">0{index + 1}</span>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                </div>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="contact-section" id="yhteys">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Suora yhteys</p>
              <h2>Jari Koskela</h2>
              <p>Toimitusjohtaja / JKP Group Oy</p>
              <a className="contact-email" href={`mailto:${content.company.email}`}>
                {content.company.email}
              </a>
              {content.company.phone ? (
                <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>
                  {content.company.phone}
                </a>
              ) : null}
            </div>
            <ContactForm subject="Yhteydenottopyyntö / Yritys" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
