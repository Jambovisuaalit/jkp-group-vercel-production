import "server-only";

export function getSupabasePublicConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabasePublicConfig());
}

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(getSupabasePublicConfig());
}

export function isSupabaseBackendEnabled(): boolean {
  const mode = process.env.DATA_BACKEND?.trim().toLowerCase();
  if (mode === "static") return false;
  return Boolean(getSupabasePublicConfig());
}
