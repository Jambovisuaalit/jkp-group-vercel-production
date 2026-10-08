import { NextResponse } from "next/server";
import { backendJson } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await backendJson<{
      ok?: boolean;
      tables?: Record<string, boolean>;
      storage?: boolean;
      adminAuthUserExists?: boolean;
      message?: string;
    }>("health");

    return NextResponse.json(result.data, {
      status: result.ok ? 200 : result.status || 503,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  }
}
