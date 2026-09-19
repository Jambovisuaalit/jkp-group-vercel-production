import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "LVIA-valvonta ja talotekninen asiantuntijavalvonta",
  description: "LVIA-suunnitelmien tarkastus, työmaavalvonta, kustannus- ja laadunseuranta sekä testauksen, käyttöönoton ja vastaanoton valvonta.",
  alternates: { canonical: "/lvia-valvonta" },
};
export const dynamic = "force-dynamic";

const phases = [
  {
    number: "01",
    title: "Suunnitelmat ja toteutettavuus",
    description: "LVI-teknisten suunnitelmien, laitteistojen ja rajapintojen läpikäynti ennen toteutusta. Tarkastelu kohdistuu toimivuuteen, toteutettavuuteen ja ylläpidettävyyteen.",
    items: ["Suunnitelmien läpikäynti", "Teknisten ratkaisujen yhteensovitus", "Elinkaaren kustannusten huomiointi"],
  },
  {
    number: "02",
    title: "Rakentamisen valvonta",
    description: "Asennusten laadun, suunnitelmien mukaisuuden ja työvaiheiden seuranta työmaalla sekä havaintojen dokumentointi ja käsittely hankkeen osapuolten kanssa.",
    items: ["Asennusten tekninen ja laadullinen seuranta", "Poikkeamien ja korjausten seuranta", "Aikataulun ja kustannusten seurannan tuki"],
  },
  {
    number: "03",
    title: "Testaus ja käyttöönotto",
    description: "LVI-järjestelmien toimintakokeiden, säätöjen ja käyttöönoton valmistelun ja toteutumisen seuranta. Tarkoitus on varmistaa toimivat järjestelmät ennen luovutusta.",
    items: ["Toimintakokeiden ja testauksen seuranta", "Käyttöönoton vaiheistus", "Havaittujen puutteiden korjausten toteaminen"],
  },
  {
    number: "04",
    title: "Vastaanotto ja takuuaika",
    description: "Järjestelmien toimivuuden ja luovutusaineiston tarkastelu vastaanottovaiheessa sekä sovittujen takuuajan tehtävien seuranta.",
    items: ["Vastaanoton tekniset tarkastukset", "Luovutus- ja käyttöönottodokumentit", "Sovitut takuuajan tehtävät"],
  },
] as const;

export default async function LviaValvontaPage() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero technical-hero">
          <div className="shell narrow">
            <p className="eyebrow">LVIA / talotekninen valvonta</p>
            <h1>Toimivat ja kustannustehokkaat LVI-ratkaisut koko elinkaarelle.</h1>
            <p>JKP Group tukee hanketta suunnitelmien arvioinnista asennusten valvontaan, testaukseen, käyttöönottoon ja vastaanottoon. Valvonnan tavoitteena on toimiva tekninen toteutus, joka on taloudellinen toteuttaa ja ylläpitää.</p>
            <div className="hero-actions">
              <a className="button" href="#yhteys">Kysy LVIA-valvonnasta</a>
              <Link className="text-link" href="/referenssit">Tutustu referensseihin →</Link>
            </div>
          </div>
        </section>
        <section className="section" id="valvonnan-vaiheet">
          <div className="shell section-heading">
            <div><p className="eyebrow">Valvonnan vaiheet</p><h2>Selkeä vastuu suunnitelmista vastaanottoon.</h2></div>
            <p>Työn sisältö ja vastuun laajuus määritellään hankekohtaisesti. Valvonta voidaan toteuttaa erillisenä toimeksiantona tai osana rakennuttamisen kokonaisuutta.</p>
          </div>
          <div className="shell lvia-phase-grid">
            {phases.map((phase) => (
              <article className="lvia-phase" key={phase.number}>
                <span>{phase.number}</span>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
        <section className="section supervision-section">
          <div className="shell lvia-proof-layout">
            <div>
              <p className="eyebrow">Kokemus / teollisuus ja kiinteistöt</p>
              <h2>Valvontaa myös vaativissa teknisissä hankkeissa.</h2>
            </div>
            <div>
              <p>Asiakkaan toimittama referenssiaineisto kattaa muun muassa taloteknistä valvontaa ja käyttöönottoa teollisuuslaitoksissa, lentokenttäympäristössä ja muissa rakennushankkeissa.</p>
              <Link className="text-link dark-link" href="/referenssit">Katso tarkemmat projektit ja tehtäväkuvaukset →</Link>
            </div>
          </div>
        </section>
        <section className="contact-section" id="yhteys">
          <div className="shell contact-grid">
            <div><p className="eyebrow">LVIA-valvonnan tarjouspyyntö</p><h2>Kerro hankkeesi nykytilanteesta.</h2><p>Ilmoita kohde ja sijainti, uudis- tai korjaushankkeen vaihe, tarvittavat järjestelmät, tavoiteaikataulu sekä valvonnan toivottu laajuus. Sovitaan tarkempi sisältö hankekohtaisesti.</p></div>
            <ContactForm subject="LVIA-valvonnan tarjouspyyntö" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
