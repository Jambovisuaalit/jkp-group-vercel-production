# JKP Group Oy — asiakasversion release-gate 20.9.2026

## Rajaus
Hyväksytty UI: valkoinen header, vaaleaksi käsitelty asiakkaan teollisuuskuva, keskitetty hero ja kaksi CTA-painiketta.
Ei uutta design-uudistusta. Säilytetään FI/EN-reitit, nykyinen LVIA-teksti, vahvistettu referenssiluettelo,
asiakkaan vuokrakuva ja canonical/hreflang/robots-säännöt.

## Toteutus release-haarassa
- /yritys ja /en/yritys: asiakkaan Yritys-PDF:n toimintaperiaatteet ja toimintahistorian neljä vaihetta.
  Epäselvää perustamisvuotta ei väitetä sivutekstissä ennen asiakkaan vastausta.
- Etusivun yhdeksän referenssikuvapaikkaa: alkuperäiset kuvat poimittu asiakkaan Etusivu-PDF:n sivulta 5,
  ilman yrityskohtaista kuva-attribuutiota. Kuvan julkaiseminen vaatii asiakkaan vahvistuksen.
- Kolme palvelukuvan paikkaa: asiakkaan toimittamista etusivun kuvista ja aiemmin vahvistettu vuokrakohdekuva;
  kentät ovat administa vaihdettavissa. Kuvapolkujen alkuperä: asiakkaan 18.9.2026 aineisto.
- Oletuskuvien täyttö vanhan CMS-tietueen tyhjiin paikkoihin toteutettu niin,
  että adminissa tehdyt myöhemmät tarkoitukselliset poistot säilyvät.

## Jarin hyväksynnällä ratkaistavat sisältöasiat
1. Yritys-PDF käyttää perustamisvuotta 1992, nykyinen rakenteinen data ja aiempi sivusto 1993:
   mikä on oikea yhtiön rekisteröity perustamispäivä ja kuinka edeltävän Mikroplast Oy:n toimintahistoria ilmaistaan?
2. Etusivu-PDF:n pääviesti käyttää vuotta 1995: tarkoitetaanko talotekniikan toiminnan alkua?
   Mikä tarkka FI- ja EN-sanamuoto halutaan heroon?
3. Saako kaikki PDF:n sivun 5 yhdeksän referenssikuvaa julkaista JKP:n sivustolla?
   Vahvista kuvien mahdolliset yritys-/projektikohtaiset vastineet ennen alt-tekstien yksilöintiä.
4. Toimita JKP:n hyväksytty kuva yhteydenotto-osioon, tai vahvista kirjallisesti,
   että osio julkaistaan ilman henkilön/yrityksen kuvaa. Rouhennon esimerkkihenkilön kuvaa ei käytetä.

## Tekniset portit ennen mergeä
- GitHub PR: lint + Next.js production build PASS.
- Vercel preview: 390/768/1200/1440 koko sivun visual QA; otsikot, valikot, kuvien latautuminen ja overflow.
- Admin: valittu asiakaskäyttäjä kirjautuu; kuvan vaihto + tekstin muutos + referenssipäivitys
  näkyvät julkisessa previewssa, ja testidata palautetaan. Pelkkä /admin HTTP 200 ei riitä.
- Form smoke: yhteydenotto, B2B-toimitilakysely ja asuntohakemus; jokaisesta varmennettu
  Supabase-tallennus, sähköposti-ilmoitus ja virhepolku. Testilähetysten merkintä ja siivous.
- FI/EN SEO: lang, self-canonical, hreflang, OG-locale, robots, sitemap.
- Yksi hyväksytty commit -> production deploy -> uudelleen koko reitti- ja browser-sweep -> Jarin hyväksyntä.
Ei mergeä eikä asiakas-«valmis»-ilmoitusta, ennen kuin yllä mainitut portit on kirjattu PASSiksi.
