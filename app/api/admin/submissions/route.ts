import { NextResponse } from "next/server";
import { getAdminAccessToken, getAdminUser } from "@/lib/auth";
import { backendJson } from "@/lib/backend";
import { normalizeSubmission } from "@/lib/admin-records";

export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });

  const result = await backendJson<{ items?: Record<string, unknown>[]; message?: string }>("admin-submissions-list", { token });
  if (!result.ok) return NextResponse.json({ message: result.data.message || "Lomakeviestien lataus epäonnistui." }, { status: result.status });
  return NextResponse.json({ items: (result.data.items || []).map(normalizeSubmission) });
}
