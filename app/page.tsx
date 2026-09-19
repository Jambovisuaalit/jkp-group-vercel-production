import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomeSections } from "@/components/HomeSections";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: { absolute: "JKP Group Oy | Rakennuttaminen, talotekniikka ja vuokraus" },
  description: "JKP Group Oy tarjoaa rakennuttamisen, taloteknisen valvonnan ja projektinjohdon asiantuntijapalveluja sekä vuokraa omia liike- ja toimitiloja, asuntoja ja loma-asuntoja.",
  openGraph: { title: "JKP Group Oy | Rakennuttaminen, talotekniikka ja vuokraus" },
}, "", "fi");

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <Header email={content.company.email} variant="light" />
      <main>
        <section className="hero client-home-hero" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.79),rgba(255,255,255,.79)),url("${content.hero.imageUrl || "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg"}")` }}>
          <div className="shell client-home-hero-inner">
            <div className="client-home-hero-copy">
              <p className="client-home-company">JKP GROUP OY</p>
              <p className="client-home-subtitle">Talotekniikka – kiinteistöt</p>
              <h1>{content.hero.title}</h1>
              <p className="client-home-lead">{content.hero.lead}</p>
              <div className="hero-actions client-home-actions">
                <Link className="button" href="/talotekniikka">Tutustu palveluihin</Link>
                <a className="button button-outline" href="#yhteys">Ota yhteyttä</a>
              </div>
            </div>
          </div>
        </section>

        <HomeSections content={content} />

        <section className="contact-section" id="yhteys">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Suora yhteys</p>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.body}</p>
              {content.media.contactImageUrl ? <img className="home-contact-image" src={content.media.contactImageUrl} alt="JKP Groupin yhteyshenkilö" loading="lazy" /> : null}
              <a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a>
              {content.company.phone ? <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a> : null}
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer content={content} />
      <a className="mobile-contact home-mobile-contact" href="#yhteys">Ota yhteyttä <span aria-hidden="true">→</span></a>
    </>
  );
}
