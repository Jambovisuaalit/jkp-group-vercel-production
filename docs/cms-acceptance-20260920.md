# JKP Group Oy — itsenäisen sisällönhallinnan hyväksymistesti

## Rajaus ja master-tietolähteet

- **Julkiset FI/EN-sivutekstit:** `jkp_site_content`, avain `main`. `getSiteContent()` yhdistää vanhan tiedon uusien kenttien oletuksiin; `saveSiteContent()` tallentaa saman rakenteen. Julkiset sivut ovat dynaamisia.
- **Vuokrakohteet:** `jkp_rental_properties` sekä adminin vuokrakohde-API. FI/EN-listat lukevat saman `getPublishedRentals()`-tietolähteen. EN-listan kohdekortti vie toistaiseksi suomenkieliseen kohde-esittelyyn; kohdekohtaisten käännösten sisällöstä tulee tehdä erillinen päätös.
- **Julkiset referenssit:** `jkp_site_content.content.references`. FI- ja EN-referenssisivut käyttävät samaa projektitietuetta. Aiempi `jkp_references`-arkisto ei ole julkisen listan master eikä sitä poisteta tietokannasta.
- **Kuvat:** oletuskuvat ja JKP:n yksityiseen Supabase Storage -buckettiin ladatut kuvat. Kuvan lataus tuottaa uniikin media-URL:n; samat kuvat voi valita muihin paikkoihin adminin mediakirjastosta. Hero, palvelu-, galleria-, vuokraus-, Yritys-, talotekniikka- ja yhteydenottokuvilla on nimetty käyttöpaikka.

## Pakolliset portit ennen main-mergeä

1. **Varmista käyttöönotto:** tuotannon ja previewn sisällönhallintatausta, salaisuudet, mediabucketin oikeudet sekä Jarin oikea kirjautuminen. Älä tallenna salasanoja lokiin, PR:ään tai chat-viesteihin.
2. **Valmistele palautus:** lue `GET /api/admin/content` kirjautuneena, tallenna alkuperäinen JSON turvalliseen paikkaan ja varmista yksilöivä testiaikaleima. Testaa ensisijaisesti erillisellä testitietokannalla / previewlla. Älä lähetä tuotannon lomaketestejä ilman sovittua testimerkintää ja vastaanottajan ennakkotietoa.
3. **Tekstin round-trip:** muokkaa FI-Yritys-otsikkoa sekä yhtä EN-historiakappaletta; tallenna, päivitä admin-sivu ja varmista sama teksti julkisissa `/yritys`- ja `/en/yritys`-osoitteissa. Varmista, ettei muiden kielten teksti muuttunut.
4. **Kuvan round-trip:** valitse yksi jo ladattu, hyväksytty kuva mediakirjastosta etusivun palvelukorttiin; tallenna, tarkista julkisesta HTML:stä ja selaimesta sekä palauta alkuperäinen URL. Testaa uusi kuvaupload erillisellä hyväksytyllä testikuvalla, jos testiympäristön mediabucket on käytössä.
5. **Referenssin round-trip:** lisää testitietue testikantaan, vaihda järjestystä, tarkista molemmat FI/EN-reitit; poista testirivi ja varmista sen poistuminen. Älä julkaise keksittyä referenssiä tuotannossa.
6. **Vuokrakohteen round-trip:** lisää testiympäristöön luonnos, julkaise, tarkista FI/EN-listat ja kohdekuva, piilota ja varmista poistuminen julkisilta sivuilta. Palauta tilanne; älä julkaise kuvitteellista vapautuvaa kohdetta tuotannossa.
7. **Lomakkeet:** yhteydenotto, toimitilakysely ja asuntohakemus erikseen; varmista HTTP-vastaus, Supabase-tietue, sähköposti-ilmoituksen perillemeno sekä sovittu virhepolku. Poista testitiedot. Pelkkä `200` tai `202` ei todista sähköpostin saapumista.
8. **Palautus ja hyväksyntä:** palauta alkuperäinen sisältösnapshot valtuutetusti, tarkista `GET /api/admin/content` ja julkisten sivujen vastaavuus. Tarkista CMS-muutoksen jälkeen myös 390/768/1200/1440- ja SEO-regressiot.

## HOLD

Asiakkaan 1992/1993/1995-vuosilukujen sanamuodot, referenssikuvien julkaisu-/käyttöluvat sekä yhteydenoton hyväksytty kuva tai nimenomainen kuvattomuuspäätös odottavat Jaria. Hyväksyttyä kuvallista Rouhento-inspiroitua designia ei muuteta.

**Automatisoidut static/CI-testit eivät korvaa kohtia 1–8:** ne eivät käytä Jarin tunnuksia, kirjoita tuotannon Supabaseen tai todista sähköpostin perillemenoa.
