import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildRentalPayload } from "@/lib/admin-payloads";
import { normalizeRental } from "@/lib/admin-records";
import { getAdminUser } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AdminRental } from "@/types/admin";

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ message: "Supabasea ei ole konfiguroitu." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("jkp_rental_properties")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: "Vuokrakohteiden lataus epäonnistui." }, { status: 500 });
  }

  return NextResponse.json({ items: (data || []).map((row) => normalizeRental(row)) });
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

  const body = (await request.json().catch(() => ({}))) as Partial<AdminRental>;
  const prepared = buildRentalPayload(body);
  if (prepared.error || !prepared.payload) {
    return NextResponse.json({ message: prepared.error || "Virheelliset kohdetiedot." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("jkp_rental_properties")
    .insert(prepared.payload)
    .select("*")
    .single();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { message: duplicate ? "Samalla verkko-osoitteella on jo kohde." : "Kohteen tallennus epäonnistui." },
      { status: duplicate ? 409 : 500 },
    );
  }

  revalidatePath("/vuokraus");
  revalidatePath(`/vuokraus/${prepared.slug}`);
  return NextResponse.json({ item: normalizeRental(data) }, { status: 201 });
}
