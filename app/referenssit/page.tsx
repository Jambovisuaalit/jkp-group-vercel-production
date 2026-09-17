import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Referenssit",
  description: "JKP Group Oy:n rakennuttamisen, talotekniikan ja valvonnan historiallisia referenssejä asiakkaan toimittaman aineiston perusteella.",
  alternates: { canonical: "/referenssit" },
};
export const dynamic = "force-dynamic";

const historicalReferences = [
  "Kiipulasäätiö",
  "Aro-Yhtymä Oy / Autokeskus Konala",
  "Lammin Säästöpankki",
  "Versowood Oy",
  "Loimua Oy / Vanajan Voimalaitos",
  "Krogenus Oy",
  "Etola Kiinteistöt",
  "Katepal Oy",
  "Koy Brahenkatu 20 / Euromaster Hämeenlinna",
  "As Oy Hämeenlinnan Rauhanlinna",
  "Fingrid Oyj",
];

export default async function ReferenssitPage() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero reference-hero"><div className="shell narrow"><p className="eyebrow">Referenssit</p><h1>Kokemusta rakennuttamisesta, valvonnasta ja talotekniikasta.</h1><p>Alla on poimintoja asiakkaan toimittamasta historiallisesta referenssiaineistosta. Tarkka rooli ja laajuus esitetään vain silloin, kun tieto on vahvistettu erikseen.</p></div></section>
        <section className="section"><div className="shell historical-reference-grid">{historicalReferences.map((name, index) => <article className="historical-reference" key={name}><span>{String(index + 1).padStart(2, "0")}</span><h2>{name}</h2><p>Historiallinen referenssi asiakkaan toimittaman aineiston perusteella.</p></article>)}</div></section>
        <section className="contact-section"><div className="shell contact-grid"><div><p className="eyebrow">Kysy kokemuksesta</p><h2>Tarvitsetko kokemusta vastaavasta hankkeesta?</h2><p>Kerro hanketyyppi ja tarvittava vastuu. JKP Group voi tarkentaa soveltuvan kokemuksen ja referenssit tapauskohtaisesti.</p></div><ContactForm subject="Referenssi- ja osaamiskysely" /></div></section>
      </main>
      <Footer content={content} />
    </>
  );
}
