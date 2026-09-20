import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Company",
  description: "JKP Group Oy's principles and history: HVAC contracting, design, consultancy, rental of own properties, construction project management and technical supervision.",
}, "/yritys", "en");
export const dynamic = "force-dynamic";

const phases = [
  {
    title: "Early operations and the 1990s",
    paragraphs: [
      "Operations began under the name LVI-insinööritoimisto Mikroplast Oy. The company later became JKP Group Oy following a business transaction.",
      "In the 1990s, the business included HVAC contracting and turnkey building projects. Installation work was carried out by subcontractors, while planning, documentation and project management were handled in-house.",
      "Projects included housing, commercial premises and small-scale industrial construction.",
    ],
  },
  {
    title: "The 2000s",
    paragraphs: [
      "As demand for HVAC design grew, the company discontinued turnkey contracting and concentrated on HVAC design and consultancy.",
      "The work covered HVAC design and supervision, technical surveys and condition assessments for residential, commercial, industrial and public-sector buildings, including new-build and renovation projects.",
    ],
  },
  {
    title: "The 2010s",
    paragraphs: [
      "Following a business transaction, operations continued mainly through the rental of the company's own commercial premises and tenant-specific modifications to those properties.",
    ],
  },
  {
    title: "2016 and beyond",
    paragraphs: [
      "In 2016, JKP Group and Fimpec Oy jointly established Fimpec Talotekniikka Oy, in which JKP Group held a 20 percent stake.",
      "The stake was later sold in connection with transactions involving the parent company, while cooperation with Fimpec Oy continued. Project management, supervision and major industrial projects became central areas of activity.",
    ],
  },
];

export default async function CompanyPage() {
  const content = await getSiteContent();
  const image = content.media.technicalImageUrl || "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg";
  return (
    <>
      <Header email={content.company.email} locale="en" />
      <main>
        <section className="subhero company-hero">
          <div className="shell narrow">
            <p className="eyebrow">Company</p>
            <h1>JKP Group Oy</h1>
            <p>Building services project management, technical supervision and property operations.</p>
          </div>
        </section>
        <section className="section company-profile">
          <div className="shell company-profile-grid">
            <div className="company-profile-text">
              <p className="eyebrow">Our approach</p>
              <h2>Practical solutions based on our clients&apos; needs.</h2>
              <p>Our aim is to identify modern, cost-effective solutions. We first establish the client&apos;s needs and seek an overall outcome at a reasonable cost.</p>
              <p>We consider the building&apos;s lifecycle requirements and environmental economics, with an emphasis on openness, reliability and integrity.</p>
              <p>We adapt to changing circumstances and continuously develop our planning and operating methods to support a viable business.</p>
            </div>
            <div className="company-profile-image">
              <img src={image} alt="JKP Group Oy building services illustration" loading="lazy" />
            </div>
          </div>
        </section>
        <section className="section company-history" id="history">
          <div className="shell">
            <p className="eyebrow">Our background</p>
            <h2>History</h2>
            <div className="company-history-list">
              {phases.map((phase) => (
                <article className="company-history-item" key={phase.title}>
                  <h3>{phase.title}</h3>
                  <div>{phase.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                </article>
              ))}
            </div>
            <Link href="/en/referenssit" className="text-link dark-link">View project references →</Link>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Direct contact</p>
              <h2>Jari Koskela</h2>
              <p>Managing Director / JKP Group Oy</p>
              <a className="contact-email" href={"mailto:" + content.company.email}>{content.company.email}</a>
              {content.company.phone ? <a className="contact-email" href={"tel:" + content.company.phone.replace(/\s/g, "")}>{content.company.phone}</a> : null}
            </div>
            <ContactForm subject="Contact request / Company" locale="en" />
          </div>
        </section>
      </main>
      <Footer content={content} locale="en" />
    </>
  );
}
