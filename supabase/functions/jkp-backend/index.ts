import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";


const BUCKET = "jkp-media";

function readNamed(envName: string, legacyName: string): string {
  const raw = Deno.env.get(envName);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const value = parsed.default || Object.values(parsed)[0];
      if (typeof value === "string" && value) return value;
    } catch {}
  }
  const legacy = Deno.env.get(legacyName);
  if (legacy) return legacy;
  throw new Error("missing_key");
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const secretKey = readNamed("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
const admin = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function bearer(req: Request): string {
  const value = req.headers.get("authorization") || "";
  return value.toLowerCase().startsWith("bearer ") ? value.slice(7).trim() : "";
}

async function allowedAdmin(req: Request) {
  const token = bearer(req);
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  const user = data?.user;
  if (error || !user) return null;



  const { data: row } = await admin
    .from("jkp_admin_users")
    .select("active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  return row?.active ? user : null;
}

async function requireAdmin(req: Request) {
  const user = await allowedAdmin(req);
  if (!user) return { user: null, response: json({ message: "Ei käyttöoikeutta." }, 401) };
  return { user, response: null };
}

function safeStoragePath(input: string): string {
  const decoded = decodeURIComponent(input || "");
  const parts = decoded.split("/").filter(Boolean);
  if (!parts.length || parts.some((p) => p === "." || p === ".." || p.includes("\\"))) return "";
  return parts.join("/");
}

async function health() {
  const names = [
    "jkp_site_content",
    "jkp_rental_properties",
    "jkp_references",
    "jkp_form_submissions",
    "jkp_admin_users",
  ];
  const tables: Record<string, boolean> = {};
  for (const name of names) {
    const { error } = await admin.from(name).select("*", { head: true, count: "exact" });
    tables[name] = !error;
  }
  const { data: buckets, error: bucketError } = await admin.storage.listBuckets();
  const storage = !bucketError && Boolean(buckets?.some((b) => b.id === BUCKET));

  let adminAuthUserExists = false;
  let customerOwnerAccountExists = false;
  try {
    const [roles, users] = await Promise.all([
      admin.from("jkp_admin_users").select("user_id,role").eq("active", true),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);
    if (roles.error || users.error) throw roles.error || users.error;
    const activeUserIds = new Set((users.data?.users || []).map((user) => user.id));
    adminAuthUserExists = Boolean(roles.data?.some((row) => activeUserIds.has(row.user_id)));
    customerOwnerAccountExists = Boolean(
      roles.data?.some((row) => row.role === "owner" && activeUserIds.has(row.user_id))
    );
  } catch {}

  const ok = Object.values(tables).every(Boolean) && storage;
  return json({ ok, tables, storage, adminAuthUserExists, customerOwnerAccountExists }, ok ? 200 : 503);
}

async function mediaList() {
  const uploaded: Array<{ name: string; path: string }> = [];
  const visited = new Set<string>();

  async function scan(prefix: string, depth: number): Promise<void> {
    if (depth > 4 || visited.has(prefix) || uploaded.length >= 400) return;
    visited.add(prefix);
    for (let offset = 0; offset < 400 && uploaded.length < 400; offset += 100) {
      const { data, error } = await admin.storage.from(BUCKET).list(prefix, {
        limit: 100,
        offset,
        sortBy: { column: "name", order: "desc" },
      });
      if (error) throw error;
      if (!data?.length) break;
      for (const item of data) {
        const path = prefix ? prefix + "/" + item.name : item.name;
        if (!item.id) {
          if (depth < 4 && item.name !== ".emptyFolderPlaceholder") await scan(path, depth + 1);
        } else if (/\.(?:jpe?g|png|webp)$/i.test(item.name)) {
          uploaded.push({ name: item.name, path });
        }
      }
      if (data.length < 100) break;
    }
  }

  await scan("", 0);
  return uploaded;
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "";

  try {
    if (action === "health" && req.method === "GET") return await health();

    if (action === "public-content" && req.method === "GET") {
      const { data, error } = await admin.from("jkp_site_content").select("content").eq("key", "main").maybeSingle();
      if (error) return json({ message: "Sisällön lataus epäonnistui." }, 502);
      return json({ content: data?.content || {} });
    }

    if (action === "public-references" && req.method === "GET") {
      const { data, error } = await admin
        .from("jkp_references")
        .select("*")
        .eq("published", true)
        .eq("hidden", false)
        .eq("permission_confirmed", true)
        .order("sortOrder", { ascending: true });
      if (error) return json({ message: "Referenssien lataus epäonnistui." }, 502);
      return json({ items: data || [] });
    }

    if (action === "public-rentals" && req.method === "GET") {
      const { data, error } = await admin
        .from("jkp_rental_properties")
        .select("*")
        .eq("published", true)
        .eq("hidden", false)
        .order("sortOrder", { ascending: true });
      if (error) return json({ message: "Vuokrakohteiden lataus epäonnistui." }, 502);
      return json({ items: data || [] });
    }

    if (action === "public-rental" && req.method === "GET") {
      const slug = (url.searchParams.get("slug") || "").slice(0, 180);
      const { data, error } = await admin
        .from("jkp_rental_properties")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .eq("hidden", false)
        .maybeSingle();
      if (error) return json({ message: "Vuokrakohteen lataus epäonnistui." }, 502);
      return json({ item: data || null });
    }

    if (action === "media-download" && req.method === "GET") {
      const path = safeStoragePath(url.searchParams.get("path") || "");
      if (!path) return new Response("Not found", { status: 404 });
      const { data, error } = await admin.storage.from(BUCKET).download(path);
      if (error || !data) return new Response("Not found", { status: 404 });
      return new Response(await data.arrayBuffer(), {
        status: 200,
        headers: {
          "Content-Type": data.type || "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    if (action === "contact" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const kind = ["contact", "commercial", "residential"].includes(body.kind) ? body.kind : "contact";
      const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
      const email = typeof body.email === "string" ? body.email.trim().slice(0, 180) : "";
      const message = typeof body.message === "string" ? body.message.trim().slice(0, 3000) : "";
      if (!name || !email.includes("@") || !message || body.consent !== true) {
        return json({ message: "Virheelliset lomaketiedot." }, 400);
      }
      const { error } = await admin.from("jkp_form_submissions").insert({
        kind,
        name,
        email,
        phone: typeof body.phone === "string" ? body.phone.slice(0, 40) : "",
        company: typeof body.company === "string" && body.company ? body.company.slice(0, 160) : null,
        business_id: typeof body.business_id === "string" && body.business_id ? body.business_id.slice(0, 40) : null,
        property: typeof body.property === "string" && body.property ? body.property.slice(0, 180) : null,
        message,
        details: body.details && typeof body.details === "object" ? body.details : {},
        consent: true,
        source: "website",
      });
      if (error) return json({ message: "Tietojen tallennus epäonnistui." }, 502);
      return json({ stored: true }, 201);
    }

    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;

    if (action === "admin-invite-owner" && req.method === "POST") {
      const actor = guard.user!;
      const { data: editor } = await admin.from("jkp_admin_users")
        .select("role,active").eq("user_id", actor.id).eq("active", true).maybeSingle();
      if (editor?.role !== "editor" || !actor.email?.toLowerCase().endsWith("@vidosocial.com")) {
        return json({ message: "Ei käyttöoikeutta asiakaskutsujen lähettämiseen." }, 403);
      }

      const customerEmail = "jari.koskela@jkpgroup.fi";
      const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (usersError) throw usersError;
      if (users.users.some((u) => u.email?.toLowerCase() === customerEmail)) {
        return json({ message: "Asiakastunnus on jo olemassa." }, 409);
      }
      // Generate an invitation without Supabase SMTP. Only the authorized
      // VIDO editor receives this one-time link and must deliver it privately.
      const { data: invited, error: inviteError } = await admin.auth.admin.generateLink({
        type: "invite",
        email: customerEmail,
        options: {
          redirectTo: "https://www.jkpgroup.fi/admin/reset-password",
          data: { display_name: "Jari Koskela", account: "JKP Group" },
        },
      });
      const actionLink = invited?.properties?.action_link;
      if (inviteError || !invited?.user?.id || !actionLink) {
        console.error("JKP owner link generation failed", inviteError?.message);
        return json({ message: "Aktivointilinkin luonti epäonnistui." }, 503);
      }
      const { error: roleError } = await admin.from("jkp_admin_users").upsert({
        user_id: invited.user.id, role: "owner", display_name: "Jari Koskela", active: true,
      }, { onConflict: "user_id" });
      if (roleError) {
        console.error("JKP owner role creation failed", roleError.message);
        // This user was just created by generateLink and did not exist beforehand.
        await admin.auth.admin.deleteUser(invited.user.id);
        return json({ message: "Käyttöoikeuden asetus epäonnistui; kutsu peruttiin." }, 503);
      }
      return json({
        ok: true,
        actionLink,
        email: customerEmail,
        message: "Henkilökohtainen aktivointilinkki luotiin. Toimita se asiakkaalle turvallisesti.",
      }, 201);
    }

    if (action === "admin-check" && req.method === "GET") {
      return json({ authenticated: true, user: { id: guard.user!.id, email: guard.user!.email } });
    }

    if (action === "admin-content-get" && req.method === "GET") {
      const { data, error } = await admin.from("jkp_site_content").select("content").eq("key", "main").maybeSingle();
      if (error) return json({ message: "Sisällön lataus epäonnistui." }, 502);
      return json({ content: data?.content || {} });
    }

    if (action === "admin-content-put" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { error } = await admin.from("jkp_site_content").upsert({ key: "main", content: body.content || {} }, { onConflict: "key" });
      if (error) return json({ message: "Sisällön tallennus epäonnistui." }, 502);
      return json({ ok: true });
    }

    if (action === "admin-references-list" && req.method === "GET") {
      const { data, error } = await admin.from("jkp_references").select("*").order("updated_at", { ascending: false });
      if (error) return json({ message: "Referenssien lataus epäonnistui." }, 502);
      return json({ items: data || [] });
    }

    if (action === "admin-references-create" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { data, error } = await admin.from("jkp_references").insert(body.payload || {}).select("*").single();
      if (error) return json({ message: "Referenssin tallennus epäonnistui.", duplicate: error.code === "23505" }, 502);
      return json({ item: data }, 201);
    }

    if (action === "admin-references-update" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { data, error } = await admin.from("jkp_references").update(body.payload || {}).eq("id", body.id || "").select("*").single();
      if (error) return json({ message: "Referenssin tallennus epäonnistui." }, 502);
      return json({ item: data });
    }

    if (action === "admin-references-delete" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { error } = await admin.from("jkp_references").delete().eq("id", body.id || "");
      if (error) return json({ message: "Referenssin poistaminen epäonnistui." }, 502);
      return json({ ok: true });
    }

    if (action === "admin-rentals-list" && req.method === "GET") {
      const { data, error } = await admin.from("jkp_rental_properties").select("*").order("updated_at", { ascending: false });
      if (error) return json({ message: "Vuokrakohteiden lataus epäonnistui." }, 502);
      return json({ items: data || [] });
    }

    if (action === "admin-rentals-create" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { data, error } = await admin.from("jkp_rental_properties").insert(body.payload || {}).select("*").single();
      if (error) return json({ message: "Kohteen tallennus epäonnistui.", duplicate: error.code === "23505" }, 502);
      return json({ item: data }, 201);
    }

    if (action === "admin-rentals-update" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { data, error } = await admin.from("jkp_rental_properties").update(body.payload || {}).eq("id", body.id || "").select("*").single();
      if (error) return json({ message: "Kohteen tallennus epäonnistui.", duplicate: error.code === "23505" }, 502);
      return json({ item: data });
    }

    if (action === "admin-rentals-delete" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { data: existing } = await admin.from("jkp_rental_properties").select("slug").eq("id", body.id || "").maybeSingle();
      const { error } = await admin.from("jkp_rental_properties").delete().eq("id", body.id || "");
      if (error) return json({ message: "Kohteen poistaminen epäonnistui." }, 502);
      return json({ ok: true, slug: existing?.slug || "" });
    }

    if (action === "admin-submissions-list" && req.method === "GET") {
      const { data, error } = await admin.from("jkp_form_submissions").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) return json({ message: "Lomakeviestien lataus epäonnistui." }, 502);
      return json({ items: data || [] });
    }

    if (action === "admin-submissions-update" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const allowed = ["new", "contacted", "processed", "archived", "spam"];
      if (!allowed.includes(body.status)) return json({ message: "Virheellinen käsittelytila." }, 400);
      const { data, error } = await admin.from("jkp_form_submissions").update({ status: body.status }).eq("id", body.id || "").select("*").single();
      if (error) return json({ message: "Viestin tilan päivitys epäonnistui." }, 502);
      return json({ item: data });
    }

    if (action === "admin-submissions-delete" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const { error } = await admin.from("jkp_form_submissions").delete().eq("id", body.id || "");
      if (error) return json({ message: "Testiviestin poistaminen epäonnistui." }, 502);
      return json({ ok: true });
    }

    if (action === "admin-media-delete" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const path = safeStoragePath(typeof body.path === "string" ? body.path : "");
      if (!path) return json({ message: "Virheellinen mediapolku." }, 400);
      const { error } = await admin.storage.from(BUCKET).remove([path]);
      if (error) return json({ message: "Testikuvan poistaminen epäonnistui." }, 502);
      return json({ ok: true });
    }

    if (action === "admin-media-list" && req.method === "GET") {
      const items = await mediaList();
      return json({ items });
    }

    if (action === "admin-media-upload" && req.method === "POST") {
      const path = safeStoragePath(url.searchParams.get("path") || "");
      if (!path || !path.endsWith(".webp")) return json({ message: "Virheellinen mediapolku." }, 400);
      const body = new Uint8Array(await req.arrayBuffer());
      if (!body.byteLength || body.byteLength > 8_000_000) return json({ message: "Virheellinen kuvatiedosto." }, 400);
      const { data, error } = await admin.storage.from(BUCKET).upload(path, body, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) return json({ message: "Kuvan tallennus epäonnistui." }, 502);
      return json({ path: data.path }, 201);
    }

    return json({ message: "Tuntematon toiminto." }, 404);
  } catch (error) {
    console.error("JKP backend bridge error", error instanceof Error ? error.message : error);
    return json({ message: "Backend-operaatio epäonnistui." }, 500);
  }
});