import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "LVIA-valvonta ja talotekninen asiantuntijavalvonta",
  description: "LVIA-suunnitelmien tarkastus, työmaavalvonta, kustannus- ja laadunseuranta sekä testauksen, käyttöönoton ja vastaanoton valvonta.",
}, "/lvia-valvonta", "fi");
export const dynamic = "force-dynamic";



export default async function LviaValvontaPage() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero technical-hero">
          <div className="shell narrow">
            <p className="eyebrow">LVIA / talotekninen valvonta</p>
            <h1>{content.lviaPage.fi.title}</h1>
            <p>{content.lviaPage.fi.lead}</p>
            <div className="hero-actions">
              <a className="button" href="#yhteys">Kysy LVIA-valvonnasta</a>
              <Link className="text-link" href="/referenssit">Tutustu referensseihin →</Link>
            </div>
          </div>
        </section>
        <section className="section" id="valvonnan-vaiheet">
          <div className="shell section-heading">
            <div><p className="eyebrow">Valvonnan vaiheet</p><h2>{content.lviaPage.fi.phasesHeading}</h2></div>
            <p>{content.lviaPage.fi.phasesLead}</p>
          </div>
          <div className="shell lvia-phase-grid">
            {content.lviaPage.fi.phases.map((phase) => (
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
              <h2>{content.lviaPage.fi.proofTitle}</h2>
            </div>
            <div>
              <p>{content.lviaPage.fi.proofLead}</p>
              <Link className="text-link dark-link" href="/referenssit">Katso tarkemmat projektit ja tehtäväkuvaukset →</Link>
            </div>
          </div>
        </section>
        <section className="contact-section" id="yhteys">
          <div className="shell contact-grid">
            <div><p className="eyebrow">LVIA-valvonnan tarjouspyyntö</p><h2>{content.lviaPage.fi.contactTitle}</h2><p>{content.lviaPage.fi.contactLead}</p></div>
            <ContactForm subject="LVIA-valvonnan tarjouspyyntö" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
