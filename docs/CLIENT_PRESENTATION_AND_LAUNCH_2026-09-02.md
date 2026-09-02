# JKP Group Oy — asiakkaan esittely ja julkaisu

Päivä: 2.9.2026

## Asiakkaalle esitettävä versio

Julkinen katselulinkki:

https://jkp-group-asiakas.vercel.app/

Linkki on asiakkaan hyväksyntäkierrosta varten. Sitä ei indeksoida hakukoneisiin eikä `jkpgroup.fi`-domainia ole vielä siirretty.

## Esittelyjärjestys

1. Etusivu
   - vaaleansininen Rouhento-pohjainen art direction
   - pääviesti: rakentamisen ja kiinteistöliiketoiminnan asiantuntijapalvelut
   - kaksi palvelukokonaisuutta: talotekniikka ja vuokraus

2. Talotekniikka
   - rakennuttaminen
   - valvonta
   - projektinjohto
   - käyttöönotot ja vastaanotot
   - rakennuttamisen vaiheistus: esiselvitys → toteutus → vastaanotto
   - valvonnan painotus: laatu, LVI-/talotekniset ratkaisut ja dokumentointi

3. Vuokraus
   - liike- ja toimitilat
   - asunnot
   - loma-asunnot ja lomakohteet

4. Referenssit
   - vain asiakkaan toimittamaan historialliseen aineistoon perustuvat poiminnat
   - ei lisätä vahvistamattomia referenssejä

5. Yhteydenotto
   - suora sähköposti ja puhelin
   - lomake ohjaa asiakkaan hyväksyntäversiossa sähköpostiohjelmaan

## Asiakkaalta pyydettävä hyväksyntä

Pyydetään yksi vastaus:

**Hyväksytty julkaisuun**

tai yksilöidyt korjaukset muodossa:

**Sivu / kohta / nykyinen teksti tai elementti / toivottu muutos**

## Julkaisugate

Ennen `jkpgroup.fi`-domainin kytkentää:

- asiakkaan kirjallinen hyväksyntä
- main-haaran CI vihreä
- 390 / 768 / 1440 responsiivinen QA
- etusivu, talotekniikka, vuokraus ja referenssit HTTP 200
- tuotantolomakkeen vastaanottaja ja lähettäjä vahvistettu
- Supabase/Resend tuotantomuuttujat määritelty vain jos ne otetaan käyttöön julkaisuhetkellä
- tuotannon canonical = https://jkpgroup.fi
- robots/sitemap vaihdetaan tuotantoindeksointiin
- Vercel production project käyttää canonical GitHub-repoa `Jambovisuaalit/jkp-group-vercel-production`, branch `main`
- vanhaa `vido-social/jkp-group`-linkitystä ei käytetä tuotannon lähteenä
- domain/DNS muutetaan vasta yllä olevien kohtien jälkeen

## Rollback

Ennen domain-cutoveria kirjataan nykyinen DNS/Vercel-kohde. Jos julkaisu-QA epäonnistuu, domain palautetaan aiempaan kohteeseen ja uusi deployment jätetään ilman tuotantodomainia.
