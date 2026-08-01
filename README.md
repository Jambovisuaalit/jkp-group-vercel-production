# JKP Group Oy — Vercel production source

Puhdas Next.js-tuotantorepository JKP Group Oy:n verkkosivustolle.

## Teknologia

- Next.js App Router
- React + TypeScript
- Vercel
- Supabase Database, Auth ja private Storage
- Resend lomakeilmoituksiin

## Vercel

Importoi tämä repository Verceliin suoraan GitHubista.

Suositellut asetukset:

- Production Branch: `main`
- Framework Preset: `Next.js`
- Root Directory: repositoryn juuri
- Build Command: Default
- Output Directory: Default
- Install Command: Default

`vercel.json` lukitsee frameworkin Next.js:ksi eikä käytä vanhaa staattista `public`-outputia.

## Ympäristömuuttujat

Kopioi nimet `.env.example`-tiedostosta Vercelin Preview- ja Production-ympäristöihin. Älä tallenna oikeita secret-avaimia GitHubiin.

Pakolliset Supabase-tuotannossa:

- `DATA_BACKEND=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_STORAGE_BUCKET=jkp-media`
- `NEXT_PUBLIC_SITE_URL`

Hallintakäyttäjää ei provisionoida ennen lopullisen omistajan valintaa:

- `ADMIN_EMAIL=`
- `ADMIN_DISPLAY_NAME=`

Lomakkeiden automaattiseen sähköpostiin:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

## Paikallinen käyttö

```bash
npm install
npm run dev
```

Tuotantotarkistus:

```bash
npm run lint
npm run build
```

Build voidaan ajaa ilman tuotantosecrettejä käyttämällä:

```bash
DATA_BACKEND=static npm run build
```

## Hallinta

Hallinta löytyy reitistä `/admin`.

Tuotantotoiminnot:

- vuokrakohteiden CRUD
- julkaisu / luonnos / piilotus
- saatavuus
- WebP-kuvalataus private Storageen
- referenssien CRUD + julkaisulupa
- sivuston perustekstit ja hero-kuva
- lomakeviestien inbox ja käsittelytila
- Supabase Auth -kirjautuminen
- salasanan vaihto ja palautus

Lopullinen pääkäyttäjä luodaan vasta luovutuksen yhteydessä komennolla:

```bash
npm run bootstrap:admin
```

Komento tarvitsee server-side Supabase-secretin sekä `ADMIN_EMAIL`- ja `ADMIN_DISPLAY_NAME`-arvot ympäristöstä. Salasanaa ei tallenneta lähdekoodiin.

## Turvallisuus

- `SUPABASE_SECRET_KEY` on vain palvelinympäristössä.
- `.env*`-salaisuuksia ei commitoida.
- `jkp-media` on private bucket.
- selaimelle ei anneta suoraa service-role-oikeutta.
- julkisilla lomakkeilla ei kerätä henkilötunnusta, pankkitietoja tai luottotietoasiakirjoja.

## Julkaisu

Ensin Vercel Preview. `jkpgroup.fi` kytketään vasta asiakashyväksynnän, lopullisten sisältöjen ja tuotanto-QA:n jälkeen.
