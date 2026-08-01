import { NextResponse } from "next/server";
import { changeAdminPassword } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";

export async function PUT(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };

  const currentPassword = body.currentPassword || "";
  const newPassword = body.newPassword || "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Anna nykyinen ja uusi salasana." },
      { status: 400 },
    );
  }

  const result = await changeAdminPassword(currentPassword, newPassword);
  return NextResponse.json(
    { message: result.message },
    { status: result.ok ? 200 : 400 },
  );
}
