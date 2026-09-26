import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Rakennuttaminen ja talotekninen valvonta Jyväskylä",
  description:
    "Rakennuttaminen, talotekninen valvonta, projektinjohto sekä käyttöönotto- ja vastaanottotehtävät Jyväskylässä ja Keski-Suomessa.",
}, "/talotekniikka", "fi");
export const dynamic = "force-dynamic";

export default async function TalotekniikkaPage() {
  const content = await getSiteContent();
  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero technical-hero">
          <div className="shell subhero-grid technical-hero-grid">
            <div className="technical-hero-copy">
              <p className="eyebrow">Rakennuttaminen / talotekniikka</p>
              <h1>{content.technicalPage.fi.title}</h1>
              <p>{content.technicalPage.fi.lead}</p>
              <div className="hero-actions technical-hero-actions">
                <a className="button" href="#tarjouspyynto">Keskustele hankkeesta</a>
                <a className="text-link" href="#vaiheet">Katso hankkeen vaiheet →</a>
              </div>
            </div>
            <div className="technical-image-slot">
              <img src={content.media.technicalImageUrl || "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg"} alt="Talotekniikan rakennuttaminen ja valvonta, esimerkkikuva" width={1536} height={1022} />
            </div>
          </div>
        </section>

        <section className="process-section" id="vaiheet">
          <div className="shell"><p className="eyebrow">Rakennuttamisen eteneminen</p><h2>Palvelu kattaa rakennusprojektin kaikki vaiheet tarveselvityksestä käyttöönoton ja takuuajan tehtäviin.</h2><div className="delivery-phase-grid">{content.technicalPage.fi.phases.map((phase) => <article className="delivery-phase" key={phase.number}><span>{phase.number}</span><h3>{phase.title}</h3><ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div>
        </section>

        <section className="section supervision-section">
          <div className="shell section-heading"><div><p className="eyebrow">Valvonta</p><h2>{content.technicalPage.fi.supervisionTitle}</h2></div><p>{content.technicalPage.fi.supervisionLead}</p></div>
          <div className="shell" style={{ marginTop: 28 }}><a className="text-link dark-link" href="/lvia-valvonta">Tutustu LVIA-valvontaan →</a></div>
        </section>

        <section className="contact-section" id="tarjouspyynto"><div className="shell contact-grid"><div><p className="eyebrow">Hankekeskustelu</p><h2>{content.technicalPage.fi.contactTitle}</h2><p>{content.technicalPage.fi.contactLead}</p></div><ContactForm subject="Rakennuttamisen ja talotekniikan tarjouspyyntö" /></div></section>
      </main>
      <Footer content={content} />
    </>
  );
}
