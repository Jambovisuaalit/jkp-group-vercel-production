import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Rakennuttaminen ja talotekninen valvonta Jyväskylä",
  description:
    "Rakennuttaminen, talotekninen valvonta, projektinjohto sekä käyttöönotto- ja vastaanottotehtävät Jyväskylässä ja Keski-Suomessa.",
  alternates: { canonical: "/talotekniikka" },
};
export const dynamic = "force-dynamic";

const phases = [
  {
    number: "01",
    title: "Esiselvitysvaihe",
    items: ["Luonnossuunnittelu", "Vaihtoehtotarkastelut", "Toteutustapamallit", "Kustannusarviot", "Budjetointi", "Sopimusasiat"],
  },
  {
    number: "02",
    title: "Toteutusvaihe",
    items: ["Toteutussuunnittelu", "Urakkakilpailutus", "LVI- ja talotekninen valvonta", "Kustannusseuranta ja raportointi", "Viranomaisneuvottelut", "Talotekniikan asiantuntijavalvonta"],
  },
  {
    number: "03",
    title: "Vastaanottovaihe",
    items: ["Vastaanotto- ja luovutustehtävät", "Taloudellinen loppuselvitys", "Takuuajan tehtävät"],
  },
];

export default async function TalotekniikkaPage() {
  const content = await getSiteContent();

  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero technical-hero">
          <div className="shell subhero-grid technical-hero-grid">
            <div className="technical-hero-copy">
              <p className="eyebrow">Rakennuttaminen / talotekniikka</p>
              <h1>Hankkeen kokonaisuus hallintaan esiselvityksestä vastaanottoon.</h1>
              <p>
                JKP Group kokoaa rakennuttamisen, taloteknisen valvonnan ja projektinjohdon
                yhdeksi selkeäksi kokonaisuudeksi. Tavoitteena on toteutuskelpoinen ratkaisu,
                hallittu kustannus ja dokumentoitu lopputulos.
              </p>
              <div className="hero-actions technical-hero-actions">
                <a className="button" href="#tarjouspyynto">Keskustele hankkeesta</a>
                <a className="text-link" href="#vaiheet">Katso hankkeen vaiheet →</a>
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
              <h2>Rakennuttamisen ja valvonnan vastuut hankkeen eri vaiheisiin.</h2>
            </div>
            <p>
              Palvelu voidaan rajata yksittäiseen tehtävään tai rakentaa koko hankkeen läpi
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

        <section className="process-section" id="vaiheet">
          <div className="shell">
            <p className="eyebrow">Rakennuttamisen eteneminen</p>
            <h2>Kolme vaihetta tarpeesta vastaanottoon.</h2>
            <div className="delivery-phase-grid">
              {phases.map((phase) => (
                <article className="delivery-phase" key={phase.number}>
                  <span>{phase.number}</span>
                  <h3>{phase.title}</h3>
                  <ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section supervision-section">
          <div className="shell section-heading">
            <div>
              <p className="eyebrow">Valvonta</p>
              <h2>Laatu, toteutettavuus ja dokumentointi näkyviksi työmaalla.</h2>
            </div>
            <p>
              Valvonta kattaa yleisvalvonnan, ajallisen valvonnan, teknisen ja laadullisen
              valvonnan, taloudellisen valvonnan sekä dokumentoinnin. Taloteknisissä ratkaisuissa
              huomioidaan myös toteutettavuus ja ylläpidettävyys kiinteistön elinkaaren aikana.
            </p>
          </div>
        </section>

        <section className="contact-section" id="tarjouspyynto">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Hankekeskustelu</p>
              <h2>Kerro, missä vaiheessa hanke on nyt.</h2>
              <p>Lyhyt kuvaus kohteesta, aikataulusta ja tarvitusta vastuusta riittää ensimmäiseen arvioon.</p>
            </div>
            <ContactForm subject="Rakennuttamisen ja talotekniikan tarjouspyyntö" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
