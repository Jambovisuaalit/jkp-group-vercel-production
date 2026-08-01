import "server-only";

import { publicationColumns, slugify } from "@/lib/admin-records";
import type { AdminReference, AdminRental, PublicationState } from "@/types/admin";

function boundedString(value: unknown, max: number, fallback = ""): string {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function boundedArray(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function boundedSortOrder(value: unknown): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return 100;
  return Math.max(-10_000, Math.min(10_000, Math.trunc(number)));
}

export function resolvePublicationState(value: unknown): PublicationState {
  return value === "published" || value === "hidden" ? value : "draft";
}

export function buildRentalPayload(body: Partial<AdminRental>) {
  const title = boundedString(body.title, 180);
  const slug = slugify(boundedString(body.slug, 100) || title);
  const publicationState = resolvePublicationState(body.publicationState);

  if (!title || !slug) {
    return { error: "Kohteen nimi on pakollinen." as const, slug: "", payload: null };
  }

  return {
    error: null,
    slug,
    payload: {
      slug,
      title,
      type:
        body.type === "commercial" || body.type === "residential"
          ? body.type
          : "holiday",
      status:
        body.availability === "available" || body.availability === "occupied"
          ? body.availability
          : "always_active",
      city: boundedString(body.city, 120),
      address: boundedString(body.address, 240),
      summary: boundedString(body.summary, 600),
      description: boundedString(body.description, 6000),
      price: boundedString(body.price, 100),
      area: boundedString(body.area, 80),
      rooms: boundedString(body.rooms, 100),
      mainImage: boundedString(body.mainImage, 800),
      gallery: boundedArray(body.gallery, 20, 800),
      details: boundedArray(body.details, 30, 300),
      highlights: boundedArray(body.highlights, 20, 240),
      contactName: boundedString(body.contactName, 160, "JKP Group Oy") || "JKP Group Oy",
      sortOrder: boundedSortOrder(body.sortOrder),
      ...publicationColumns(publicationState),
    },
  };
}

export function buildReferencePayload(body: Partial<AdminReference>) {
  const title = boundedString(body.title, 180);
  const publicationState = resolvePublicationState(body.publicationState);

  if (!title) {
    return { error: "Referenssin nimi on pakollinen." as const, payload: null, publicationState };
  }

  if (publicationState === "published" && !body.permissionConfirmed) {
    return {
      error: "Julkaisulupa on vahvistettava ennen julkaisua." as const,
      payload: null,
      publicationState,
    };
  }

  return {
    error: null,
    publicationState,
    payload: {
      title,
      category: boundedString(body.category, 120),
      location: boundedString(body.location, 160),
      year: boundedString(body.year, 20),
      role: boundedString(body.role, 200),
      summary: boundedString(body.summary, 600),
      description: boundedString(body.description, 6000),
      imageUrl: boundedString(body.imageUrl, 800),
      gallery: boundedArray(body.gallery, 20, 800),
      permission_confirmed: Boolean(body.permissionConfirmed),
      sortOrder: boundedSortOrder(body.sortOrder),
      ...publicationColumns(publicationState),
    },
  };
}
