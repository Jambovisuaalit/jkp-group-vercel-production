import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Yritys",
  description: "JKP Group Oy:n toimintaperiaatteet ja historia LVI-urakoinnista suunnitteluun, konsultointiin, rakennuttamisen ja valvonnan tehtäviin sekä vuokraustoimintaan.",
}, "/yritys", "fi");
export const dynamic = "force-dynamic";

export default async function YritysPage() {
  const content = await getSiteContent();
  return <>
    <Header email={content.company.email} />
    <main>
      <section className="company-intro"><div className="shell company-intro-grid">
        <div className="company-copy">
          <p className="eyebrow">JKP Group Oy / Yritys</p>
          <h1>{content.companyPage.fi.title}</h1>
          {content.companyPage.fi.intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <figure className="company-photo">{content.media.companyImageUrl ? <img src={content.media.companyImageUrl} alt="Asiakkaan toimittama talotekniikkahankkeen kuvituskuva" loading="eager" /> : null}</figure>
      </div></section>
      <section className="company-history"><div className="shell">
        <h2>{content.companyPage.fi.historyTitle}</h2>
        {content.companyPage.fi.history.map(item => <article className="company-history-item" key={item.era}>
          <h3>{item.era}</h3><div>{item.texts.map(text => <p key={text}>{text}</p>)}</div>
        </article>)}
      </div></section>
      <section className="contact-section" id="yhteys"><div className="shell contact-grid">
        <div><p className="eyebrow">Suora yhteys</p><h2>{content.contact.title}</h2><p>{content.contact.body}</p>
          <a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a>
          {content.company.phone ? <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a> : null}
          <p><Link href="/referenssit">Tutustu referensseihin →</Link></p>
        </div><ContactForm subject="Yhteydenottopyyntö / Yritys" />
      </div></section>
    </main><Footer content={content} />
  </>;
}
