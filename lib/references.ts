import "server-only";

import { backendJson } from "@/lib/backend";
import { isSupabaseBackendEnabled } from "@/lib/supabase/admin";

export type ProjectReference = {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

const staticReferences: ProjectReference[] = [];

export async function getPublishedReferences(): Promise<ProjectReference[]> {
  if (!isSupabaseBackendEnabled()) {
    return [...staticReferences].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  try {
    const result = await backendJson<{ items?: Record<string, unknown>[] }>("public-references");
    if (!result.ok) return [];
    return (result.data.items || []).map((row) => ({
      id: String(row.id || ""),
      title: String(row.title || ""),
      category: String(row.category || ""),
      location: String(row.location || ""),
      summary: String(row.summary || ""),
      description: String(row.description || ""),
      imageUrl: String(row.imageUrl || ""),
      sortOrder: Number(row.sortOrder || 100),
    }));
  } catch (error) {
    console.error("JKP references query failed", error instanceof Error ? error.message : error);
    return [];
  }
}
