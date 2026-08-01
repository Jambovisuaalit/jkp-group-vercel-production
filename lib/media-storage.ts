import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const MEDIA_PREFIX = "/api/media/";

export function managedMediaPath(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith(MEDIA_PREFIX)) return null;

  try {
    const path = value
      .slice(MEDIA_PREFIX.length)
      .split("/")
      .map(decodeURIComponent)
      .filter(Boolean);

    if (!path.length || path.some((segment) => segment === "." || segment === ".." || segment.includes("\\"))) {
      return null;
    }

    return path.join("/");
  } catch {
    return null;
  }
}

export async function removeManagedMedia(values: unknown[]): Promise<void> {
  const paths = [...new Set(values.map(managedMediaPath).filter((value): value is string => Boolean(value)))];
  if (!paths.length) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "jkp-media";
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) console.error("JKP media cleanup failed", error.message);
}
