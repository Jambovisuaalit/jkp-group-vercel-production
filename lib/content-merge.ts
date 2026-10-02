import type { SiteContent } from "../content/defaults";

function mergeImageSlots(base: string[], incoming?: string[], initialized = false): string[] {
  if (!Array.isArray(incoming)) return base;
  if (initialized) return incoming;
  // Existing CMS records may contain only the empty placeholders created before
  // the customer supplied photos. Preserve real edits while filling legacy gaps.
  return base.map((src, index) => incoming[index]?.trim() || src);
}

export function mergeContent(base: SiteContent, incoming: Partial<SiteContent>): SiteContent {
  const merged: SiteContent = {
    ...base,
    ...incoming,
    company: { ...base.company, ...incoming.company },
    hero: { ...base.hero, ...incoming.hero },
    about: { ...base.about, ...incoming.about },
    companyPage: {
      fi: { ...base.companyPage.fi, ...incoming.companyPage?.fi },
      en: { ...base.companyPage.en, ...incoming.companyPage?.en },
    },
    homeCopy: {
      fi: { ...base.homeCopy.fi, ...incoming.homeCopy?.fi },
      en: { ...base.homeCopy.en, ...incoming.homeCopy?.en },
    },
    lviaPage: {
      fi: { ...base.lviaPage.fi, ...incoming.lviaPage?.fi },
      en: { ...base.lviaPage.en, ...incoming.lviaPage?.en },
    },
    heroEn: { ...base.heroEn, ...incoming.heroEn },
    contactEn: { ...base.contactEn, ...incoming.contactEn },
    technicalPage: {
      fi: { ...base.technicalPage.fi, ...incoming.technicalPage?.fi },
      en: { ...base.technicalPage.en, ...incoming.technicalPage?.en },
    },
    rental: { ...base.rental, ...incoming.rental },
    rentalEn: { ...base.rentalEn, ...incoming.rentalEn },
    contact: { ...base.contact, ...incoming.contact },
    references: Array.isArray(incoming.references) ? incoming.references : base.references,
    media: {
      ...base.media, ...incoming.media,
      serviceImages: mergeImageSlots(base.media.serviceImages, incoming.media?.serviceImages, incoming.media?.imageSlotsVersion === 1),
      referenceImages: mergeImageSlots(base.media.referenceImages, incoming.media?.referenceImages, incoming.media?.imageSlotsVersion === 1),
    },
    businessAreas: incoming.businessAreas?.length ? incoming.businessAreas : base.businessAreas,
    services: incoming.services?.length ? incoming.services : base.services,
  };
  // Apply the dated client decision once to records saved before confirmation.
  // Persisting the version on the next admin save preserves subsequent edits,
  // including deliberate image removals and withdrawn publication permissions.
  if ((incoming.clientConfirmationVersion ?? 0) < 1) {
    const correctYear = (text: string) => text.replace(/\b(?:1992|1995)\b/g, "1993");
    merged.hero = { ...merged.hero, title: correctYear(merged.hero.title), lead: correctYear(merged.hero.lead) };
    merged.heroEn = { ...merged.heroEn, title: correctYear(merged.heroEn.title), lead: correctYear(merged.heroEn.lead) };
    for (const locale of ["fi", "en"] as const) {
      const page = merged.companyPage[locale];
      merged.companyPage[locale] = {
        ...page,
        history: page.history.map(item => {
          if (["Alkuvaiheet", "Origins", "1992", "1993", "1995"].includes(item.era)) {
            return { era: "1993", texts: item.texts.map(correctYear) };
          }
          return { ...item, texts: item.texts.map(correctYear) };
        }),
      };
    }
    merged.media = {
      ...merged.media,
      contactImageUrl: "",
      approvedReferenceImageUrls: [...new Set([
        ...merged.media.approvedReferenceImageUrls,
        ...base.media.approvedReferenceImageUrls,
      ])],
    };
    merged.clientConfirmationVersion = 1;
  }
  return merged;
}

