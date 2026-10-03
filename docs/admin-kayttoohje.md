# JKP Group Oy — verkkosivujen ylläpito

Ohje koskee asiakasversion release-haaraa. Jari saa käyttöohjeen julkaistun version mukana vasta, kun adminin todellinen kirjautumis-, tallennus- ja palautustesti on läpäisty.

## Kirjautuminen

1. Avaa `https://www.jkpgroup.fi/admin`.
2. Kirjaudu omalla henkilökohtaisella ylläpitäjätunnuksella. Älä lähetä salasanaa sähköpostilla tai chatissa.
3. Valitse vasemmasta navigaatiosta haluamasi osio. Sivuston sisältöjä muutetaan adminissa, **ei GitHubissa**.

## Mitä voi päivittää?

| Admin-osio | Julkinen sivu | Sisältö |
|---|---|---|
| Etusivu | `/` ja `/en` | FI-hero, EN-hero, kolme palvelunoston FI/EN-otsikkoa, referenssigallerian FI/EN-otsikko ja kuvat, asiakkaan vuokrakuva, yhteydenoton EN-tekstit |
| Yritys / Historia | `/yritys` ja `/en/yritys` | Otsikot, esittelyn kappaleet, kaikki historian vaiheet ja Yritys-sivun kuva |
| Talotekniikka | `/talotekniikka` ja `/en/talotekniikka` | Otsikot, johdannot, rakennuttamisen hankevaiheet, valvonta- ja tarjouspyyntötekstit sekä tekninen kuva |
| LVIA-valvonta | `/lvia-valvonta` ja `/en/lvia-valvonta` | Otsikot, valvonnan vaiheet ja tehtävät, kokemus- ja yhteydenottotekstit |
| Vuokraussivun tekstit | `/vuokraus` ja `/en/vuokraus` | FI/EN-otsikko ja ingressi |
| Vuokrakohteet | Julkisten vuokrakohteiden listat FI/EN; kohteen linkki voi avata FI-kohdesivun | Kohteen lisäys, kuva, tiedot, julkaisu ja piilotus |
| Referenssit | `/referenssit` ja `/en/referenssit` | Yksi yhteinen julkinen luettelo: projektin tiedot, rooli, kuva, lisäys, poisto ja järjestys |
| Yhteystiedot | Yhteydenotto-osio | Yrityksen puhelin/sähköposti, FI-yhteydenottotekstit, kuva |
| Lomakeviestit | Adminin viestilaatikko | Saapuneet yhteydenotot, toimitilakyselyt ja asuntohakemukset |

**Huom.** Julkiset referenssit ovat adminin `Asiakkaan julkinen referenssiluettelo` -osiossa. Vanha erillinen referenssiarkisto ei päivitä julkista listaa eikä sitä enää näytetä asiakkaan perusnäkymässä.

## Kuvan lisääminen tai vaihtaminen

1. Valitse kuvan käyttöpaikka, esimerkiksi Etusivu → Rakennuttamispalvelun kuva.
2. Jos kuva on jo ladattu, valitse **Valitse mediakirjastosta**. Valitse oikea kuva esikatselusta.
3. Jos kuva puuttuu, paina **Vaihda kuva** ja lataa JPEG, PNG tai WebP. Odota, että lataus valmistuu.
4. Paina sivun yläosan **Tallenna muutokset**. Pelkkä kuvan lataaminen ei julkaise kuvaa.
5. Avaa julkinen sivu ja tarkista, että uusi kuva näkyy halutussa paikassa. Sama kuva voidaan valita useaan käyttöpaikkaan ilman uutta latausta.

Julkaise vain kuvia, joihin JKP:llä on käyttöoikeus. Älä julkaise asiakkaan henkilötietoja tai kolmannen osapuolen kuvaa ilman asianmukaista lupaa.

## Tekstin tai referenssin muokkaaminen

1. Valitse oikea sivu ja kieliversio. FI- ja EN-tekstit päivitetään erikseen.
2. Muokkaa otsikkoa, ingressiä, kappaleita tai historian/hankkeen vaiheita.
3. Referenssit-osiossa voit lisätä projektirivin, muuttaa tehtäväkuvausta, lisätä kuvan ja muuttaa järjestystä nuolipainikkeilla. Poista projektirivi vain tarkoituksella.
4. Paina **Tallenna muutokset**. Tarkista julkinen sivu myös toisella kieliversiolla.

## Vuokrakohteet

- Luo uusi kohde ensin luonnoksena ja täydennä kohteen todelliset tiedot sekä kuva.
- Julkaise vain kohde, jonka tiedot ja saatavuus on vahvistettu.
- Piilota tai merkitse varatuksi kohde, jota ei enää voi tarjota. Tarkista FI- ja EN-listat.
- EN-lista käyttää samaa julkaistujen kohteiden tietoa, mutta kohdekohtainen lisätietosivu voi avautua suomeksi, kunnes englanninkielisen kohdesivun toteutuksesta sovitaan.

## Vianmääritys

- Jos kuva ei näy heti, päivitä julkinen sivu. Älä lataa kuvaa uudelleen ennen kuin olet tarkistanut tallennuksen onnistumisen.
- Jos tallennuksessa on virhe, älä toista toimintoa monta kertaa: kirjaa virheilmoitus ja ota yhteyttä ylläpitäjään.
- Jos lomakeviesti näkyy adminissa mutta ei sähköpostissa, merkitse ilmoitushäiriö ja varmista Resend-lähetyksen tila erikseen. Älä oleta sähköposti-ilmoituksen perillemenoa pelkän sivun onnistumisviestin perusteella.

**Sisältömuutokset eivät vaadi GitHub-commitia tai Vercel-deployta, kun Supabase-sisällönhallinta on käytössä.** Designin ja teknisen rakenteen muuttaminen tehdään erikseen kehittäjän hallitsemana.
