import { withLocalizedSeo } from "@/lib/localized-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Yritys",
  description: "JKP Group Oy:n toimintaperiaatteet ja historia LVI-urakoinnista suunnitteluun, konsultointiin, rakennuttamisen ja valvonnan tehtäviin sekä vuokraustoimintaan.",
}, "/yritys", "fi");
export const dynamic = "force-dynamic";
const history = [
  { era: "Alkuvaiheet", texts: ["Toiminta alkoi nimellä LVI-insinööritoimisto Mikroplast Oy. Liiketoimintakaupan myötä nimi muuttui myöhemmin JKP Group Oy:ksi."] },
  { era: "1990-luku", texts: ["Olimme mukana LVI-urakoinnissa ja toteutimme KVR-kohteita avaimet käteen -periaatteella. Projektikohteiden asennustöitä hoidettiin alihankintana; omaan työhön kuuluivat suunnittelu, dokumentointi ja projektinjohto.", "Kohteita olivat asuntotuotanto sekä liike-, toimitila- ja pk-teollinen rakentaminen. Näissä hankkeissa karttui käytännön osaamista kokonaistaloudellisten ratkaisujen löytämiseen."] },
  { era: "2000-luku", texts: ["LVI-suunnittelutöiden kysynnän kasvaessa KVR-hankkeet jäivät pois. Toiminta keskittyi LVI-suunnitteluun ja konsultointiin: suunnitteluun, valvontaan, selvityksiin ja kuntoarvioihin.", "Kohteet kattoivat asuntotuotantoa, liike- ja teollista rakentamista sekä julkishallinnollisia uudis- ja saneerauskohteita."] },
  { era: "2010-luku", texts: ["Liiketoimintakaupan myötä toiminta jatkui lähinnä omien liike- ja toimitilojen vuokraamisella ja niihin tehtävillä asiakasmuutoksilla."] },
  { era: "2016 ja sen jälkeen", texts: ["Perustimme yhdessä Fimpec Oy:n kanssa Fimpec Talotekniikka Oy:n, jossa osuutemme oli 20 %. Emoyhtiön yrityskauppojen myötä myimme osuutemme ja jatkoimme yhteistyötä Fimpec Oy:n kanssa.", "Tänä aikana toiminnan painopisteenä olivat rakennuttamis- ja valvontatehtävät. Myös suurteollisuuden hankkeet tulivat mukaan."] },
];
export default async function YritysPage() {
  const content = await getSiteContent();
  return <>
    <Header email={content.company.email} />
    <main>
      <section className="company-intro"><div className="shell company-intro-grid">
        <div className="company-copy">
          <p className="eyebrow">JKP Group Oy / Yritys</p>
          <h1>Palvelua vuosien kokemuksella.</h1>
          <p>Tavoitteenamme on löytää asiakkaalle edulliset ja nykyaikaiset kokonaisratkaisut. Selvitämme aina ensin asiakkaan tarpeet ja pyrimme löytämään hyvän kokonaisvaltaisen lopputuloksen kohtuullisin kustannuksin.</p>
          <p>Otamme huomioon kiinteistön elinkaarivaatimukset ja ympäristötaloudellisuuden. Panostamme avoimuuteen, luotettavuuteen ja rehellisyyteen.</p>
          <p>Tämän päivän muuttuva maailma tuo jatkuvasti mukanaan uusia haasteita, joihin vastaamme mukautumiskyvyllämme ja aikaa seuraamalla. Toimintamme perustuu kannattavuuteen, ja siksi kehitämme jatkuvasti uusia suunnittelu- ja toimintamalleja.</p>
        </div>
        <figure className="company-photo">{content.media.companyImageUrl ? <img src={content.media.companyImageUrl} alt="Asiakkaan toimittama talotekniikkahankkeen kuvituskuva" loading="eager" /> : null}</figure>
      </div></section>
      <section className="company-history"><div className="shell">
        <h2>Historia</h2>
        {history.map(item => <article className="company-history-item" key={item.era}>
          <h3>{item.era}</h3><div>{item.texts.map(text => <p key={text}>{text}</p>)}</div>
        </article>)}
      </div></section>
      <section className="contact-section" id="yhteys"><div className="shell contact-grid">
        <div><p className="eyebrow">Suora yhteys</p><h2>{content.contact.title}</h2><p>{content.contact.body}</p>
          <a className="contact-email" href={`mailto:${content.company.email}`}>{content.company.email}</a>
          {content.company.phone ? <a className="contact-email" href={`tel:${content.company.phone.replace(/\s/g, "")}`}>{content.company.phone}</a> : null}
          <p><Link href="/referenssit">Tutustu referensseihin →</Link></p>
        </div><ContactForm subject="Yhteydenottopyyntö / Yritys" />
      </div></section>
    </main><Footer content={content} />
  </>;
}
