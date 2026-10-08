import { NextResponse } from "next/server";
import { getAdminAccessToken, getAdminUser } from "@/lib/auth";
import { backendJson } from "@/lib/backend";

export async function POST() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Kirjaudu sisään ennen kutsun lähettämistä." }, { status: 401 });
  }
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });
  }

  const result = await backendJson<{ ok?: boolean; message?: string }>("admin-invite-owner", {
    method: "POST",
    token,
    body: {},
  });
  return NextResponse.json(
    { ok: result.ok && result.data.ok === true, message: result.data.message || "Kutsun lähettäminen epäonnistui." },
    { status: result.ok ? 201 : result.status },
  );
}
