import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "npm:jose@6";

const BUCKET = "jkp-media";
const OWNER_ID = "team_zwsvoePoiBeskRuyl2Iar883";
const OWNER_SLUG = "info-32533854s-projects";
const PROJECT_ID = "prj_6R2VNoedHvdLR9wmbkMvLd70nWFe";
const PROJECT_NAME = "jkp-group-asiakas";

function secretKey(): string {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (modern) {
    const parsed = JSON.parse(modern);
    const value = parsed.default || Object.values(parsed)[0];
    if (typeof value === "string" && value) return value;
  }
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  throw new Error("missing_key");
}

const admin = createClient(Deno.env.get("SUPABASE_URL")!, secretKey(), {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyVercelPreview(req: Request) {
  const raw = req.headers.get("authorization") || "";
  if (!raw.toLowerCase().startsWith("bearer ")) return false;
  const token = raw.slice(7).trim();
  if (!token) return false;

  const decoded = decodeJwt(token);
  const issuer = typeof decoded.iss === "string" ? decoded.iss : "";
  const allowedIssuers = new Set([
    "https://oidc.vercel.com",
    `https://oidc.vercel.com/${OWNER_SLUG}`,
  ]);
  if (!allowedIssuers.has(issuer)) return false;

  const jwks = createRemoteJWKSet(new URL("/.well-known/jwks", issuer + "/"));
  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience: `https://vercel.com/${OWNER_SLUG}`,
  });

  return payload.owner_id === OWNER_ID &&
    payload.project_id === PROJECT_ID &&
    payload.project === PROJECT_NAME &&
    payload.environment === "preview";
}

async function findUser(email: string) {
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

Deno.serve(async (req: Request) => {
  try {
    if (!(await verifyVercelPreview(req))) {
      return Response.json({ ok: false }, { status: 404 });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "";
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (action === "bootstrap" && req.method === "POST") {
      const { data: buckets, error: listError } = await admin.storage.listBuckets();
      if (listError) throw listError;

      let bucketReady = Boolean(buckets?.some((bucket) => bucket.id === BUCKET));
      if (!bucketReady) {
        const { error: bucketError } = await admin.storage.createBucket(BUCKET, {
          public: false,
          allowedMimeTypes: ["image/webp"],
          fileSizeLimit: 8_000_000,
        });
        if (bucketError) throw bucketError;
        bucketReady = true;
      }

      if (!email || password.length < 12) {
        return Response.json({ ok: false, error: "invalid_qa_credentials" }, { status: 400 });
      }

      let user = await findUser(email);
      if (!user) {
        const { data, error } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          app_metadata: { jkp_qa_temporary: true, jkp_qa_owner: "vercel-preview" },
          user_metadata: { purpose: "JKP production QA", temporary: true },
        });
        if (error || !data.user) throw error || new Error("qa_user_create_failed");
        user = data.user;
      } else {
        if (user.app_metadata?.jkp_qa_temporary !== true || user.app_metadata?.jkp_qa_owner !== "vercel-preview") {
          return Response.json({ ok: false, error: "existing_user_not_qa" }, { status: 409 });
        }
        const { error } = await admin.auth.admin.updateUserById(user.id, {
          password,
          email_confirm: true,
          user_metadata: { purpose: "JKP production QA", temporary: true },
        });
        if (error) throw error;
      }

      const { error: adminError } = await admin.from("jkp_admin_users").upsert({
        user_id: user.id,
        role: "editor",
        display_name: "JKP QA",
        active: true,
      }, { onConflict: "user_id" });
      if (adminError) throw adminError;

      return Response.json({ ok: true, bucket: bucketReady, qaUser: true });
    }

    if (action === "cleanup" && req.method === "POST") {
      if (!email) return Response.json({ ok: false }, { status: 400 });
      const user = await findUser(email);
      if (user) {
        if (user.app_metadata?.jkp_qa_temporary !== true || user.app_metadata?.jkp_qa_owner !== "vercel-preview") {
          return Response.json({ ok: false, error: "cleanup_refused_non_qa_user" }, { status: 409 });
        }
        await admin.from("jkp_admin_users").delete().eq("user_id", user.id);
        const { error } = await admin.auth.admin.deleteUser(user.id);
        if (error) throw error;
      }
      return Response.json({ ok: true, qaUserRemoved: true });
    }

    return Response.json({ ok: false }, { status: 404 });
  } catch (error) {
    console.error("JKP setup failed", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, error: "setup_failed" }, { status: 500 });
  }
});