import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const ALLOWED_ROOTS = new Set(["site", "rentals", "references"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const safeSegments = (segments || []).filter(
    (segment) => segment && segment !== "." && segment !== ".." && !segment.includes("\\"),
  );

  if (
    !safeSegments.length ||
    safeSegments.length !== segments.length ||
    !ALLOWED_ROOTS.has(safeSegments[0]) ||
    !safeSegments.at(-1)?.toLowerCase().endsWith(".webp")
  ) {
    return new Response("Not found", { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return new Response("Media unavailable", { status: 503 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "jkp-media";
  const storagePath = safeSegments.join("/");
  const { data, error } = await supabase.storage.from(bucket).download(storagePath);

  if (error || !data) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(await data.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
