import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildReferencePayload } from "@/lib/admin-payloads";
import { normalizeReference } from "@/lib/admin-records";
import { getAdminUser } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AdminReference } from "@/types/admin";

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ message: "Supabasea ei ole konfiguroitu." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("jkp_references")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: "Referenssien lataus epäonnistui." }, { status: 500 });
  }

  return NextResponse.json({ items: (data || []).map((row) => normalizeReference(row)) });
}

export async function POST(request: Request) {
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

  const body = (await request.json().catch(() => ({}))) as Partial<AdminReference>;
  const prepared = buildReferencePayload(body);
  if (prepared.error || !prepared.payload) {
    return NextResponse.json({ message: prepared.error || "Virheelliset referenssitiedot." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("jkp_references")
    .insert(prepared.payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: "Referenssin tallennus epäonnistui." }, { status: 500 });
  }

  revalidatePath("/referenssit");
  return NextResponse.json({ item: normalizeReference(data) }, { status: 201 });
}
