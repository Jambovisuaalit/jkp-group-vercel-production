import { clientReferences, type ClientReference } from "@/content/client-references";

export type ServiceItem = {
  title: string;
  description: string;
};

export type CompanyHistoryItem = { era: string; texts: string[] };
export type CompanyPageCopy = {
  title: string;
  intro: string[];
  historyTitle: string;
  history: CompanyHistoryItem[];
};
export type HomeCopy = {
  serviceHeading: string;
  tiles: string[];
  referenceHeading: string;
};
export type TechnicalPhase = { number: string; title: string; items: string[] };
export type LviaPhase = { number: string; title: string; description: string; items: string[] };
export type LviaPageCopy = {
  title: string; lead: string; phasesHeading: string; phasesLead: string;
  phases: LviaPhase[]; proofTitle: string; proofLead: string;
  contactTitle: string; contactLead: string;
};
export type TechnicalPageCopy = {
  title: string; lead: string; phases: TechnicalPhase[];
  supervisionTitle: string; supervisionLead: string;
  contactTitle: string; contactLead: string;
};

export type SiteContent = {
  company: {
    name: string;
    email: string;
    phone: string;
    area: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    imageUrl: string;
  };
  about: {
    title: string;
    body: string;
  };
  companyPage: { fi: CompanyPageCopy; en: CompanyPageCopy };
  homeCopy: { fi: HomeCopy; en: HomeCopy };
  heroEn: { title: string; lead: string };
  contactEn: { title: string; body: string };
  technicalPage: { fi: TechnicalPageCopy; en: TechnicalPageCopy };
  lviaPage: { fi: LviaPageCopy; en: LviaPageCopy };
  businessAreas: Array<{
    slug: "talotekniikka" | "vuokraus";
    title: string;
    summary: string;
  }>;
  services: ServiceItem[];
  rental: {
    title: string;
    lead: string;
  };
  rentalEn: { title: string; lead: string };
  contact: {
    title: string;
    body: string;
  };
  references: ClientReference[];
  media: {
    technicalImageUrl: string;
    companyImageUrl: string;
    rentalImageUrl: string;
    serviceImages: string[];
    referenceImages: string[];
    /** Publish only reference photos explicitly approved by the client via the account manager. */
    approvedReferenceImageUrls: string[];
    contactImageUrl: string;
    /** Distinguish deliberate admin edits from legacy empty image slots. */
    imageSlotsVersion?: number;
  };
};

