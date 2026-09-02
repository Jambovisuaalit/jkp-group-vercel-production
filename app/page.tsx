import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <Header email={content.company.email} variant="light" />
      <main>
        <section className="hero client-home-hero">
          <div className="shell client-home-hero-inner">
            <div className="client-home-hero-copy">
              <p className="client-home-kicker"><span aria-hidden="true" />VUODESTA 1995</p>
              <h1>
                Rakentamisen ja kiinteistöliiketoiminnan{" "}
                <em>asiantuntijapalveluita</em> vuosien kokemuksella
              </h1>
              <p className="client-home-lead">Toimivaa talotekniikkaa vuodesta 1995.</p>
              <div className="hero-actions client-home-actions">
                <Link className="button" href="/talotekniikka">Tutustu palveluihin</Link>
                <a className="text-link dark-link" href="#yhteys">Ota yhteyttä →</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section business-section">
          <div className="shell section-heading">
            <div>
              <p className="eyebrow">Kaksi palvelukokonaisuutta</p>
              <h2>Rakennushanke tai vuokratarve — yksi selkeä reitti eteenpäin.</h2>
            </div>
            <p>Rakennuttamisen ja talotekniikan asiantuntijapalvelut sekä omien kohteiden vuokraustoiminta on erotettu omiksi kokonaisuuksikseen.</p>
          </div>
          <div className="shell business-grid">
            {content.businessAreas.map((area, index) => (
              <Link className="business-card" href={`/${area.slug}`} key={area.slug}>
                <span className="eyebrow">0{index + 1}</span>
                <div><h3>{area.title}</h3><p>{area.summary}</p></div>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section about-section">
          <div className="shell about-grid">
            <div className="about-panel">
              <span>30+</span>
              <strong>vuotta kokemusta</strong>
              <p>Rakennuttamisen, talotekniikan ja kiinteistöjen asiantuntijapalvelut.</p>
            </div>
            <div className="about-copy">
              <p className="eyebrow">Rakennuttaminen ja valvonta</p>
              <h2>{content.about.title}</h2>
              <p>{content.about.body}</p>
              <Link className="text-link dark-link" href="/referenssit">Katso referenssit →</Link>
            </div>
          </div>
        </section>

        <section className="section services-preview">
          <div className="shell section-heading">
            <div><p className="eyebrow">Talotekniikka</p><h2>Vastuut hankkeen eri vaiheisiin.</h2></div>
          </div>
          <div className="shell service-grid">
            {content.services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span>0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="yhteys">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Suora yhteys</p>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.body}</p>
              <a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a>
              {content.company.phone ? <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a> : null}
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer content={content} />
      <a className="mobile-contact home-mobile-contact" href="#yhteys">Ota yhteyttä <span aria-hidden="true">→</span></a>
    </>
  );
}
