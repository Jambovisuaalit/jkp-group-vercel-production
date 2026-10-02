# JKP — 27.9. sisältövahvistusten toteutus, QA 3.10.2026

Korjaukset: yrityshistoria FI/EN 1993, schema foundingDate vain 1993,
yhdeksän nimettyä kuvaa yleisenä referenssikuvastona, yhteydenotto ilman kuvaa.
DSC05408.JPG:tä tai viittausta siihen ei ole lähteessä/julkisissa asseteissa.
Vanhan CMS-tietueen kertaluonteinen korjaus säilyttää myöhemmät admin-muutokset.

## Paikallinen tarkistus
- Next.js 16.3.5 tuotantobuild: PASS.
- TypeScript: PASS.
- ESLint: 0 virhettä; 21 aiempaa varoitusta (img-elementit, käyttämättömät muuttujat).
- 12 FI/EN-sivua × 390/768/1200/1440 px: 48/48 PASS, ei overflow- tai JavaScript-virheitä.
- Mobiilietusivun kuvakaappaus tarkistettu: yhdeksän kuvan galleria, kuvattomat yhteystiedot.
- SEO: 12/12 PASS (canonical, hreflang, OG).
- Kuvat/sisällöt: 11 kuvatiedostoa, yhdeksän galleriakuvaa ja kaksi yrityssivua PASS.
- CMS: 13 kenttäsidontaa, 12 sivua sekä anonyymin luku-/kirjoituseston testit PASS.
- Vanhan CMS-tietueen korjaus ja myöhempien kuvapoistojen/lupamuutosten säilyminen PASS.
- Lomakkeen static-tilan 503-virhepolku PASS; sähköpostia ei lähetetty.
- Riippuvuudet lukittu package-lock.jsoniin; CI käyttää npm ci:tä.

Testit ajettiin DATA_BACKEND=static-tilassa. Tämä ei todista oikean tietokannan,
kirjautuneen adminin tai sähköpostitoimituksen toimintaa. Paikallinen Node 24.19;
repositoryn CI käyttää Node 22:ta. Selain-QA: Chromium 134 / Playwright 1.51.1.

## Jäljellä ennen julkaisua
- Samalle commitille READY-esikatselu ja vihreät GitHub Actions -ajot.
- Adminin kirjautuminen, tekstin/kuvan/referenssin tallennus, julkinen FI/EN-luku ja palautus.
- Kolmen lomaketyypin tietokantatallennus ja sähköpostitoimitus hallitulla testiaineistolla.
- Jarin lopullinen hyväksyntä ajantasaiselle esikatselulle ennen mergeä/tuotantoa.
