import { NextResponse } from "next/server";
import { getAdminUser, signOutAdmin } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
  });
}

export async function DELETE(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }
  await signOutAdmin();
  return NextResponse.json({ ok: true });
}
