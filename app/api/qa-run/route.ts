// Automated write tests must use a dedicated disposable database, not production.
// Keep this legacy path closed until an isolated test environment is configured.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("Not found", { status: 404 });
}

export async function POST() {
  return new Response("Not found", { status: 404 });
}
