import "server-only";

import { defaultContent, type SiteContent } from "@/content/defaults";

function text(value: unknown, fallback: string, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) || fallback : fallback;
}

function managedSiteMedia(value: unknown): string {
  if (typeof value !== "string") return "";
  const url = value.trim().slice(0, 800);
  return url.startsWith("/api/media/site/") && url.toLowerCase().endsWith(".webp")
    ? url
    : "";
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const source = record(value);
  const company = record(source.company);
  const hero = record(source.hero);
  const about = record(source.about);
  const rental = record(source.rental);
  const contact = record(source.contact);

  const businessAreas = Array.isArray(source.businessAreas)
    ? source.businessAreas
        .slice(0, 2)
        .map(record)
        .filter((item) => item.slug === "talotekniikka" || item.slug === "vuokraus")
        .map((item) => ({
          slug: item.slug as "talotekniikka" | "vuokraus",
          title: text(item.title, "", 180),
          summary: text(item.summary, "", 600),
        }))
        .filter((item) => item.title && item.summary)
    : [];

  const services = Array.isArray(source.services)
    ? source.services
        .slice(0, 8)
        .map(record)
        .map((item) => ({
          title: text(item.title, "", 160),
          description: text(item.description, "", 800),
        }))
        .filter((item) => item.title && item.description)
    : [];

  return {
    company: {
      name: text(company.name, defaultContent.company.name, 160),
      email: text(company.email, defaultContent.company.email, 180),
      phone: text(company.phone, defaultContent.company.phone, 60),
      area: text(company.area, defaultContent.company.area, 180),
    },
    hero: {
      eyebrow: text(hero.eyebrow, defaultContent.hero.eyebrow, 180),
      title: text(hero.title, defaultContent.hero.title, 300),
      lead: text(hero.lead, defaultContent.hero.lead, 1000),
      imageUrl: managedSiteMedia(hero.imageUrl),
    },
    about: {
      title: text(about.title, defaultContent.about.title, 300),
      body: text(about.body, defaultContent.about.body, 3000),
    },
    businessAreas: businessAreas.length === 2 ? businessAreas : defaultContent.businessAreas,
    services: services.length ? services : defaultContent.services,
    rental: {
      title: text(rental.title, defaultContent.rental.title, 300),
      lead: text(rental.lead, defaultContent.rental.lead, 1000),
    },
    contact: {
      title: text(contact.title, defaultContent.contact.title, 300),
      body: text(contact.body, defaultContent.contact.body, 1200),
    },
  };
}
