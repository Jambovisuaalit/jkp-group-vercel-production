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
    eyebrow: "Rakennuttamisen ja talotekniikan asiantuntija",
    title: "Rakennuttamisen ja talotekniikan asiantuntijapalvelut",
    lead:
      "JKP Group tukee rakennushanketta esiselvityksestä toteutukseen, valvontaan ja vastaanottoon. Lisäksi vuokraamme omia liike- ja toimitiloja, asuntoja sekä loma-asuntoja.",
    imageUrl: "",
  },
  about: {
    title: "Kokonaisuus hallintaan suunnittelusta vastaanottoon",
    body:
      "Rakennuttamisessa huolehdimme kokonaisuudesta ja kokoamme hankkeen tarvitsemat asiantuntijapalvelut yhteen. Taloteknisessä valvonnassa painotamme laatua, toteutettavuutta, dokumentointia ja ratkaisujen toimivuutta kiinteistön elinkaaren aikana.",
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
  rental: {
    title: "Liike- ja toimitiloja, asuntoja sekä loma-asuntoja",
    lead:
      "Vuokraamme omia kohteitamme yrityksille ja yksityisille. Valikoimaan kuuluvat liike- ja toimitilat, asunnot sekä loma-asunnot ja lomakohteet.",
  },
  contact: {
    title: "Keskustellaan hankkeestasi tai vuokratarpeestasi.",
    body:
      "Ota yhteyttä JKP Groupiin, kun tarvitset rakennuttamisen tai talotekniikan asiantuntijapalvelua tai etsit vuokrakohdetta.",
  },
};
