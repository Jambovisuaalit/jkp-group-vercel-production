import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Yritys",
  description: "JKP Group Oy:n toimintaperiaatteet ja historia: LVI-urakointi, LVI-suunnittelu, konsultointi, omien kiinteistöjen vuokraus sekä rakennuttamisen ja taloteknisen valvonnan tehtävät.",
}, "/yritys", "fi");
export const dynamic = "force-dynamic";

const phases = [
  {
    title: "Alkuvaiheet ja 1990-luku",
    paragraphs: [
      "Toiminta alkoi nimellä LVI-insinööritoimisto Mikroplast Oy, joka muuttui myöhemmin JKP Group Oy:ksi liiketoimintakaupan myötä.",
      "1990-luvulla toimintaan kuului LVI-urakointia ja KVR-hankkeita avaimet käteen -periaatteella. Projektikohteiden asennustöitä tehtiin alihankintana. Omana työnä hoidettiin suunnittelu, dokumentointi ja projektinjohto.",
      "Hankkeisiin kuului asuntotuotantoa, liike- ja toimitilarakentamista sekä pienteollisuuden rakentamista.",
    ],
  },
  {
    title: "2000-luku",
    paragraphs: [
      "LVI-suunnittelun kysynnän lisääntyessä KVR-hankkeista luovuttiin ja toiminta keskittyi LVI-suunnitteluun ja konsultointiin.",
      "Tehtäviin kuului LVI-suunnittelua, LVI-valvontaa, selvityksiä ja kuntoarvioita. Kohteita oli asunto-, liike-, teollisuus- ja julkishallinnollisessa rakentamisessa sekä uudis- ja saneeraushankkeissa.",
    ],
  },
  {
    title: "2010-luku",
    paragraphs: [
      "Yrityksen liiketoimintakaupan myötä toiminta jatkui pääasiassa omien liike- ja toimitilojen vuokraamisena sekä niihin tehtävinä asiakasmuutoksina.",
    ],
  },
  {
    title: "2016 ja sen jälkeen",
    paragraphs: [
      "JKP Group perusti yhdessä Fimpec Oy:n kanssa Fimpec Talotekniikka Oy:n vuonna 2016. JKP Groupin osuus yhtiöstä oli 20 prosenttia.",
      "Emoyhtiön yrityskauppojen yhteydessä omistusosuus myytiin ja yhteistyö Fimpec Oy:n kanssa jatkui. Rakennuttamis- ja valvontatehtävät sekä suurteollisuuden hankkeet nousivat toiminnan keskeisiksi osa-alueiksi.",
    ],
  },
];

export default async function YritysPage() {
  const content = await getSiteContent();
  const image = content.media.technicalImageUrl || "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg";
  return (
    <>
      <Header email={content.company.email} />
      <main>
        <section className="subhero company-hero">
          <div className="shell narrow">
            <p className="eyebrow">Yritys</p>
            <h1>JKP Group Oy</h1>
            <p>Talotekniikan rakennuttamista, valvontaa ja kiinteistöliiketoimintaa.</p>
          </div>
        </section>
        <section className="section company-profile">
          <div className="shell company-profile-grid">
            <div className="company-profile-text">
              <p className="eyebrow">Toimintaperiaatteet</p>
              <h2>Toimivia ratkaisuja asiakkaan tarpeisiin.</h2>
              <p>Tavoitteenamme on löytää asiakkaalle edulliset ja nykyaikaiset kokonaisratkaisut. Selvitämme ensin asiakkaan tarpeet ja pyrimme löytämään hyvän kokonaisvaltaisen lopputuloksen kohtuullisin kustannuksin.</p>
              <p>Otamme huomioon kiinteistön elinkaarivaatimukset ja ympäristötaloudellisuuden. Panostamme avoimuuteen, luotettavuuteen ja rehellisyyteen.</p>
              <p>Muuttuvaan toimintaympäristöön vastaamme mukautumalla ja seuraamalla alan kehitystä. Kehitämme jatkuvasti suunnittelu- ja toimintamallejamme kannattavan toiminnan perustaksi.</p>
            </div>
            <div className="company-profile-image">
              <img src={image} alt="JKP Group Oy:n talotekniikan esittelykuva" loading="lazy" />
            </div>
          </div>
        </section>
        <section className="section company-history" id="historia">
          <div className="shell">
            <p className="eyebrow">Toimintahistoria</p>
            <h2>Historia</h2>
            <div className="company-history-list">
              {phases.map((phase) => (
                <article className="company-history-item" key={phase.title}>
                  <h3>{phase.title}</h3>
                  <div>{phase.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                </article>
              ))}
            </div>
            <Link href="/referenssit" className="text-link dark-link">Tutustu projektireferensseihin →</Link>
          </div>
        </section>
        <section className="contact-section" id="yhteys">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Suora yhteys</p>
              <h2>Jari Koskela</h2>
              <p>Toimitusjohtaja / JKP Group Oy</p>
              <a className="contact-email" href={"mailto:" + content.company.email}>{content.company.email}</a>
              {content.company.phone ? <a className="contact-email" href={"tel:" + content.company.phone.replace(/\s/g, "")}>{content.company.phone}</a> : null}
            </div>
            <ContactForm subject="Yhteydenottopyyntö / Yritys" />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
