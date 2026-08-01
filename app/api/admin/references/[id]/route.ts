import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildReferencePayload } from "@/lib/admin-payloads";
import { normalizeReference, stringArray } from "@/lib/admin-records";
import { getAdminUser } from "@/lib/auth";
import { removeManagedMedia } from "@/lib/media-storage";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AdminReference } from "@/types/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ message: "Supabasea ei ole konfiguroitu." }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<AdminReference>;
  const prepared = buildReferencePayload(body);
  if (prepared.error || !prepared.payload) {
    return NextResponse.json({ message: prepared.error || "Virheelliset referenssitiedot." }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("jkp_references")
    .select("imageUrl,gallery")
    .eq("id", id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("jkp_references")
    .update(prepared.payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: "Referenssin tallennus epäonnistui." }, { status: 500 });
  }

  if (existing) {
    const previousMedia = [String(existing.imageUrl || ""), ...stringArray(existing.gallery)];
    const retainedMedia = new Set([prepared.payload.imageUrl, ...prepared.payload.gallery]);
    await removeManagedMedia(previousMedia.filter((url) => url && !retainedMedia.has(url)));
  }

  revalidatePath("/referenssit");
  return NextResponse.json({ item: normalizeReference(data) });
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ message: "Supabasea ei ole konfiguroitu." }, { status: 503 });
  }

  const { id } = await context.params;
  const { data: existing } = await supabase
    .from("jkp_references")
    .select("imageUrl,gallery")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("jkp_references").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: "Referenssin poistaminen epäonnistui." }, { status: 500 });
  }

  if (existing) {
    await removeManagedMedia([String(existing.imageUrl || ""), ...stringArray(existing.gallery)]);
  }

  revalidatePath("/referenssit");
  return NextResponse.json({ ok: true });
}
