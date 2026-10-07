import "server-only";

type BackendOptions = {
  method?: "GET" | "POST";
  token?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  rawBody?: BodyInit;
};

export function isBackendBridgeConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function backendUrl(action: string, params: Record<string, string> = {}): string {
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Supabase URL puuttuu.");
  const url = new URL("/functions/v1/jkp-backend", base);
  url.searchParams.set("action", action);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}

export async function backendRequest(action: string, options: BackendOptions = {}): Promise<Response> {
  const headers: Record<string, string> = { ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let body = options.rawBody;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  return fetch(backendUrl(action, options.params), {
    method: options.method || "GET",
    headers,
    body,
    cache: "no-store",
  });
}

export async function backendJson<T>(
  action: string,
  options: BackendOptions = {},
): Promise<{ ok: boolean; status: number; data: T }> {
  const response = await backendRequest(action, options);
  const data = (await response.json().catch(() => ({}))) as T;
  return { ok: response.ok, status: response.status, data };
}
