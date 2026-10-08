import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Temporary, preview-only one-shot provisioning endpoint.
// Must be removed immediately after customer invitation attempt.
export async function GET() {
  if (process.env.VERCEL_ENV !== "preview" ||
      process.env.VERCEL_GIT_COMMIT_REF !== "fix/production-backend-20261007") {
    return new Response("Not found", { status: 404 });
  }

  const oidc = process.env.VERCEL_OIDC_TOKEN;
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!oidc || !base) {
    return NextResponse.json({ ok: false, stage: "preview_oidc_missing" }, { status: 503 });
  }

  const url = new URL("/functions/v1/jkp-backend-setup?action=invite-owner", base);
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + oidc, "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    invitationSubmitted?: boolean;
    roleAssigned?: boolean;
  };
  return NextResponse.json({
    ok: response.ok && data.ok === true,
    invitationSubmitted: data.invitationSubmitted === true,
    roleAssigned: data.roleAssigned === true,
    error: data.error,
  }, { status: response.status });
}
