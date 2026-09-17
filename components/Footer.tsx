import Link from "next/link";
import type { SiteContent } from "@/content/defaults";

export function Footer({ content, locale = "fi" }: { content: SiteContent; locale?: "fi" | "en" }) {
  const en = locale === "en"; const prefix = en ? "/en" : "";
  return <footer className="site-footer"><div className="shell footer-grid">
    <div><div className="footer-brand">JKP Group Oy</div><p>{en ? "Building services expertise and commercial property rental." : "Talotekninen asiantuntijapalvelu ja liike- sekä toimitilojen vuokraus."}</p></div>
    <div><strong>{en ? "Services" : "Palvelut"}</strong><Link href={`${prefix}/talotekniikka`}>{en ? "Building Services" : "Talotekniikka"}</Link><Link href={`${prefix}/vuokraus`}>{en ? "Properties" : "Vuokraus"}</Link><Link href={`${prefix}/referenssit`}>{en ? "References" : "Referenssit"}</Link></div>
    <div><strong>{en ? "Contact" : "Yhteys"}</strong><a href={`mailto:${content.company.email}`}>{content.company.email}</a>{content.company.phone ? <a href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a> : null}<span>{content.company.area}</span></div>
  </div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} JKP Group Oy</span><span>Business ID 0923519-9</span></div></footer>;
}
