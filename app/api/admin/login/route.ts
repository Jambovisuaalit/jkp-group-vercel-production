import { NextResponse } from "next/server";
import { signInAdmin } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim().toLowerCase() || "";
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Anna sähköposti ja salasana." },
      { status: 400 },
    );
  }

  const result = await signInAdmin(email, password);
  if (!result.user) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: result.user.id,
      email: result.user.email,
    },
  });
}
