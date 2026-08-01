import "server-only";

import { defaultContent, type SiteContent } from "@/content/defaults";
import { normalizeSiteContent } from "@/lib/site-content-validation";
import {
  getSupabaseAdmin,
  isSupabaseBackendEnabled,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

const CONTENT_KEY = "main";

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

  return normalizeSiteContent(data?.content);
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  if (!isSupabaseBackendEnabled()) {
    throw new Error("Sisältöä hallitaan tällä hetkellä GitHubin versionhallinnassa.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabasea ei ole konfiguroitu.");

  const normalized = normalizeSiteContent(content);
  const { error } = await supabase
    .from("jkp_site_content")
    .upsert({ key: CONTENT_KEY, content: normalized }, { onConflict: "key" });

  if (error) throw new Error("Sisällön tallennus Supabaseen epäonnistui.");
}

export function isContentStorageConfigured(): boolean {
  return isSupabaseBackendEnabled() && isSupabaseConfigured();
}
