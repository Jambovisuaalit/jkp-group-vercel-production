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

## Live release audit — 3.10.2026

- Authoritative release: `Jambovisuaalit/jkp-group-vercel-production`, PR #5, branch `release/customer-final-20260920`.
- Ennen tätä audit-commitia release-head `e6b19dd7fb14b445fc99a1c9c92ac5f166abe33f`; molemmat head-kohtaiset GitHub Actions -ajot PASS.
- Vercelin viimeisin READY deployment käyttää vanhaa commitia `d3181143a6d857ef4577e0cfbf707716dccbd0c6`; exact-head deploy on siksi edelleen release-gate.
- Supabase `jkp-group-production` on ACTIVE_HEALTHY. Varmennettu: yksi `jkp_site_content`-rivi, ei julkaistuja vuokrakohteita, ei lomaketestijäämiä, yksi aktiivinen admin-rivi ja `jkp-media` private.
- Resend-domain `jkpgroup.fi` on edelleen FAILED; DKIM TXT sekä `send`-aliverkkotunnuksen SPF MX/TXT eivät ole varmennettuja. Lomakkeiden sähköpostitoimitusta ei merkitä PASS ennen DNS-korjausta ja oikeaa toimitustestiä.
- Jari vahvisti 27.9.: vuosi vain 1993, yhdeksän kuvaa yleiseen referenssigalleriaan ja yhteydenotto ilman kuvaa. 2.10. Jari kysyi etenemisestä; lopullista hyväksyntää ajantasaiselle exact-head previewlle ei ole vielä pyydetty.
- Production/mainia ei muuteta ennen alla olevia portteja.

## Jäljellä ennen julkaisua
- Samalle commitille READY-esikatselu ja vihreät GitHub Actions -ajot.
- Adminin kirjautuminen, tekstin/kuvan/referenssin tallennus, julkinen FI/EN-luku ja palautus.
- Kolmen lomaketyypin tietokantatallennus ja sähköpostitoimitus hallitulla testiaineistolla.
- Jarin lopullinen hyväksyntä ajantasaiselle esikatselulle ennen mergeä/tuotantoa.
