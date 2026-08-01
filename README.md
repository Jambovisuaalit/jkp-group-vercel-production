# JKP Group Oy — production source

JKP Group Oy:n Next.js-tuotantorepository. Tämä repository sisältää vain nykyisen Nordic Institutional -sovelluksen, Supabase-first CMS:n ja Vercel-julkaisun tarvitsemat tiedostot.

## Stack

- Node.js 22.x
- Next.js 16 / App Router
- React 19 + TypeScript
- Supabase Database, Auth ja private Storage
- Sharp-kuvaputki → WebP
- Resend lomakeilmoituksiin
- Vercel

## Paikallinen käyttö

```bash
npm install
npm run dev
```

Täysi laatutarkistus:

```bash
npm run check
```

Se ajaa järjestyksessä:

1. ESLint / Next.js Core Web Vitals
2. TypeScript `tsc --noEmit`
3. Next.js production build

CI-build voidaan ajaa ilman tuotantosecrettejä:

```bash
DATA_BACKEND=static SITE_INDEXING_ENABLED=false npm run check
```

## Vercel

Importoi repository GitHubista asetuksilla:

- Production Branch: `main`
- Framework Preset: `Next.js`
- Root Directory: repository root
- Build Command: Default
- Output Directory: Default
- Install Command: Default

`vercel.json` ei sisällä legacy-output-ylikirjoituksia.

## Ympäristömuuttujat

Katso `.env.example`. Oikeita salaisuuksia ei tallenneta GitHubiin.

Supabase-tuotanto:

```text
DATA_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
SUPABASE_STORAGE_BUCKET=jkp-media
NEXT_PUBLIC_SITE_URL=https://jkpgroup.fi
```

Previewssa indeksointi pidetään pois päältä:

```text
SITE_INDEXING_ENABLED=false
```

Vasta hyväksytyssä `jkpgroup.fi`-tuotannossa:

```text
SITE_INDEXING_ENABLED=true
```

Hallintakäyttäjä jätetään määrittämättä kehitys- ja preview-vaiheessa:

```text
ADMIN_EMAIL=
ADMIN_DISPLAY_NAME=
```

Lomakeilmoitukset:

```text
RESEND_API_KEY=...
CONTACT_FROM_EMAIL=...
CONTACT_TO_EMAIL=jari.koskela@jkpgroup.fi
```

## Arkkitehtuuri

### Julkinen sivusto

- `/`
- `/talotekniikka`
- `/vuokraus`
- `/vuokraus/[slug]`
- `/referenssit`
- `/robots.txt`
- `/sitemap.xml`

Julkinen sisältö luetaan palvelinpuolella. Selain ei saa Supabase service-role -avainta eikä suoraa Storage-oikeutta.

### CMS

Hallinta: `/admin`

- Supabase Auth
- HTTP-only, Secure, SameSite=Strict session-cookie
- käyttöoikeuden ainoa lähde: aktiivinen `jkp_admin_users`-rivi
- vuokrakohteiden CRUD + julkaisu/saatavuus/piilotus
- referenssien CRUD + julkaisulupa
- perustekstit ja hero-kuva
- lomakeviestien inbox ja käsittelytila
- salasanan vaihto ja palautus

Pääkäyttäjä provisionoidaan vasta luovutuksessa:

```bash
npm run bootstrap:admin
```

Salasanaa ei tallenneta lähdekoodiin.

### Media

- bucket: `jkp-media`
- private
- Storage hyväksyy vain WebP:n
- upload API hyväksyy JPEG/PNG/WebP-lähteen
- enintään 12 Mt lähdetiedosto
- enintään 40 megapikselin dekoodaus
- automaattinen orientointi
- enintään 2000 × 2000 px
- tallennettu WebP jää alle 6 Mt bucket-rajan
- julkinen media kulkee vain `/api/media/...`-proxyn kautta

### Lomakkeet

Lomaketyypit ovat eksplisiittisiä:

- `contact`
- `commercial`
- `residential`

Palvelin validoi pakolliset kentät, consentin, payload-koon ja lomaketyypin. Selvästi tunnistettavat henkilötunnus- ja FI-IBAN-muodot hylätään ennen tallennusta. Supabase-tallennus tehdään ennen Resend-ilmoitusta, jotta sähköpostipalvelun häiriö ei kadota yhteydenottoa.

## Tietoturva

- fail-closed Supabase-tuotantotila
- RLS kaikissa JKP-tauluissa
- private Storage
- same-origin-tarkistus kaikissa selainmutaatioreiteissä
- server-side CMS-payloadien rajaus ja normalisointi
- DB-tason publication- ja julkaisulupaeheys
- CSP, frame denial, nosniff, permissions policy ja cross-origin-headerit
- preview on oletuksena `noindex`
- recovery-tokenit poistetaan selaimen URL:sta heti lukemisen jälkeen

## Migraatiot

Migraatiot sijaitsevat `supabase/migrations/`-hakemistossa. Uusi eheysmigraatio varmistaa lisäksi:

- `published` ja `hidden` eivät voi olla samanaikaisesti totta
- referenssiä ei voi julkaista ilman `permission_confirmed=true`
- `always_active` kuuluu vain holiday/kiinteistötyyppiin
- JSON-kenttien rakenteet pysyvät oikean tyyppisinä

## Release gate

`main`-haaraan ei yhdistetä eikä domainia kytketä ennen kuin kaikki seuraavat täyttyvät:

- [ ] riippuvuuksien asennus onnistuu
- [ ] `npm run lint` onnistuu
- [ ] `npm run typecheck` onnistuu
- [ ] `npm run build` onnistuu
- [ ] Vercel Preview on `READY`
- [ ] Supabase-ympäristömuuttujat on todennettu oikeassa Vercel-projektissa
- [ ] adminin selain-E2E on läpäisty
- [ ] WebP-upload ja media-proxy on läpäisty selaimessa
- [ ] kaikki kolme lomaketta tallentuvat Supabaseen
- [ ] Resend-toimitus on testattu
- [ ] QA-data on poistettu
- [ ] referenssien kuvagallerian admin-UI on viimeistelty tai scope rajattu kirjallisesti
- [ ] tietosuojaseloste ja lopulliset asiakassisällöt on hyväksytty
- [ ] `SITE_INDEXING_ENABLED=true` asetetaan vasta tuotantoon

`jkpgroup.fi` kytketään vasta hyväksytyn previewn jälkeen.

## Release-hygienia

Repositoryssa ei vielä ole `package-lock.json`-tiedostoa. Suorat riippuvuudet on siksi pinnattu tarkkoihin vakaisiin versioihin, mutta lopullinen release edellyttää lockfilen generoimista onnistuneella `npm install` -ajolla ja sen commitointia ennen mergeä.
