import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Company",
  description:
    "JKP Group Oy is a building services, project management and property company founded in 1993 and based in Central Finland.",
  alternates: { canonical: "/en/yritys" },
};

export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  const content = await getSiteContent();

  return (
    <>
      <Header email={content.company.email} locale="en" />
      <main>
        <section className="subhero">
          <div className="shell narrow">
            <p className="eyebrow">JKP Group Oy / since 1993</p>
            <h1>Building services, project management and property expertise.</h1>
            <p>
              JKP Group Oy supports construction projects through building services
              supervision and project management, and rents its own commercial premises,
              apartments and holiday properties.
            </p>
          </div>
        </section>

        <section className="section about-section">
          <div className="shell about-grid">
            <div className="about-panel">
              <span>1993</span>
              <strong>founded</strong>
              <p>Jyväskylä and Central Finland</p>
            </div>
            <div className="about-copy">
              <p className="eyebrow">Operating model</p>
              <h2>Clear responsibility from planning to handover.</h2>
              <p>
                JKP Group combines project management and building services expertise
                with an emphasis on quality, feasibility, documentation and long-term
                functionality.
              </p>
              <Link className="text-link dark-link" href="/en/referenssit">
                View references →
              </Link>
            </div>
          </div>
        </section>

        <section className="section business-section">
          <div className="shell section-heading">
            <div>
              <p className="eyebrow">Business areas</p>
              <h2>Two service areas, one direct point of contact.</h2>
            </div>
            <p>
              Building services and project management form one area, while the rental
              of JKP Group&apos;s own properties forms the other.
            </p>
          </div>
          <div className="shell business-grid">
            <Link className="business-card" href="/en/talotekniikka">
              <span className="eyebrow">01</span>
              <div>
                <h3>Building Services</h3>
                <p>Project management, supervision, commissioning and handover support.</p>
              </div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </Link>
            <Link className="business-card" href="/en/vuokraus">
              <span className="eyebrow">02</span>
              <div>
                <h3>Properties</h3>
                <p>Commercial premises, apartments and holiday properties owned by JKP Group.</p>
              </div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Direct contact</p>
              <h2>Jari Koskela</h2>
              <p>Managing Director / JKP Group Oy</p>
              <a className="contact-email" href={`mailto:${content.company.email}`}>
                {content.company.email}
              </a>
              {content.company.phone ? (
                <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>
                  {content.company.phone}
                </a>
              ) : null}
            </div>
            <ContactForm subject="Contact request / Company" locale="en" />
          </div>
        </section>
      </main>
      <Footer content={content} locale="en" />
    </>
  );
}
