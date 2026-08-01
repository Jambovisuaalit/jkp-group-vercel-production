import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildRentalPayload } from "@/lib/admin-payloads";
import { normalizeRental, stringArray } from "@/lib/admin-records";
import { getAdminUser } from "@/lib/auth";
import { removeManagedMedia } from "@/lib/media-storage";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AdminRental } from "@/types/admin";

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
  if (!id) return NextResponse.json({ message: "Kohdetunniste puuttuu." }, { status: 400 });

  const body = (await request.json().catch(() => ({}))) as Partial<AdminRental>;
  const prepared = buildRentalPayload(body);
  if (prepared.error || !prepared.payload) {
    return NextResponse.json({ message: prepared.error || "Virheelliset kohdetiedot." }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("jkp_rental_properties")
    .select("slug,mainImage,gallery")
    .eq("id", id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("jkp_rental_properties")
    .update(prepared.payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { message: duplicate ? "Samalla verkko-osoitteella on jo kohde." : "Kohteen tallennus epäonnistui." },
      { status: duplicate ? 409 : 500 },
    );
  }

  if (existing) {
    const previousMedia = [String(existing.mainImage || ""), ...stringArray(existing.gallery)];
    const retainedMedia = new Set([prepared.payload.mainImage, ...prepared.payload.gallery]);
    await removeManagedMedia(previousMedia.filter((url) => url && !retainedMedia.has(url)));
  }

  revalidatePath("/vuokraus");
  revalidatePath(`/vuokraus/${prepared.slug}`);
  if (existing?.slug && existing.slug !== prepared.slug) {
    revalidatePath(`/vuokraus/${existing.slug}`);
  }

  return NextResponse.json({ item: normalizeRental(data) });
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
    .from("jkp_rental_properties")
    .select("slug,mainImage,gallery")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("jkp_rental_properties").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ message: "Kohteen poistaminen epäonnistui." }, { status: 500 });
  }

  if (existing) {
    await removeManagedMedia([String(existing.mainImage || ""), ...stringArray(existing.gallery)]);
  }

  revalidatePath("/vuokraus");
  if (existing?.slug) revalidatePath(`/vuokraus/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
