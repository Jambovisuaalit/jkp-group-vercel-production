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

const phases = [
  {
    number: "01",
    title: "Design review and feasibility",
    description: "Review of HVAC plans, interfaces and equipment with attention to practical implementation, system performance and maintainability.",
    items: ["HVAC design review", "Coordination of technical interfaces", "Consideration of lifecycle costs"],
  },
  {
    number: "02",
    title: "Construction supervision",
    description: "Site follow-up for technical quality, conformity with plans and implementation progress, including documenting and following up observations.",
    items: ["Technical and quality supervision of installations", "Observation and corrective-action follow-up", "Support for schedule and cost follow-up"],
  },
  {
    number: "03",
    title: "Testing and commissioning",
    description: "Follow-up of system tests, adjustments and commissioning activities, with a focus on operational systems before handover.",
    items: ["Testing and functional checks", "Commissioning preparation and follow-up", "Verification of corrective actions"],
  },
  {
    number: "04",
    title: "Handover and warranty period",
    description: "Review of system operation and handover documentation, followed by agreed warranty-period tasks where included in the assignment.",
    items: ["Technical handover checks", "Commissioning and handover documents", "Agreed warranty-period follow-up"],
  },
] as const;

export default async function EnglishLvia() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} locale="en" />
      <main>
        <section className="subhero technical-hero">
          <div className="shell narrow">
            <p className="eyebrow">HVAC / building services supervision</p>
            <h1>Functional and cost-efficient HVAC solutions throughout the building lifecycle.</h1>
            <p>JKP Group supports projects from design review through site supervision, system testing, commissioning and handover. The aim is a functional technical solution that is economical to implement and maintain.</p>
            <div className="hero-actions">
              <a className="button" href="#contact">Discuss HVAC supervision</a>
              <Link className="text-link" href="/en/referenssit">View project references →</Link>
            </div>
          </div>
        </section>
        <section className="section" id="supervision-phases">
          <div className="shell section-heading">
            <div><p className="eyebrow">Project phases</p><h2>Clearly defined responsibilities from plans to handover.</h2></div>
            <p>The scope is agreed for each project. Supervision can be provided as a specific assignment or as part of a wider project-management responsibility.</p>
          </div>
          <div className="shell lvia-phase-grid">
            {phases.map((phase) => (
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
            <div><p className="eyebrow">Project experience</p><h2>Supervision in technically demanding environments.</h2></div>
            <div><p>The customer-supplied reference material includes HVAC supervision and commissioning in industrial facilities, airport environments and other construction projects.</p><Link className="text-link dark-link" href="/en/referenssit">Read the project list and roles →</Link></div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div><p className="eyebrow">HVAC supervision enquiry</p><h2>Tell us about your project.</h2><p>Share the property and location, current project phase, relevant HVAC systems, target schedule and expected scope. Responsibilities are agreed for each assignment.</p></div>
            <ContactForm subject="HVAC supervision enquiry" locale="en" />
          </div>
        </section>
      </main>
      <Footer content={content} locale="en" />
    </>
  );
}
