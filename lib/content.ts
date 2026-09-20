import "server-only";

import { defaultContent, type SiteContent } from "@/content/defaults";
import {
  getSupabaseAdmin,
  isSupabaseBackendEnabled,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

const CONTENT_KEY = "main";

function mergeImageSlots(base: string[], incoming?: string[], initialized = false): string[] {
  if (!Array.isArray(incoming)) return base;
  if (initialized) return incoming;
  // Existing CMS records may contain only the empty placeholders created before
  // the customer supplied photos. Preserve real edits while filling legacy gaps.
  return base.map((src, index) => incoming[index]?.trim() || src);
}

function mergeContent(base: SiteContent, incoming: Partial<SiteContent>): SiteContent {
  return {
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
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseBackendEnabled()) return defaultContent;

  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultContent;

  const { data, error } = await supabase
    .from("jkp_site_content")
    .select("content")
    .eq("key", CONTENT_KEY)
    .maybeSingle();

  if (error) {
    console.error("JKP content query failed", error.message);
    return defaultContent;
  }

  const incoming = data?.content && typeof data.content === "object"
    ? (data.content as Partial<SiteContent>)
    : {};

  return mergeContent(defaultContent, incoming);
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  if (!isSupabaseBackendEnabled()) {
    throw new Error("Sisältöä hallitaan tällä hetkellä GitHubin versionhallinnassa.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabasea ei ole konfiguroitu.");

  const { error } = await supabase
    .from("jkp_site_content")
    .upsert({
      key: CONTENT_KEY,
      content: { ...content, media: { ...content.media, imageSlotsVersion: 1 } },
    }, { onConflict: "key" });

  if (error) throw new Error("Sisällön tallennus Supabaseen epäonnistui.");
}

export function isContentStorageConfigured(): boolean {
  return isSupabaseBackendEnabled() && isSupabaseConfigured();
}
