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

export default async function CompanyPage() {
  const content = await getSiteContent();
  return <>
    <Header email={content.company.email} locale="en" />
    <main>
      <section className="company-intro"><div className="shell company-intro-grid">
        <div className="company-copy">
          <p className="eyebrow">JKP Group Oy / Company</p>
          <h1>{content.companyPage.en.title}</h1>
          {content.companyPage.en.intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <figure className="company-photo">{content.media.companyImageUrl ? <img src={content.media.companyImageUrl} alt="Customer-provided building services project photograph" loading="eager" /> : null}</figure>
      </div></section>
      <section className="company-history"><div className="shell">
        <h2>{content.companyPage.en.historyTitle}</h2>
        {content.companyPage.en.history.map(item => <article className="company-history-item" key={item.era}>
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
