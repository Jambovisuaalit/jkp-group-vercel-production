import type { Metadata } from "next";
import { withLocalizedSeo } from "@/lib/localized-seo";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = withLocalizedSeo({
  title: "Tietosuojatiedot",
  description: "JKP Group Oy:n verkkosivuston yhteydenotto- ja vuokrauslomakkeiden henkilötietojen käsittely.",
}, "/tietosuoja", "fi");
export default async function Privacy() {
  const content = await getSiteContent();
  return <><Header email={content.company.email} /><main>
    <section className="subhero"><div className="shell narrow"><p className="eyebrow">Tietosuojatiedot</p><h1>Yhteydenottojen henkilötietojen käsittely</h1><p>Tämä sivu kertoo, miten JKP Group Oy käsittelee verkkosivuston lomakkeilla annettuja tietoja.</p></div></section>
    <section className="section"><div className="shell narrow privacy-content">
      <h2>Rekisterinpitäjä ja yhteydenotto</h2><p>JKP Group Oy, Y-tunnus 0923519-9. Tietosuojaa koskevat kysymykset: <a href={`mailto:${content.company.email}`}>{content.company.email}</a>.</p>
      <h2>Mitä tietoja käsitellään?</h2><p>Yhteydenottolomakkeilla nimi, sähköpostiosoite, mahdollinen yritys ja puhelinnumero sekä viestin sisältö. Vuokrauslomakkeilla lisäksi ilmoittamasi tilatarve, toivottu sijainti ja ajankohta tai asunnon hakemiseen liittyvät lomakekentät. Älä lähetä henkilötunnusta, pankkitietoja tai muita arkaluonteisia asiakirjoja.</p>
      <h2>Mihin tietoja käytetään?</h2><p>Tietoja käytetään viestiisi vastaamiseen, tarjouspyynnön käsittelemiseen ja vuokraukseen liittyvän yhteydenoton tai hakemuksen käsittelyyn. Verkkolomakkeen viesti tallennetaan sivuston tietokantaan ja toimitetaan yhteyshenkilölle sähköposti-ilmoituksena, kun ilmoituspalvelu on käytettävissä.</p>
      <h2>Tietojen vastaanottajat ja säilytys</h2><p>Tietoja käsittelevät JKP Group Oy:n asianomaiset yhteyshenkilöt sekä sivuston tietokanta- ja sähköpostipalvelun tekniset toimittajat. Käsittely ja säilytys rajoitetaan yhteydenoton ja mahdollisen vuokrausasian hoitamiseen. Yksityiskohtaiset säilytysajat ja käsittelyperusteet vahvistetaan yrityksen tietosuojakäytännöissä ennen lopullista asiakashyväksyntää.</p>
      <h2>Tietoja koskevat pyynnöt</h2><p>Voit pyytää sinua koskevien tietojen tarkistamista tai oikaisemista ja esittää tietojen käsittelyä koskevan pyynnön suoraan JKP Groupille sähköpostitse. Yritys arvioi pyynnön soveltuvien vaatimusten mukaisesti.</p>
      <p><Link href="/">Takaisin etusivulle →</Link></p>
    </div></section></main><Footer content={content} /></>;
}
