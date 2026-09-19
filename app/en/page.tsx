import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Building Services, Property & Project Expertise", description: "JKP Group Oy provides building services, project management, technical supervision and property rental." };
export const dynamic = "force-dynamic";

export default async function EnglishHome() {
  const content = await getSiteContent();
  return <><Header email={content.company.email} variant="light" locale="en" /><main>
    <section className="hero client-home-hero"><div className="shell client-home-hero-inner"><div className="client-home-hero-copy">
      <p className="client-home-kicker"><span aria-hidden="true" />SINCE 1993</p>
      <h1>Expert services for <em>construction and property</em> projects.</h1>
      <p className="client-home-lead">Building services expertise since 1993.</p>
      <div className="hero-actions client-home-actions"><Link className="button" href="/en/talotekniikka">Explore services</Link><a className="text-link dark-link" href="#contact">Contact us →</a></div>
    </div></div></section>
    <section className="section business-section"><div className="shell section-heading"><div><p className="eyebrow">Two service areas</p><h2>Construction project or property need — one clear route forward.</h2></div><p>Building services and project expertise are presented separately from JKP Group&apos;s own property rental business.</p></div>
      <div className="shell business-grid"><Link className="business-card" href="/en/talotekniikka"><span className="eyebrow">01</span><div><h3>Building services & project management</h3><p>Project management, technical supervision and commissioning across the project lifecycle.</p></div><span className="card-arrow">↗</span></Link><Link className="business-card" href="/en/vuokraus"><span className="eyebrow">02</span><div><h3>Property rental</h3><p>Commercial premises, apartments and holiday properties from our own portfolio.</p></div><span className="card-arrow">↗</span></Link></div>
    </section>
    <section className="section about-section"><div className="shell about-grid"><div className="about-panel"><span>30+</span><strong>years of experience</strong><p>Building services, project management and property expertise.</p></div><div className="about-copy"><p className="eyebrow">Project management & supervision</p><h2>From planning to handover.</h2><p>We bring together the expertise required to keep construction projects practical, controlled and documented from early planning through implementation and handover.</p><Link className="text-link dark-link" href="/en/referenssit">View references →</Link></div></div></section>
    <section className="section services-preview"><div className="shell section-heading"><div><p className="eyebrow">Building services</p><h2>Clear responsibilities across the project lifecycle.</h2></div></div><div className="shell service-grid"><article className="service-card"><span>01</span><h3>Building services project management</h3><p>Project coordination from early studies and design through implementation and handover.</p></article><article className="service-card"><span>02</span><h3>Technical supervision</h3><p>Technical, quality, schedule and financial supervision with documented follow-up.</p></article><article className="service-card"><span>03</span><h3>Project management</h3><p>Coordination of stakeholders, costs, schedule and decision-making throughout delivery.</p></article><article className="service-card"><span>04</span><h3>Commissioning & handover</h3><p>Handover, documentation and verification of building systems and their operation.</p></article></div></section>
    <section className="contact-section" id="contact"><div className="shell contact-grid"><div><p className="eyebrow">Direct contact</p><h2>Let&apos;s discuss your project or property requirement.</h2><p>Contact JKP Group when you need project or building services expertise, or are looking for a rental property.</p><a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a><a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a></div><ContactForm subject="Enquiry from JKP Group website" locale="en" /></div></section>
  </main><Footer content={content} locale="en" /></>;
}
