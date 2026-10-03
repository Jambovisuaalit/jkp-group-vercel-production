# JKP Group Oy — asiakasversion release-gate 20.9.2026

## Rajaus
Hyväksytty UI: valkoinen header, vaaleaksi käsitelty asiakkaan teollisuuskuva, keskitetty hero ja kaksi CTA-painiketta.
Ei uutta design-uudistusta. Säilytetään FI/EN-reitit, nykyinen LVIA-teksti, vahvistettu referenssiluettelo,
asiakkaan vuokrakuva ja canonical/hreflang/robots-säännöt.

## Toteutus release-haarassa
- /yritys ja /en/yritys: asiakkaan Yritys-PDF:n toimintaperiaatteet ja toimintahistorian neljä vaihetta.
  Perustamisvuosi 1993 on vahvistettu 27.9.2026.
- Etusivun yhdeksän referenssikuvapaikkaa: alkuperäiset kuvat poimittu asiakkaan Etusivu-PDF:n sivulta 5,
  ilman yrityskohtaista kuva-attribuutiota. Kaikkien yhdeksän kuvan yleinen julkaisulupa vahvistettiin 27.9.2026.
- Kolme palvelukuvan paikkaa: asiakkaan toimittamista etusivun kuvista ja aiemmin vahvistettu vuokrakohdekuva;
  kentät ovat administa vaihdettavissa. Kuvapolkujen alkuperä: asiakkaan 18.9.2026 aineisto.
- Oletuskuvien täyttö vanhan CMS-tietueen tyhjiin paikkoihin toteutettu niin,
  että adminissa tehdyt myöhemmät tarkoitukselliset poistot säilyvät.

## Jarin vahvistukset 27.9.2026 — toteutettu 3.10.2026
- Yrityshistorian perustamisvuosi on 1993. Ei vuosia 1992/1995 eikä vahvistamatonta tarkkaa päivämäärää.
- Kaikki yhdeksän asiakkaan PDF:n referenssikuvaa saa näyttää yleisenä referenssikuvastona.
  Kuvia ei yhdistetä nimettyihin asiakkaisiin tai projekteihin.
- Yhteydenotto-osio julkaistaan ilman kuvaa.
- DSC05408.JPG ei kuulu toteutukseen: sen käyttötarkoitusta ei vahvistettu.
- Lähde: Jarin 27.9. sähköpostivastaus, käyttäjän toimittama keskustelukonteksti 3.10.
- Sisältövahvistukset eivät ole sivuston lopullinen julkaisu-/luovutushyväksyntä.

Vanhoihin CMS-tietueisiin sovelletaan kertaluonteista `clientConfirmationVersion: 1`
-korjausta lukuvaiheessa. Tietokantaan ei kirjoiteta julkisen sivun latauksessa.
Seuraava normaali admin-tallennus säilyttää version; myöhemmät tarkoitukselliset
kuvapoistot ja lupamuutokset eivät palaudu oletuksiin. Kuvahyväksyntä koskee vain
nimettyjä yhdeksää tiedostoa, ei uusia latauksia.

## Tekniset portit ennen mergeä
- GitHub PR: lint + Next.js production build PASS.
- Vercel preview: 390/768/1200/1440 koko sivun visual QA; otsikot, valikot, kuvien latautuminen ja overflow.
- Admin: valittu asiakaskäyttäjä kirjautuu; kuvan vaihto + tekstin muutos + referenssipäivitys
  näkyvät julkisessa previewssa, ja testidata palautetaan. Pelkkä /admin HTTP 200 ei riitä.
- Form smoke: yhteydenotto, B2B-toimitilakysely ja asuntohakemus; jokaisesta varmennettu
  Supabase-tallennus, sähköposti-ilmoitus ja virhepolku. Testilähetysten merkintä ja siivous.
- FI/EN SEO: lang, self-canonical, hreflang, OG-locale, robots, sitemap.
- Tarkistettu commit -> vastaava preview -> Jarin lopullinen hyväksyntä -> merge ja production deploy -> tuotannon QA.
Ei mergeä eikä asiakas-«valmis»-ilmoitusta, ennen kuin yllä mainitut portit on kirjattu PASSiksi.