export const defaultContent: SiteContent = {
  company: {
    name: "JKP Group Oy",
    email: "jari.koskela@jkpgroup.fi",
    phone: "+358 50 068 9855",
    area: "Jyväskylä ja Keski-Suomi",
  },
  hero: {
    eyebrow: "JKP GROUP OY",
    title: "Toimivaa talotekniikkaa vuodesta 1993.",
    lead:
      "Suunnittelua, valvontaa ja rakennuttamista vaativiin kiinteistö- ja rakennushankkeisiin uudis- ja peruskorjauskohteissa.",
    imageUrl: "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg",
  },
  about: {
    title: "Kokonaisuus hallintaan suunnittelusta vastaanottoon",
    body:
      "Rakennuttamisessa huolehdimme kokonaisuudesta ja kokoamme hankkeen tarvitsemat asiantuntijapalvelut yhteen. Taloteknisessä valvonnassa painotamme laatua, toteutettavuutta, dokumentointia ja ratkaisujen toimivuutta kiinteistön elinkaaren aikana.",
  },
  companyPage: {
    fi: { title: "Palvelua vuosien kokemuksella.", intro: ["Tavoitteenamme on löytää asiakkaalle edulliset ja nykyaikaiset kokonaisratkaisut. Selvitämme aina ensin asiakkaan tarpeet ja pyrimme löytämään hyvän kokonaisvaltaisen lopputuloksen kohtuullisin kustannuksin.","Otamme huomioon kiinteistön elinkaarivaatimukset ja ympäristötaloudellisuuden. Panostamme avoimuuteen, luotettavuuteen ja rehellisyyteen.","Tämän päivän muuttuva maailma tuo jatkuvasti mukanaan uusia haasteita, joihin vastaamme mukautumiskyvyllämme ja aikaa seuraamalla. Toimintamme perustuu kannattavuuteen, ja siksi kehitämme jatkuvasti uusia suunnittelu- ja toimintamalleja."], historyTitle: "Historia", history: [
  { era: "Alkuvaiheet", texts: ["Toiminta alkoi nimellä LVI-insinööritoimisto Mikroplast Oy. Liiketoimintakaupan myötä nimi muuttui myöhemmin JKP Group Oy:ksi."] },
  { era: "1990-luku", texts: ["Olimme mukana LVI-urakoinnissa ja toteutimme KVR-kohteita avaimet käteen -periaatteella. Projektikohteiden asennustöitä hoidettiin alihankintana; omaan työhön kuuluivat suunnittelu, dokumentointi ja projektinjohto.", "Kohteita olivat asuntotuotanto sekä liike-, toimitila- ja pk-teollinen rakentaminen. Näissä hankkeissa karttui käytännön osaamista kokonaistaloudellisten ratkaisujen löytämiseen."] },
  { era: "2000-luku", texts: ["LVI-suunnittelutöiden kysynnän kasvaessa KVR-hankkeet jäivät pois. Toiminta keskittyi LVI-suunnitteluun ja konsultointiin: suunnitteluun, valvontaan, selvityksiin ja kuntoarvioihin.", "Kohteet kattoivat asuntotuotantoa, liike- ja teollista rakentamista sekä julkishallinnollisia uudis- ja saneerauskohteita."] },
  { era: "2010-luku", texts: ["Liiketoimintakaupan myötä toiminta jatkui lähinnä omien liike- ja toimitilojen vuokraamisella ja niihin tehtävillä asiakasmuutoksilla."] },
  { era: "2016 ja sen jälkeen", texts: ["Perustimme yhdessä Fimpec Oy:n kanssa Fimpec Talotekniikka Oy:n, jossa osuutemme oli 20 %. Emoyhtiön yrityskauppojen myötä myimme osuutemme ja jatkoimme yhteistyötä Fimpec Oy:n kanssa.", "Tänä aikana toiminnan painopisteenä olivat rakennuttamis- ja valvontatehtävät. Myös suurteollisuuden hankkeet tulivat mukaan."] },
] },
    en: { title: "Service backed by years of experience.", intro: ["Our aim is to find affordable, modern solutions for customers. We begin by understanding their needs and seek a comprehensive result at a reasonable cost.","We consider the property's lifecycle requirements and environmental economics. Openness, reliability and honesty are central to how we work.","We respond to a changing world by adapting and following developments. We continually improve our planning and operating methods while maintaining profitable operations."], historyTitle: "History", history: [
  { era: "Origins", texts: ["The business began under the name LVI-insinööritoimisto Mikroplast Oy and later became JKP Group Oy following a business transaction."] },
  { era: "1990s", texts: ["We carried out turnkey HVAC contracting in housing, commercial premises and smaller industrial construction. Installation work was handled by subcontractors, while our own work included design, documentation and project management.", "This contracting experience provided practical knowledge of cost-efficient overall solutions."] },
  { era: "2000s", texts: ["As demand for HVAC design grew, turnkey contracting was phased out and the business focused on HVAC design, consulting, supervision, studies and condition assessments.", "Projects included housing, commercial, industrial and public-sector buildings, covering both new-build and renovation work."] },
  { era: "2010s", texts: ["Following a business transaction, operations focused primarily on renting our own commercial premises and making customer-specific alterations to them."] },
  { era: "2016 onwards", texts: ["Together with Fimpec Oy, we established Fimpec Talotekniikka Oy in 2016, with a 20% ownership interest. Following transactions involving the parent company, we sold our share and continued our cooperation with Fimpec Oy.", "Project management and supervision became central business activities, including projects in large-scale industry."] },
] },
  },
  homeCopy: {
    fi: { serviceHeading: "TALOTEKNIIKAN RAKENNUTTAMIS- JA VALVONTATEHTÄVIÄ VUOSIEN KOKEMUKSELLA", tiles: ["Talotekniikan rakennuttamispalvelut", "Valvontapalvelut", "Vuokrauspalvelut"], referenceHeading: "Referenssejä" },
    en: { serviceHeading: "BUILDING SERVICES PROJECT MANAGEMENT AND SUPERVISION — YEARS OF EXPERIENCE", tiles: ["Building services project management", "Supervision services", "Property rental"], referenceHeading: "References" },
  },
  lviaPage: {
    fi: {
      title: "Toimivat ja kustannustehokkaat LVI-ratkaisut koko elinkaarelle.",
      lead: "JKP Group tukee hanketta suunnitelmien arvioinnista asennusten valvontaan, testaukseen, käyttöönottoon ja vastaanottoon. Valvonnan tavoitteena on toimiva tekninen toteutus, joka on taloudellinen toteuttaa ja ylläpitää.",
      phasesHeading: "Selkeä vastuu suunnitelmista vastaanottoon.",
      phasesLead: "Työn sisältö ja vastuun laajuus määritellään hankekohtaisesti. Valvonta voidaan toteuttaa erillisenä toimeksiantona tai osana rakennuttamisen kokonaisuutta.",
      phases: [
  {
    number: "01",
    title: "Suunnitelmat ja toteutettavuus",
    description: "LVI-teknisten suunnitelmien, laitteistojen ja rajapintojen läpikäynti ennen toteutusta. Tarkastelu kohdistuu toimivuuteen, toteutettavuuteen ja ylläpidettävyyteen.",
    items: ["Suunnitelmien läpikäynti", "Teknisten ratkaisujen yhteensovitus", "Elinkaaren kustannusten huomiointi"],
  },
  {
    number: "02",
    title: "Rakentamisen valvonta",
    description: "Asennusten laadun, suunnitelmien mukaisuuden ja työvaiheiden seuranta työmaalla sekä havaintojen dokumentointi ja käsittely hankkeen osapuolten kanssa.",
    items: ["Asennusten tekninen ja laadullinen seuranta", "Poikkeamien ja korjausten seuranta", "Aikataulun ja kustannusten seurannan tuki"],
  },
  {
    number: "03",
    title: "Testaus ja käyttöönotto",
    description: "LVI-järjestelmien toimintakokeiden, säätöjen ja käyttöönoton valmistelun ja toteutumisen seuranta. Tarkoitus on varmistaa toimivat järjestelmät ennen luovutusta.",
    items: ["Toimintakokeiden ja testauksen seuranta", "Käyttöönoton vaiheistus", "Havaittujen puutteiden korjausten toteaminen"],
  },
  {
    number: "04",
    title: "Vastaanotto ja takuuaika",
    description: "Järjestelmien toimivuuden ja luovutusaineiston tarkastelu vastaanottovaiheessa sekä sovittujen takuuajan tehtävien seuranta.",
    items: ["Vastaanoton tekniset tarkastukset", "Luovutus- ja käyttöönottodokumentit", "Sovitut takuuajan tehtävät"],
  },
],
      proofTitle: "Valvontaa myös vaativissa teknisissä hankkeissa.",
      proofLead: "Asiakkaan toimittama referenssiaineisto kattaa muun muassa taloteknistä valvontaa ja käyttöönottoa teollisuuslaitoksissa, lentokenttäympäristössä ja muissa rakennushankkeissa.",
      contactTitle: "Kerro hankkeesi nykytilanteesta.",
      contactLead: "Ilmoita kohde ja sijainti, uudis- tai korjaushankkeen vaihe, tarvittavat järjestelmät, tavoiteaikataulu sekä valvonnan toivottu laajuus. Sovitaan tarkempi sisältö hankekohtaisesti.",
    },
    en: {
      title: "Functional and cost-efficient HVAC solutions throughout the building lifecycle.",
      lead: "JKP Group supports projects from design review through site supervision, system testing, commissioning and handover. The aim is a functional technical solution that is economical to implement and maintain.",
      phasesHeading: "Clearly defined responsibilities from plans to handover.",
      phasesLead: "The scope is agreed for each project. Supervision can be provided as a specific assignment or as part of a wider project-management responsibility.",
      phases: [
  {
    number: "01",
    title: "Design review and feasibility",
    description: "Review of HVAC plans, interfaces and equipment with attention to practical implementation, system performance and maintainability.",
    items: ["HVAC design review", "Coordination of technical interfaces", "Consideration of lifecycle costs"],
  },
  {
    number: "02",
    title: "Construction supervision",
    description: "Site follow-up for technical quality, conformity with plans and implementation progress, including documenting and following up observations.",
    items: ["Technical and quality supervision of installations", "Observation and corrective-action follow-up", "Support for schedule and cost follow-up"],
  },
  {
    number: "03",
    title: "Testing and commissioning",
    description: "Follow-up of system tests, adjustments and commissioning activities, with a focus on operational systems before handover.",
    items: ["Testing and functional checks", "Commissioning preparation and follow-up", "Verification of corrective actions"],
  },
  {
    number: "04",
    title: "Handover and warranty period",
    description: "Review of system operation and handover documentation, followed by agreed warranty-period tasks where included in the assignment.",
    items: ["Technical handover checks", "Commissioning and handover documents", "Agreed warranty-period follow-up"],
  },
],
      proofTitle: "Supervision in technically demanding environments.",
      proofLead: "The customer-supplied reference material includes HVAC supervision and commissioning in industrial facilities, airport environments and other construction projects.",
      contactTitle: "Tell us about your project.",
      contactLead: "Share the property and location, current project phase, relevant HVAC systems, target schedule and expected scope. Responsibilities are agreed for each assignment.",
    },
  },
  heroEn: { title: "Functional building services since 1993.", lead: "Design, supervision and project management for demanding new-build and renovation projects." },
  contactEn: { title: "Let's discuss your project or property requirement.", body: "Contact JKP Group when you need project or building services expertise, or are looking for a rental property." },
  technicalPage: {
    fi: {
      title: "Hankkeen kokonaisuus hallintaan esiselvityksestä vastaanottoon.",
      lead: "JKP Group kokoaa talotekniikan rakennuttamisen ja valvonnan yhdeksi selkeäksi kokonaisuudeksi. Tavoitteena on toteutuskelpoinen ratkaisu, hallittu kustannus ja dokumentoitu lopputulos.",
      phases: [
  { number: "01", title: "Esiselvitysvaihe", items: ["Luonnossuunnittelu", "Vaihtoehtotarkastelut", "Toteutustapamallit", "Kustannusarviot", "Budjetointi", "Sopimusasiat"] },
  { number: "02", title: "Toteutusvaihe", items: ["Suunnittelijoiden ja urakoitsijoiden valinta ja ohjaus", "Urakkakilpailutus", "LVI-valvonta", "Kustannusseuranta ja raportointi", "Viranomaisneuvottelut", "Talotekniikan asennusvalvonta"] },
  { number: "03", title: "Vastaanottovaihe", items: ["Vastaan- ja käyttöönottoon liittyvät tehtävät", "Taloudellinen loppuselvitys", "Takuuajan tehtävät"] },
],
      supervisionTitle: "Tavoitteena on tuottaa asiakkaalle toimivia ja kustannustehokkaita LVI-teknisiä ratkaisuja, jotka ovat edullisia toteuttaa ja ylläpitää kiinteistön elinkaaren ajan.",
      supervisionLead: "Valvonnan laajuus määritellään hankekohtaisesti. Suunnittelijoiden ja urakoitsijoiden valinta ja ohjaus, LVI-valvonta sekä käyttöönottoon ja vastaanottoon liittyvät tehtävät sovitaan toimeksiannossa.",
      contactTitle: "Kerro, missä vaiheessa hanke on nyt.",
      contactLead: "Lyhyt kuvaus kohteesta, aikataulusta ja tarvitusta vastuusta riittää ensimmäiseen arvioon.",
    },
    en: {
      title: "Keep the whole project under control from early planning to handover.",
      lead: "JKP Group brings building services project management and supervision together in one clear expert service. The focus is a practical solution, controlled costs and documented delivery.",
      phases: [{ number: "01", title: "Early planning", items: ["Concept design", "Option studies", "Delivery models", "Cost estimates", "Budgeting", "Contract matters"] }, { number: "02", title: "Implementation", items: ["Selection and management of designers and contractors", "Tendering", "HVAC supervision", "Cost monitoring and reporting", "Authority coordination", "Building services installation supervision"] }, { number: "03", title: "Handover", items: ["Handover and commissioning tasks", "Final financial settlement", "Warranty-period tasks"] }],
      supervisionTitle: "Our objective is functional, cost-effective HVAC solutions that are economical to implement and maintain throughout the property's lifecycle.",
      supervisionLead: "The agreed scope may include selection and management of designers and contractors, HVAC installation supervision, commissioning and handover tasks.",
      contactTitle: "Tell us where your project stands today.",
      contactLead: "A short description of the property, schedule and required responsibility is enough for an initial discussion.",
    },
  },
  businessAreas: [
    {
      slug: "talotekniikka",
      title: "Rakennuttaminen ja talotekniikka",
      summary:
        "Rakennuttaminen, valvonta, projektinjohto sekä käyttöönotot ja vastaanotot rakennushankkeen eri vaiheisiin.",
    },
    {
      slug: "vuokraus",
      title: "Vuokraustoiminta",
      summary:
        "Omia liike- ja toimitiloja, asuntoja sekä loma-asuntoja ja lomakohteita erilaisiin tarpeisiin.",
    },
  ],
  services: [
    {
      title: "Talotekniikan rakennuttaminen",
      description:
        "Hankkeen kokonaisohjaus esiselvityksestä suunnitteluun, toteutukseen ja vastaanottoon.",
    },
    {
      title: "Talotekniikan valvonta",
      description:
        "Yleis-, ajallinen, tekninen, laadullinen ja taloudellinen valvonta sekä dokumentointi.",
    },
    {
      title: "Projektinjohto",
      description:
        "Hankkeen osapuolten, kustannusten, aikataulun ja päätöksenteon koordinointi koko toteutuksen ajan.",
    },
    {
      title: "Käyttöönotot ja vastaanotot",
      description:
        "Vastaanotto-, luovutus- ja takuuajan tehtävät sekä taloteknisten järjestelmien toimivuuden varmistaminen.",
    },
  ],
  rentalEn: {
    title: "Commercial premises, apartments and holiday properties.",
    lead: "JKP Group rents its own properties to companies and private customers. Availability and details are discussed directly.",
  },
  rental: {
    title: "Liike- ja toimitiloja, asuntoja sekä loma-asuntoja",
    lead:
      "Vuokraamme omia kohteitamme yrityksille ja yksityisille. Valikoimaan kuuluvat liike- ja toimitilat, asunnot sekä loma-asunnot ja lomakohteet.",
  },
  references: clientReferences.map((entry) => ({ ...entry, areas: entry.areas ? [...entry.areas] : undefined })),
  media: {
    technicalImageUrl: "/images/jkp-teollisuus-hero-asiakkaan-kuva.jpeg",
    companyImageUrl: "/images/jkp-pdf-reference-02.jpg",
    rentalImageUrl: "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg",
    serviceImages: [
      "/images/jkp-pdf-reference-01.jpg",
      "/images/jkp-pdf-reference-06.jpg",
      "/images/jkp-asiakkaan-vuokrakohde-2026-09-18.jpg",
    ],
    referenceImages: [
      "/images/jkp-pdf-reference-01.jpg",
      "/images/jkp-pdf-reference-02.jpg",
      "/images/jkp-pdf-reference-05.jpg",
      "/images/jkp-pdf-reference-03.jpg",
      "/images/jkp-pdf-reference-04.jpg",
      "/images/jkp-pdf-reference-06.jpg",
      "/images/jkp-pdf-reference-07.jpg",
      "/images/jkp-pdf-reference-08.jpg",
      "/images/jkp-pdf-reference-09.jpg",
    ],
    // The nine customer-PDF photos are media assets, not automatically publication-approved.
    approvedReferenceImageUrls: [],
    contactImageUrl: "",
    imageSlotsVersion: 1,
  },
  contact: {
    title: "Keskustellaan hankkeestasi tai vuokratarpeestasi.",
    body:
      "Ota yhteyttä JKP Groupiin, kun tarvitset rakennuttamisen tai talotekniikan asiantuntijapalvelua tai etsit vuokrakohdetta.",
  },
};
