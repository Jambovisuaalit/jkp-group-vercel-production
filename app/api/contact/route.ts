import { NextResponse } from "next/server";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { getSupabaseAdmin, isSupabaseBackendEnabled } from "@/lib/supabase/admin";

const MAX_BODY_CHARS = 32_768;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmissionKind = "contact" | "commercial" | "residential";

type SubmissionBody = Record<string, unknown> & {
  kind?: unknown;
};

const labels: Record<string, string> = {
  company: "Yritys",
  businessId: "Y-tunnus",
  name: "Nimi / yhteyshenkilö",
  email: "Sähköposti",
  phone: "Puhelin",
  spaceType: "Tilatyyppi",
  areaNeed: "Tarvittava pinta-ala",
  preferredLocation: "Toivottu sijainti",
  startDate: "Aloitusajankohta",
  property: "Haettava kohde",
  occupants: "Asukkaiden määrä",
  moveInDate: "Toivottu muuttopäivä",
  rentalDuration: "Arvioitu asumisen kesto",
  pets: "Lemmikit",
  smoking: "Tupakointi",
  message: "Lisätiedot",
  privacyConsent: "Tietojen käsittely hyväksytty",
};

const detailKeys: Record<SubmissionKind, string[]> = {
  contact: [],
  commercial: ["spaceType", "areaNeed", "preferredLocation", "startDate"],
  residential: ["occupants", "moveInDate", "rentalDuration", "pets", "smoking"],
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function resolveKind(value: unknown): SubmissionKind | null {
  return value === "contact" || value === "commercial" || value === "residential"
    ? value
    : null;
}

function resolveSubject(kind: SubmissionKind, body: SubmissionBody): string {
  if (kind === "commercial") return "B2B-toimitilan tarjouspyyntö";
  if (kind === "residential") return "Asuntovuokrauksen hakemus";
  return clean(body.topic, 120) || "Yhteydenotto verkkosivulta";
}

function hasConsent(value: unknown): boolean {
  return value === true || value === "Hyväksytty";
}

function buildDetails(body: SubmissionBody, kind: SubmissionKind): Record<string, string> {
  return Object.fromEntries(
    detailKeys[kind]
      .map((key) => [key, clean(body[key], 300)] as const)
      .filter(([, value]) => value.length > 0),
  );
}

function buildEmailLines(body: SubmissionBody, kind: SubmissionKind): string[] {
  const keys = [
    "company",
    "businessId",
    "name",
    "email",
    "phone",
    ...detailKeys[kind],
    "property",
    "message",
    "privacyConsent",
  ];

  return keys
    .filter((key, index) => keys.indexOf(key) === index)
    .map((key) => {
      const cleaned = key === "privacyConsent"
        ? hasConsent(body[key]) ? "Kyllä" : "Ei"
        : clean(body[key], key === "message" ? 3000 : 300);
      return `${labels[key] || key}: ${cleaned || "-"}`;
    });
}

function validateRequiredFields(kind: SubmissionKind, body: SubmissionBody): string | null {
  const name = clean(body.name, 100);
  const email = clean(body.email, 180);
  const message = clean(body.message, 3000);

  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return "Täytä pakolliset yhteystiedot ja lisätiedot.";
  }

  if (kind === "commercial") {
    if (
      !clean(body.company, 160) ||
      !clean(body.phone, 40) ||
      !clean(body.spaceType, 120) ||
      !clean(body.areaNeed, 80) ||
      !clean(body.preferredLocation, 160)
    ) {
      return "Täytä yrityksen pakolliset tilatarvetiedot.";
    }
  }

  if (kind === "residential") {
    const occupants = Number(clean(body.occupants, 3));
    if (
      !clean(body.phone, 40) ||
      !clean(body.property, 180) ||
      !Number.isInteger(occupants) ||
      occupants < 1 ||
      occupants > 20 ||
      !clean(body.moveInDate, 20) ||
      !clean(body.rentalDuration, 100) ||
      !["Ei", "Kyllä"].includes(clean(body.smoking, 10))
    ) {
      return "Täytä vuokrahakemuksen pakolliset tiedot.";
    }
  }

  return null;
}

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ message: "Virheellinen sisältötyyppi." }, { status: 415 });
  }

  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > MAX_BODY_CHARS) {
      return NextResponse.json({ message: "Lomakepyyntö on liian suuri." }, { status: 413 });
    }

    const body = JSON.parse(rawBody) as SubmissionBody;
    const kind = resolveKind(body.kind);
    if (!kind) {
      return NextResponse.json({ message: "Virheellinen lomaketyyppi." }, { status: 400 });
    }

    const website = clean(body.website, 100);
    if (website) {
      return NextResponse.json({ message: "Lomakkeen lähetys epäonnistui." }, { status: 400 });
    }

    if (!hasConsent(body.privacyConsent)) {
      return NextResponse.json(
        { message: "Hyväksy tietojen käsittely ennen lähettämistä." },
        { status: 400 },
      );
    }

    const startedAt = Number(body.startedAt || 0);
    if (!Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < 1200) {
      return NextResponse.json({ message: "Lomake lähetettiin liian nopeasti." }, { status: 429 });
    }

    const validationError = validateRequiredFields(kind, body);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const name = clean(body.name, 100);
    const email = clean(body.email, 180);
    const phone = clean(body.phone, 40);
    const company = clean(body.company, 160);
    const businessId = clean(body.businessId, 40);
    const property = clean(body.property, 180);
    const message = clean(body.message, 3000);
    const subject = resolveSubject(kind, body);
    let stored = false;

    if (isSupabaseBackendEnabled()) {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json(
          { message: "Tietokantatallennusta ei ole konfiguroitu." },
          { status: 503 },
        );
      }

      const { error: databaseError } = await supabase.from("jkp_form_submissions").insert({
        kind,
        name,
        email,
        phone,
        company: company || null,
        business_id: businessId || null,
        property: property || null,
        message,
        details: buildDetails(body, kind),
        consent: true,
        source: "website",
      });

      if (databaseError) {
        console.error("JKP form persistence failed", databaseError.message);
        return NextResponse.json(
          { message: "Tietojen tallennus epäonnistui. Yritä myöhemmin uudelleen." },
          { status: 502 },
        );
      }
      stored = true;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = (process.env.CONTACT_TO_EMAIL || "jari.koskela@jkpgroup.fi").trim();
    const emailSubject = `${subject}: ${name}`;
    const emailBody = buildEmailLines(body, kind).join("\n");

    if (apiKey && from) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: email,
            subject: emailSubject,
            text: emailBody,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (emailResponse.ok) {
          return NextResponse.json({ message: "Tiedot vastaanotettu.", delivery: "resend" });
        }

        console.error("JKP Resend notification failed", await emailResponse.text());
      } catch (error) {
        console.error(
          "JKP Resend notification failed",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }

    if (stored) {
      return NextResponse.json({
        message: "Tiedot vastaanotettu ja tallennettu hallintaan.",
        delivery: "stored",
      });
    }

    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    return NextResponse.json({
      message: "Sähköpostiohjelma avataan. Lähetä viesti sieltä loppuun.",
      delivery: "mailto",
      mailtoUrl,
    });
  } catch {
    return NextResponse.json({ message: "Virheellinen lomakepyyntö." }, { status: 400 });
  }
}
