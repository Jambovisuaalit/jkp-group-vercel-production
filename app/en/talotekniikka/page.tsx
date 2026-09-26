import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";
export const metadata: Metadata = withLocalizedSeo({ title: "Building Services & Technical Supervision", description: "Project management, building services supervision, commissioning and handover support from Jyväskylä and Central Finland." }, "/talotekniikka", "en");
export const dynamic = "force-dynamic";
export default async function EnglishTechnical() { const content = await getSiteContent(); return <><Header email={content.company.email} locale="en" /><main>
<section className="subhero technical-hero"><div className="shell subhero-grid technical-hero-grid"><div className="technical-hero-copy"><p className="eyebrow">Project management / building services</p><h1>{content.technicalPage.en.title}</h1><p>{content.technicalPage.en.lead}</p><div className="hero-actions technical-hero-actions"><a className="button" href="#enquiry">Discuss your project</a><a className="text-link" href="#phases">View project phases →</a></div></div><div className="technical-image-slot"><img src={content.media.technicalImageUrl || "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg"} alt="Building services project management and supervision, example photo" width={1536} height={1022} /></div></div></section>
<section className="process-section" id="phases"><div className="shell"><p className="eyebrow">Project delivery</p><h2>The service covers all project phases from early needs assessment to commissioning and warranty-period tasks.</h2><div className="delivery-phase-grid">{content.technicalPage.en.phases.map(p=><article className="delivery-phase" key={p.number}><span>{p.number}</span><h3>{p.title}</h3><ul>{p.items.map(x=><li key={x}>{x}</li>)}</ul></article>)}</div></div></section>
<section className="section supervision-section"><div className="shell section-heading"><div><p className="eyebrow">Supervision</p><h2>{content.technicalPage.en.supervisionTitle}</h2></div><p>{content.technicalPage.en.supervisionLead}</p></div><div className="shell" style={{marginTop:28}}><a className="text-link dark-link" href="/en/lvia-valvonta">Explore HVAC supervision →</a></div></section>
<section className="contact-section" id="enquiry"><div className="shell contact-grid"><div><p className="eyebrow">Project enquiry</p><h2>{content.technicalPage.en.contactTitle}</h2><p>{content.technicalPage.en.contactLead}</p></div><ContactForm subject="Building services enquiry" locale="en" /></div></section>
</main><Footer content={content} locale="en" /></>; }
