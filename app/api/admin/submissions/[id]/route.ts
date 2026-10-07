import { NextResponse } from "next/server";
import { getAdminAccessToken, getAdminUser } from "@/lib/auth";
import { backendJson } from "@/lib/backend";
import { normalizeSubmission } from "@/lib/admin-records";
import type { SubmissionStatus } from "@/types/admin";

type RouteContext = { params: Promise<{ id: string }> };
const allowed: SubmissionStatus[] = ["new", "contacted", "processed", "archived", "spam"];

export async function PUT(request: Request, context: RouteContext) {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { status?: SubmissionStatus };
  if (!body.status || !allowed.includes(body.status)) {
    return NextResponse.json({ message: "Virheellinen käsittelytila." }, { status: 400 });
  }

  const result = await backendJson<{ item?: Record<string, unknown>; message?: string }>("admin-submissions-update", {
    method: "POST", token, body: { id, status: body.status },
  });
  if (!result.ok || !result.data.item) {
    return NextResponse.json({ message: result.data.message || "Viestin tilan päivitys epäonnistui." }, { status: result.status || 500 });
  }
  return NextResponse.json({ item: normalizeSubmission(result.data.item) });
}
