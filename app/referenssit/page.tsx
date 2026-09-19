import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReferenceTimeline } from "@/components/ReferenceTimeline";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Referenssit",
  description: "JKP Group Oy:n LVIA-valvonnan ja talotekniikan projektireferenssit asiakkaan syyskuussa 2026 toimittaman referenssilistan mukaan.",
}, "/referenssit", "fi");
export const dynamic = "force-dynamic";

export default async function ReferenssitPage() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero reference-hero">
          <div className="shell narrow">
            <p className="eyebrow">Referenssit / talotekniikka</p>
            <h1>Hankkeita, joissa valvonta ja käyttöönotto ovat keskeisessä roolissa.</h1>
            <p>Alla asiakkaan toimittama referenssiluettelo vuosilta 2017–2026. Kohteiden nimet, ajanjaksot ja tehtäväkuvaukset on säilytetty alkuperäisen englanninkielisen aineiston mukaisina.</p>
          </div>
        </section>
        <section className="section">
          <ReferenceTimeline />
        </section>
        <section className="contact-section">
          <div className="shell contact-grid">
            <div><p className="eyebrow">Kysy kokemuksesta</p><h2>Keskustellaan hankkeesi valvontatarpeesta.</h2><p>Kerro kohde, hankevaihe ja tarvittava vastuu. JKP Group tarkentaa soveltuvan kokemuksen tapauskohtaisesti.</p></div>
            <ContactForm subject="Referenssi- ja osaamiskysely" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
