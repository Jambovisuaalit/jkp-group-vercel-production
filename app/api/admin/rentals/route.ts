import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminAccessToken, getAdminUser } from "@/lib/auth";
import { backendJson } from "@/lib/backend";
import { normalizeRental, publicationColumns, slugify, stringArray } from "@/lib/admin-records";
import type { AdminRental, PublicationState } from "@/types/admin";

export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });
  const result = await backendJson<{ items?: Record<string, unknown>[]; message?: string }>("admin-rentals-list", { token });
  if (!result.ok) return NextResponse.json({ message: result.data.message || "Vuokrakohteiden lataus epäonnistui." }, { status: result.status });
  return NextResponse.json({ items: (result.data.items || []).map(normalizeRental) });
}

export async function POST(request: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<AdminRental>;
  const title = body.title?.trim() || "";
  const slug = slugify(body.slug?.trim() || title);
  if (!title || !slug) return NextResponse.json({ message: "Kohteen nimi on pakollinen." }, { status: 400 });

  const state: PublicationState =
    body.publicationState === "published" || body.publicationState === "hidden" ? body.publicationState : "draft";

  const payload = {
    slug, title,
    type: body.type === "commercial" || body.type === "residential" ? body.type : "holiday",
    status: body.availability === "available" || body.availability === "occupied" ? body.availability : "always_active",
    city: body.city?.trim() || "",
    address: body.address?.trim() || "",
    summary: body.summary?.trim() || "",
    description: body.description?.trim() || "",
    price: body.price?.trim() || "",
    area: body.area?.trim() || "",
    rooms: body.rooms?.trim() || "",
    mainImage: body.mainImage?.trim() || "",
    gallery: stringArray(body.gallery),
    details: stringArray(body.details),
    highlights: stringArray(body.highlights),
    contactName: body.contactName?.trim() || "JKP Group Oy",
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 100,
    ...publicationColumns(state),
  };

  const result = await backendJson<{ item?: Record<string, unknown>; message?: string; duplicate?: boolean }>("admin-rentals-create", {
    method: "POST", token, body: { payload },
  });
  if (!result.ok || !result.data.item) {
    return NextResponse.json(
      { message: result.data.duplicate ? "Samalla verkko-osoitteella on jo kohde." : result.data.message || "Kohteen tallennus epäonnistui." },
      { status: result.data.duplicate ? 409 : result.status || 500 },
    );
  }
  revalidatePath("/vuokraus");
  revalidatePath(`/vuokraus/${slug}`);
  return NextResponse.json({ item: normalizeRental(result.data.item) }, { status: 201 });
}
