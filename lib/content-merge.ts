import type { SiteContent } from "@/content/defaults";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(base: T, incoming: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(incoming)) {
    return (incoming === undefined ? base : incoming) as T;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    const current = result[key];
    result[key] = isPlainObject(current) && isPlainObject(value)
      ? deepMerge(current, value)
      : value;
  }
  return result as T;
}

export function mergeContent(
  base: SiteContent,
  incoming: Partial<SiteContent>,
): SiteContent {
  return deepMerge(base, incoming);
}
