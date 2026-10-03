import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "HVAC & Building Services Supervision",
  description: "HVAC plan review, construction supervision, quality and cost follow-up, testing, commissioning and handover support for construction projects.",
}, "/lvia-valvonta", "en");
export const dynamic = "force-dynamic";



export default async function EnglishLvia() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} locale="en" />
      <main>
        <section className="subhero technical-hero">
          <div className="shell narrow">
            <p className="eyebrow">HVAC / building services supervision</p>
            <h1>{content.lviaPage.en.title}</h1>
            <p>{content.lviaPage.en.lead}</p>
            <div className="hero-actions">
              <a className="button" href="#contact">Discuss HVAC supervision</a>
              <Link className="text-link" href="/en/referenssit">View project references →</Link>
            </div>
          </div>
        </section>
        <section className="section" id="supervision-phases">
          <div className="shell section-heading">
            <div><p className="eyebrow">Project phases</p><h2>{content.lviaPage.en.phasesHeading}</h2></div>
            <p>{content.lviaPage.en.phasesLead}</p>
          </div>
          <div className="shell lvia-phase-grid">
            {content.lviaPage.en.phases.map((phase) => (
              <article className="lvia-phase" key={phase.number}>
                <span>{phase.number}</span><h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
        <section className="section supervision-section">
          <div className="shell lvia-proof-layout">
            <div><p className="eyebrow">Project experience</p><h2>{content.lviaPage.en.proofTitle}</h2></div>
            <div><p>{content.lviaPage.en.proofLead}</p><Link className="text-link dark-link" href="/en/referenssit">Read the project list and roles →</Link></div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div><p className="eyebrow">HVAC supervision enquiry</p><h2>{content.lviaPage.en.contactTitle}</h2><p>{content.lviaPage.en.contactLead}</p></div>
            <ContactForm subject="HVAC supervision enquiry" locale="en" />
          </div>
        </section>
      </main>
      <Footer content={content} locale="en" />
    </>
  );
}
