import { NextResponse } from "next/server";
import { changeAdminEmail } from "@/lib/auth";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: string;
    newEmail?: string;
  };
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newEmail = typeof body.newEmail === "string" ? body.newEmail : "";

  if (!currentPassword || !newEmail) {
    return NextResponse.json({ message: "Anna nykyinen salasana ja uusi sähköpostiosoite." }, { status: 400 });
  }
  const result = await changeAdminEmail(currentPassword, newEmail);
  return NextResponse.json({ message: result.message }, { status: result.ok ? 200 : 400 });
}
