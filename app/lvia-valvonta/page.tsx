import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "LVIA-valvonta ja talotekninen asiantuntijavalvonta",
  description: "LVIA-valvonta, talotekninen asiantuntijavalvonta, laadunvarmistus ja dokumentointi rakennushankkeissa.",
  alternates: { canonical: "/lvia-valvonta" },
};
export const dynamic = "force-dynamic";

const responsibilities = [
  ["01", "Suunnitelmien läpikäynti", "Taloteknisten ratkaisujen toteutettavuuden ja yhteensopivuuden tarkastelu ennen toteutusta."],
  ["02", "Työmaan valvonta", "LVI- ja taloteknisten töiden etenemisen, laadun ja toteutuksen seuranta työmaalla."],
  ["03", "Käyttöönotto ja vastaanotto", "Toimivuuden, dokumentoinnin ja luovutusaineiston tarkastaminen hankkeen loppuvaiheessa."],
  ["04", "Elinkaaren näkökulma", "Ylläpidettävyys ja teknisten ratkaisujen toimivuus huomioidaan osana kokonaisuutta."],
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
            <h1>Talotekniikan toteutus hallintaan suunnitelmista käyttöönottoon.</h1>
            <p>JKP Groupin LVIA-valvonta yhdistää teknisen asiantuntemuksen, työmaan seurannan ja dokumentoinnin yhdeksi selkeäksi vastuuksi.</p>
            <div className="hero-actions"><a className="button" href="#yhteys">Keskustele valvonnasta</a><a className="text-link" href="/talotekniikka">Kaikki talotekniikan palvelut →</a></div>
          </div>
        </section>
        <section className="section">
          <div className="shell section-heading"><div><p className="eyebrow">Valvonnan kokonaisuus</p><h2>Tekninen laatu näkyväksi hankkeen jokaisessa vaiheessa.</h2></div><p>Valvonnan sisältö määritellään hankkeen, toteutusmuodon ja tarvittavan vastuun mukaan.</p></div>
          <div className="shell service-grid">{responsibilities.map(([number, title, text]) => <article className="service-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>
        <section className="section supervision-section"><div className="shell"><p className="eyebrow">Mitä valvonnassa seurataan</p><h2>Laatu, aikataulu, toteutettavuus ja dokumentointi.</h2><div className="shell" style={{ width: "100%", padding: 0, marginTop: 34 }}><p>LVIA-valvonnassa seurataan suunnitelmien mukaista toteutusta, työn laatua, työvaiheiden etenemistä, havaintojen käsittelyä sekä vastaanottoon tarvittavaa dokumentaatiota. Tarvittaessa valvonta kytketään osaksi rakennuttamisen muuta projektinjohtoa.</p></div></div></section>
        <section className="contact-section" id="yhteys"><div className="shell contact-grid"><div><p className="eyebrow">Valvontapyyntö</p><h2>Kerro hankkeesta.</h2><p>Kohde, vaihe, aikataulu ja tarvittavan valvonnan laajuus riittävät ensimmäiseen keskusteluun.</p></div><ContactForm subject="LVIA-valvonnan tarjouspyyntö" /></div></section>
      </main>
      <Footer content={content} />
    </>
  );
}
