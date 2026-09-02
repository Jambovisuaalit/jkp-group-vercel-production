import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Talotekniikan rakennuttaminen, valvonta ja projektinjohto Jyväskylä",
  description:
    "Talotekniikan rakennuttaminen, valvonta, projektinjohto sekä käyttöönotot ja vastaanotot Jyväskylässä ja Keski-Suomessa.",
  alternates: { canonical: "/talotekniikka" },
};
export const dynamic = "force-dynamic";

export default async function TalotekniikkaPage() {
  const content = await getSiteContent();

  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero technical-hero">
          <div className="shell subhero-grid technical-hero-grid">
            <div className="technical-hero-copy">
              <p className="eyebrow">Talotekniikka / Keski-Suomi</p>
              <h1>Rakennuttaminen ja valvonta, jossa vastuu ei hajaannu.</h1>
              <p>
                JKP Group tukee rakennushanketta suunnittelusta käyttöönottoon. Saat
                yhden kokeneen yhteyshenkilön talotekniikan rakennuttamiseen,
                valvontaan ja projektinjohtoon.
              </p>
              <div className="hero-actions">
                <a className="button" href="#tarjouspyynto">Keskustele hankkeesta</a>
                <a className="text-link" href="#palvelut">Katso palvelut →</a>
              </div>
            </div>

            <aside className="subhero-code technical-service-index" aria-label="Talotekniikan palvelut">
              <div className="technical-index-topline">
                <span>JKP / TECHNICAL</span>
                <span>01—04</span>
              </div>
              <strong>4</strong>
              <ol>
                {content.services.map((service, index) => (
                  <li key={service.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{service.title}</b>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="section technical-services" id="palvelut">
          <div className="shell section-heading">
            <div>
              <p className="eyebrow">Palvelut</p>
              <h2>Talotekniikan vastuut hankkeen eri vaiheisiin.</h2>
            </div>
            <p>
              Palvelu voidaan rajata yhteen tehtävään tai yhdistää hankkeen läpi
              jatkuvaksi asiantuntijavastuuksi.
            </p>
          </div>
          <div className="shell service-grid">
            {content.services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <b>Sovitaan hankekohtaisesti</b>
              </article>
            ))}
          </div>
        </section>

        <section className="process-section">
          <div className="shell">
            <p className="eyebrow">Toimintamalli</p>
            <h2>Neljä vaihetta selkeään etenemiseen.</h2>
            <ol className="process-grid">
              <li><span>01</span><h3>Lähtötilanne</h3><p>Tavoitteet, rajaukset, vastuut ja päätöksenteko selväksi.</p></li>
              <li><span>02</span><h3>Suunnitelma</h3><p>Tekninen ja taloudellinen toteutusmalli ennen sitovia ratkaisuja.</p></li>
              <li><span>03</span><h3>Ohjaus</h3><p>Työn, laadun, aikataulun ja muutosten aktiivinen seuranta.</p></li>
              <li><span>04</span><h3>Luovutus</h3><p>Puutteet, dokumentit ja vastuut hallitusti maaliin.</p></li>
            </ol>
          </div>
        </section>

        <section className="contact-section" id="tarjouspyynto">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Hankekeskustelu</p>
              <h2>Kerro, missä vaiheessa hanke on nyt.</h2>
              <p>Lyhyt kuvaus kohteesta, aikataulusta ja tarvitusta vastuusta riittää ensimmäiseen arvioon.</p>
            </div>
            <ContactForm subject="Talotekniikan tarjouspyyntö" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
