import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import { EnglishApartmentApplicationForm, EnglishBusinessPremisesForm } from "@/components/EnglishRentalForms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";
import { getPublishedRentals } from "@/lib/rentals";
import Link from "next/link";
export const metadata: Metadata = withLocalizedSeo({ title: "Property Rental", description: "Commercial premises, apartments and holiday properties from JKP Group's own portfolio." }, "/vuokraus", "en");
export const dynamic = "force-dynamic";
export default async function EnglishRental() { const [content, properties] = await Promise.all([getSiteContent(), getPublishedRentals()]); return <><Header email={content.company.email} locale="en" /><main>
<section className="subhero"><div className="shell narrow"><p className="eyebrow">Property rental</p><h1>{content.rentalEn.title}</h1><p>{content.rentalEn.lead}</p></div></section>
<section className="section"><div className="shell" style={{marginBottom:32}}><img src={content.media.rentalImageUrl || "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg"} alt="JKP Group customer-provided rental property photograph" width={1536} height={1022} fetchPriority="high" style={{display:"block",width:"100%",height:"auto",maxHeight:560,objectFit:"cover",borderRadius:2}} /></div><div className="shell section-heading"><div><p className="eyebrow">Own properties</p><h2>Space for business, living and time away.</h2></div><p>{content.rentalEn.lead}</p></div>{properties.length ? <div className="shell property-grid">{properties.map(property => <Link className="property-card" href={`/vuokraus/${property.slug}`} key={property.id} lang="fi">
<div className="property-media" style={property.mainImage ? { backgroundImage: `url("${property.mainImage}")` } : undefined} />
<div className="property-content"><small>{property.city || property.type}</small><h3>{property.title}</h3><p>{property.summary || property.description}</p>
<div className="hero-actions">{property.price ? <strong>{property.price}</strong> : null}<span>Property details in Finnish →</span></div></div>
</Link>)}</div> : <div className="shell business-grid"><article className="business-card"><span className="eyebrow">01</span><div><h3>Commercial premises</h3><p>Premises for companies and different business needs.</p></div></article><article className="business-card"><span className="eyebrow">02</span><div><h3>Apartments</h3><p>Rental homes from the JKP Group property portfolio.</p></div></article><article className="business-card"><span className="eyebrow">03</span><div><h3>Holiday properties</h3><p>Holiday homes and destinations for private use.</p></div></article></div>}</section>
<section className="contact-section" id="commercial-enquiry"><div className="shell contact-grid"><div><p className="eyebrow">Commercial premises</p><h2>Request commercial space.</h2><p>Tell us the type of premises, location, floor area and preferred timing.</p></div><EnglishBusinessPremisesForm /></div></section><section className="contact-section" id="rental-application"><div className="shell contact-grid"><div><p className="eyebrow">Apartment rental</p><h2>Apply for an apartment.</h2><p>Provide the property and relevant application details. Do not send sensitive documents through the form.</p></div><EnglishApartmentApplicationForm /></div></section>
</main><Footer content={content} locale="en" /></>; }
