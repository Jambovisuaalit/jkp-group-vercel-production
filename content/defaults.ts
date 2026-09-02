export type ServiceItem = {
  title: string;
  description: string;
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
  contact: {
    title: string;
    body: string;
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
    eyebrow: "Yli 30 vuoden kokemus rakennus- ja kiinteistöalalta",
    title: "Talotekniikan asiantuntijapalvelut ja vuokraustoiminta",
    lead:
      "Luotettavaa talotekniikan rakennuttamista, valvontaa ja projektien johtamista sekä laadukkaita vuokrakohteita yksityisille ja yrityksille. Yli 30 vuoden kokemus rakennus- ja kiinteistöalalta asiakkaiden, urakoitsijoiden ja suunnittelijoiden yhteistyökumppanina.",
    imageUrl: "",
  },
  about: {
    title: "Asiantuntemusta rakennushankkeisiin",
    body:
      "Tarjoamme riippumatonta asiantuntijapalvelua talotekniikan rakennuttamiseen, valvontaan ja projektinhallintaan. Tavoitteemme on varmistaa, että hankkeet toteutuvat laadukkaasti, aikataulussa ja kustannustehokkaasti.",
  },
  businessAreas: [
    {
      slug: "talotekniikka",
      title: "Talotekniikan palvelut",
      summary:
        "Talotekniikan rakennuttaminen, valvonta, projektinjohto sekä käyttöönotot ja vastaanotot rakennushankkeen eri vaiheisiin.",
    },
    {
      slug: "vuokraus",
      title: "Vuokraustoiminta",
      summary:
        "Hyvin ylläpidettyjä ja laadukkaita asuntoja, liiketiloja sekä varasto- ja toimitiloja erilaisiin tarpeisiin.",
    },
  ],
  services: [
    {
      title: "Talotekniikan rakennuttaminen",
      description:
        "Rakennushankkeiden talotekninen ohjaus suunnittelusta käyttöönottoon.",
    },
    {
      title: "Talotekniikan valvonta",
      description:
        "LVIA-järjestelmien laadun, aikataulun ja toteutuksen valvonta.",
    },
    {
      title: "Projektinjohto",
      description:
        "Kokonaisvaltainen hankkeiden koordinointi ja eri osapuolten yhteistyön varmistaminen.",
    },
    {
      title: "Käyttöönotot ja vastaanotot",
      description:
        "Taloteknisten järjestelmien toimivuuden varmistaminen ennen luovutusta.",
    },
  ],
  rental: {
    title: "Vuokraustoiminta",
    lead:
      "Tarjoamme hyvin ylläpidettyjä ja laadukkaita vuokrakohteita erilaisiin tarpeisiin. Valikoimaan kuuluvat asunnot, liiketilat sekä varasto- ja toimitilat.",
  },
  contact: {
    title: "Keskustellaan hankkeestasi tai vuokratarpeestasi.",
    body:
      "Ota yhteyttä JKP Groupiin, kun tarvitset talotekniikan asiantuntijapalvelua tai etsit vuokrakohdetta.",
  },
};
