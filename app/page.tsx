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
      <Header email={content.company.email} />
      <main>
        <section className="hero blueprint-hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>{content.hero.title}</h1>
              <p className="hero-lead">{content.hero.lead}</p>
              <div className="hero-actions">
                <a className="button" href="#yhteys">Kerro hankkeesta</a>
                <Link className="text-link" href="/talotekniikka">
                  Tutustu palveluihin <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="proof-row" aria-label="JKP Groupin luottamusluvut">
                <div><strong>1993</strong><span>Perustettu</span></div>
                <div><strong>30+ v</strong><span>Kokemusta</span></div>
                <div><strong>Keski-Suomi</strong><span>Toiminta-alue</span></div>
              </div>
            </div>

            <div className="hero-visual blueprint-panel" aria-label="Rakennushankkeen suunnittelu ja toteutus">
              <div className="blueprint-topline"><span>JKP GROUP OY</span><span>RAKENNUTTAMINEN / TALOTEKNIIKKA</span></div>
              <div className="blueprint-sheet" aria-hidden="true">
                <span className="bp-line bp-line-a" />
                <span className="bp-line bp-line-b" />
                <span className="bp-line bp-line-c" />
                <span className="bp-box bp-box-a" />
                <span className="bp-box bp-box-b" />
                <span className="bp-circle" />
                <strong>JKP</strong>
              </div>
              <div className="visual-footer"><span>Esiselvitys</span><span>Toteutus</span><span>Vastaanotto</span></div>
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
              <span>1993</span>
              <strong>JKP Group Oy</strong>
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
      <a className="mobile-contact" href="#yhteys">Ota yhteyttä <span aria-hidden="true">→</span></a>
    </>
  );
}
