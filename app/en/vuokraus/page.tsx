import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";
export const metadata: Metadata = withLocalizedSeo({ title: "Property Rental", description: "Commercial premises, apartments and holiday properties from JKP Group's own portfolio." }, "/vuokraus", "en");
export const dynamic = "force-dynamic";
export default async function EnglishRental() { const content=await getSiteContent(); return <><Header email={content.company.email} locale="en" /><main>
<section className="subhero"><div className="shell narrow"><p className="eyebrow">Property rental</p><h1>Commercial premises, apartments and holiday properties.</h1><p>JKP Group rents its own properties to companies and private customers. Availability and details are discussed directly.</p></div></section>
<section className="section"><div className="shell" style={{marginBottom:32}}><img src={content.media.rentalImageUrl || "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg"} alt="JKP Group customer-provided rental property photograph" width={1536} height={1022} fetchPriority="high" style={{display:"block",width:"100%",height:"auto",maxHeight:560,objectFit:"cover",borderRadius:2}} /></div><div className="shell section-heading"><div><p className="eyebrow">Own properties</p><h2>Space for business, living and time away.</h2></div><p>{content.rental.lead}</p></div><div className="shell business-grid"><article className="business-card"><span className="eyebrow">01</span><div><h3>Commercial premises</h3><p>Premises for companies and different business needs.</p></div></article><article className="business-card"><span className="eyebrow">02</span><div><h3>Apartments</h3><p>Rental homes from the JKP Group property portfolio.</p></div></article><article className="business-card"><span className="eyebrow">03</span><div><h3>Holiday properties</h3><p>Holiday homes and destinations for private use.</p></div></article></div></section>
<section className="contact-section"><div className="shell contact-grid"><div><p className="eyebrow">Rental enquiry</p><h2>Looking for a property?</h2><p>Tell us what kind of space you need, where and for what purpose. We will discuss current availability directly.</p></div><ContactForm subject="Property rental enquiry" locale="en" /></div></section>
</main><Footer content={content} locale="en" /></>; }
