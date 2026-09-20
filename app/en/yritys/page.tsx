import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Company",
  description: "JKP Group Oy's approach and history in HVAC contracting, design, consulting, building services supervision and property rental.",
}, "/yritys", "en");
export const dynamic = "force-dynamic";
const history = [
  { era: "Origins", texts: ["The business began under the name LVI-insinööritoimisto Mikroplast Oy and later became JKP Group Oy following a business transaction."] },
  { era: "1990s", texts: ["We carried out turnkey HVAC contracting in housing, commercial premises and smaller industrial construction. Installation work was handled by subcontractors, while our own work included design, documentation and project management.", "This contracting experience provided practical knowledge of cost-efficient overall solutions."] },
  { era: "2000s", texts: ["As demand for HVAC design grew, turnkey contracting was phased out and the business focused on HVAC design, consulting, supervision, studies and condition assessments.", "Projects included housing, commercial, industrial and public-sector buildings, covering both new-build and renovation work."] },
  { era: "2010s", texts: ["Following a business transaction, operations focused primarily on renting our own commercial premises and making customer-specific alterations to them."] },
  { era: "2016 onwards", texts: ["Together with Fimpec Oy, we established Fimpec Talotekniikka Oy in 2016, with a 20% ownership interest. Following transactions involving the parent company, we sold our share and continued our cooperation with Fimpec Oy.", "Project management and supervision became central business activities, including projects in large-scale industry."] },
];
export default async function CompanyPage() {
  const content = await getSiteContent();
  return <>
    <Header email={content.company.email} locale="en" />
    <main>
      <section className="company-intro"><div className="shell company-intro-grid">
        <div className="company-copy">
          <p className="eyebrow">JKP Group Oy / Company</p>
          <h1>Service backed by years of experience.</h1>
          <p>Our aim is to find affordable, modern solutions for customers. We begin by understanding their needs and seek a comprehensive result at a reasonable cost.</p>
          <p>We consider the property&apos;s lifecycle requirements and environmental economics. Openness, reliability and honesty are central to how we work.</p>
          <p>We respond to a changing world by adapting and following developments. We continually improve our planning and operating methods while maintaining profitable operations.</p>
        </div>
        <figure className="company-photo">{content.media.companyImageUrl ? <img src={content.media.companyImageUrl} alt="Customer-provided building services project photograph" loading="eager" /> : null}</figure>
      </div></section>
      <section className="company-history"><div className="shell">
        <h2>History</h2>
        {history.map(item => <article className="company-history-item" key={item.era}>
          <h3>{item.era}</h3><div>{item.texts.map(text => <p key={text}>{text}</p>)}</div>
        </article>)}
      </div></section>
      <section className="contact-section" id="contact"><div className="shell contact-grid">
        <div><p className="eyebrow">Direct contact</p><h2>Discuss your project with us.</h2><p>Contact JKP Group for project management and building services enquiries.</p>
          <a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a>
          {content.company.phone ? <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a> : null}
          <p><Link href="/en/referenssit">View references →</Link></p>
        </div><ContactForm subject="Contact request / Company" locale="en" />
      </div></section>
    </main><Footer content={content} locale="en" />
  </>;
}
