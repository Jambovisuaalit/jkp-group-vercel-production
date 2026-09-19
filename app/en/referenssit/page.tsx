import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReferenceTimeline } from "@/components/ReferenceTimeline";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "References",
  description: "JKP Group Oy's HVAC supervision, project management and commissioning references, as supplied by the customer in September 2026.",
  alternates: { canonical: "/en/referenssit" },
};
export const dynamic = "force-dynamic";

export default async function EnglishReferences() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} locale="en" />
      <main>
        <section className="subhero reference-hero">
          <div className="shell narrow">
            <p className="eyebrow">References / building services</p>
            <h1>Selected HVAC supervision and commissioning projects.</h1>
            <p>Customer-supplied reference list covering 2017–2026. Project names, periods and responsibilities are shown as provided in the original reference material.</p>
          </div>
        </section>
        <section className="section">
          <ReferenceTimeline locale="en" />
        </section>
        <section className="contact-section">
          <div className="shell contact-grid">
            <div><p className="eyebrow">Contact</p><h2>Discuss a comparable project.</h2><p>Describe the property, project phase and required scope to discuss relevant project experience.</p></div>
            <ContactForm subject="Reference and experience enquiry" locale="en" />
          </div>
        </section>
      </main>
      <Footer content={content} locale="en" />
    </>
  );
}
