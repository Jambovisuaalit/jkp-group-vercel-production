import { backendRequest } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const safeSegments = (segments || []).filter(
    (segment) => segment && segment !== "." && segment !== ".." && !segment.includes("\\"),
  );

  if (!safeSegments.length || safeSegments.length !== segments.length) {
    return new Response("Not found", { status: 404 });
  }

  const storagePath = safeSegments.join("/");
  try {
    const response = await backendRequest("media-download", { params: { path: storagePath } });
    if (!response.ok) {
      return new Response(response.status === 404 ? "Not found" : "Media unavailable", {
        status: response.status === 404 ? 404 : 503,
      });
    }
    return new Response(await response.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Media unavailable", { status: 503 });
  }
}
