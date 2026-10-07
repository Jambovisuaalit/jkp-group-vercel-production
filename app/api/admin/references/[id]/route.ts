import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminAccessToken, getAdminUser } from "@/lib/auth";
import { backendJson } from "@/lib/backend";
import { normalizeReference, publicationColumns, stringArray } from "@/lib/admin-records";
import type { AdminReference, PublicationState } from "@/types/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<AdminReference>;
  const title = body.title?.trim() || "";
  if (!title) return NextResponse.json({ message: "Referenssin nimi on pakollinen." }, { status: 400 });

  const state: PublicationState = body.publicationState === "published" || body.publicationState === "hidden"
    ? body.publicationState
    : "draft";

  if (state === "published" && !body.permissionConfirmed) {
    return NextResponse.json({ message: "Julkaisulupa on vahvistettava ennen julkaisua." }, { status: 400 });
  }

  const payload = {
    title,
    category: body.category?.trim() || "",
    location: body.location?.trim() || "",
    year: body.year?.trim() || "",
    role: body.role?.trim() || "",
    summary: body.summary?.trim() || "",
    description: body.description?.trim() || "",
    imageUrl: body.imageUrl?.trim() || "",
    gallery: stringArray(body.gallery),
    permission_confirmed: Boolean(body.permissionConfirmed),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 100,
    ...publicationColumns(state),
  };

  const result = await backendJson<{ item?: Record<string, unknown>; message?: string }>("admin-references-update", {
    method: "POST", token, body: { id, payload },
  });
  if (!result.ok || !result.data.item) {
    return NextResponse.json({ message: result.data.message || "Referenssin tallennus epäonnistui." }, { status: result.status || 500 });
  }

  revalidatePath("/referenssit");
  return NextResponse.json({ item: normalizeReference(result.data.item) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });
  const { id } = await context.params;

  const result = await backendJson<{ ok?: boolean; message?: string }>("admin-references-delete", {
    method: "POST", token, body: { id },
  });
  if (!result.ok) return NextResponse.json({ message: result.data.message || "Referenssin poistaminen epäonnistui." }, { status: result.status });
  revalidatePath("/referenssit");
  return NextResponse.json({ ok: true });
}
