import "server-only";

import { backendJson } from "@/lib/backend";
import { isSupabaseBackendEnabled } from "@/lib/supabase/admin";

export type RentalProperty = {
  id: string;
  slug: string;
  title: string;
  type: "holiday" | "commercial" | "residential";
  status: "available" | "occupied" | "always_active";
  city: string;
  address: string;
  summary: string;
  description: string;
  price: string;
  area: string;
  rooms: string;
  mainImage: string;
  gallery: string[];
  details: string[];
  highlights: string[];
  contactName: string;
  published: boolean;
  sortOrder: number;
};

const staticRentals: RentalProperty[] = [];

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizeProperty(row: Record<string, unknown>): RentalProperty {
  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    title: String(row.title || ""),
    type: row.type === "commercial" || row.type === "residential" ? row.type : "holiday",
    status: row.status === "available" || row.status === "occupied" ? row.status : "always_active",
    city: String(row.city || ""),
    address: String(row.address || ""),
    summary: String(row.summary || ""),
    description: String(row.description || ""),
    price: String(row.price || ""),
    area: String(row.area || ""),
    rooms: String(row.rooms || ""),
    mainImage: String(row.mainImage || ""),
    gallery: normalizeStringArray(row.gallery),
    details: normalizeStringArray(row.details),
    highlights: normalizeStringArray(row.highlights),
    contactName: String(row.contactName || "JKP Group Oy"),
    published: Boolean(row.published),
    sortOrder: Number(row.sortOrder || 100),
  };
}

function isPubliclyVisible(property: RentalProperty): boolean {
  if (!property.published) return false;
  if (property.type === "holiday") return true;
  return property.status === "available";
}

export async function getPublishedRentals(): Promise<RentalProperty[]> {
  if (!isSupabaseBackendEnabled()) {
    return staticRentals.filter(isPubliclyVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  try {
    const result = await backendJson<{ items?: Record<string, unknown>[] }>("public-rentals");
    if (!result.ok) return [];
    return (result.data.items || []).map(normalizeProperty).filter(isPubliclyVisible);
  } catch (error) {
    console.error("JKP rentals query failed", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getRentalBySlug(slug: string): Promise<RentalProperty | null> {
  if (!isSupabaseBackendEnabled()) {
    return staticRentals.find((property) => property.slug === slug && isPubliclyVisible(property)) || null;
  }

  try {
    const result = await backendJson<{ item?: Record<string, unknown> | null }>("public-rental", {
      params: { slug },
    });
    if (!result.ok || !result.data.item) return null;
    const property = normalizeProperty(result.data.item);
    return isPubliclyVisible(property) ? property : null;
  } catch (error) {
    console.error("JKP rental query failed", error instanceof Error ? error.message : error);
    return null;
  }
}
