import "server-only";

import { defaultContent, type SiteContent } from "@/content/defaults";
import { mergeContent } from "@/lib/content-merge";
import { backendJson } from "@/lib/backend";
import { getAdminAccessToken } from "@/lib/auth";
import { isSupabaseBackendEnabled } from "@/lib/supabase/admin";

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseBackendEnabled()) return defaultContent;

  try {
    const result = await backendJson<{ content?: Partial<SiteContent> }>("public-content");
    if (!result.ok) return defaultContent;
    return mergeContent(defaultContent, result.data.content || {});
  } catch (error) {
    console.error("JKP content query failed", error instanceof Error ? error.message : error);
    return defaultContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  if (!isSupabaseBackendEnabled()) {
    throw new Error("Sisältöä hallitaan tällä hetkellä GitHubin versionhallinnassa.");
  }

  const token = await getAdminAccessToken();
  if (!token) throw new Error("Hallintaistunto puuttuu.");

  const result = await backendJson<{ ok?: boolean; message?: string }>("admin-content-put", {
    method: "POST",
    token,
    body: {
      content: { ...content, media: { ...content.media, imageSlotsVersion: 1 } },
    },
  });

  if (!result.ok) throw new Error(result.data.message || "Sisällön tallennus Supabaseen epäonnistui.");
}

export function isContentStorageConfigured(): boolean {
  return isSupabaseBackendEnabled();
}
