import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";
export const metadata: Metadata = { title: "Privacy notice", description: "Processing of contact and rental enquiry data on the JKP Group Oy website.", alternates: { canonical: "/en/privacy" } };
export default async function PrivacyEN() {
 const content = await getSiteContent();
 return <><Header email={content.company.email} locale="en" /><main>
  <section className="subhero"><div className="shell narrow"><p className="eyebrow">Privacy</p><h1>How enquiry information is handled</h1><p>This page describes the processing of information entered in forms on the JKP Group Oy website.</p></div></section>
  <section className="section"><div className="shell narrow privacy-content">
   <h2>Data controller and contact</h2><p>JKP Group Oy, Finnish business ID 0923519-9. For privacy questions, contact <a href={`mailto:${content.company.email}`}>{content.company.email}</a>.</p>
   <h2>Information collected</h2><p>Name, email address, optional company and telephone number, message text and any additional information submitted in a commercial-premises enquiry or rental application. Do not provide national identity numbers, banking details or sensitive documents.</p>
   <h2>Purpose and recipients</h2><p>Enquiry details are used to respond to your message and handle the requested project, commercial premises or rental matter. The website stores form submissions in its database and, when configured, sends an email notification to the JKP Group contact person. Relevant JKP Group staff and technical database and email service providers may process the information.</p>
   <h2>Retention and your requests</h2><p>Information is processed for the enquiry and any subsequent rental matter. Specific retention periods and processing grounds will be confirmed by JKP Group as part of its final privacy policy approval. For access, correction or other privacy-related requests, contact JKP Group at the email address above.</p>
   <p><Link href="/en">Back to home →</Link></p>
  </div></section></main><Footer content={content} locale="en" /></>;
}
