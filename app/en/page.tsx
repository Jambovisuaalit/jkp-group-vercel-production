import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomeSections } from "@/components/HomeSections";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({ title: "Building Services, Property & Project Expertise", description: "JKP Group Oy provides building services, project management, technical supervision and property rental." }, "", "en");
export const dynamic = "force-dynamic";

export default async function EnglishHome() {
  const content = await getSiteContent();
  return <><Header email={content.company.email} variant="light" locale="en" /><main>
    <section className="hero client-home-hero" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.79),rgba(255,255,255,.79)),url("${content.hero.imageUrl || "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg"}")` }}><div className="shell client-home-hero-inner"><div className="client-home-hero-copy">
      <p className="client-home-company">JKP GROUP OY</p>
      <p className="client-home-subtitle">Building services – properties</p>
      <h1>{content.heroEn.title}</h1>
      <p className="client-home-lead">{content.heroEn.lead}</p>
      <div className="hero-actions client-home-actions"><Link className="button" href="/en/talotekniikka">Explore services</Link><a className="button button-outline" href="#contact">Contact us</a></div>
    </div></div></section>
    <HomeSections content={content} locale="en" />
    <section className="contact-section" id="contact"><div className="shell contact-grid"><div><p className="eyebrow">Direct contact</p><h2>{content.contactEn.title}</h2><p>{content.contactEn.body}</p>{content.media.contactImageUrl ? <img className="home-contact-image" src={content.media.contactImageUrl} alt="JKP Group contact person" loading="lazy" /> : null}<a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a><a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a></div><ContactForm subject="Enquiry from JKP Group website" locale="en" /></div></section>
  </main><Footer content={content} locale="en" /></>;
}
