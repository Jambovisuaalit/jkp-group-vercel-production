import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { backendJson, backendRequest } from "@/lib/backend";
import { getAdminAccessToken, getAdminUser, signInAdmin } from "@/lib/auth";
import { saveSiteContent } from "@/lib/content";
import { getSupabasePublicConfig } from "@/lib/supabase/admin";
import type { SiteContent } from "@/content/defaults";

export const dynamic = "force-dynamic";

type QaResult = {
  bootstrap: boolean;
  login: boolean;
  session: boolean;
  contentWrite: boolean;
  imageUpload: boolean;
  imagePersist: boolean;
  imageRead: boolean;
  contentRollback: boolean;
  formDb: boolean;
  testDataCleanup: boolean;
  qaUserCleanup: boolean;
};

async function setupCall(
  action: "bootstrap" | "cleanup",
  oidc: string,
  email: string,
  password?: string,
) {
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Supabase URL puuttuu.");
  const response = await fetch(
    new URL(`/functions/v1/jkp-backend-setup?action=${action}`, base),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${oidc}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    },
  );
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
}

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return new Response("Not found", { status: 404 });
  }

  const email = process.env.JKP_QA_EMAIL || "";
  const password = process.env.JKP_QA_PASSWORD || "";
  const oidc = process.env.VERCEL_OIDC_TOKEN || "";
  if (!email || !password || !oidc) {
    return NextResponse.json({ ok: false, gate: "qa_environment" }, { status: 503 });
  }

  const result: QaResult = {
    bootstrap: false,
    login: false,
    session: false,
    contentWrite: false,
    imageUpload: false,
    imagePersist: false,
    imageRead: false,
    contentRollback: false,
    formDb: false,
    testDataCleanup: false,
    qaUserCleanup: false,
  };

  let token: string | null = null;
  let originalContent: Record<string, unknown> | null = null;
  let testMediaPath = "";
  let testSubmissionId = "";

  try {
    const bootstrap = await setupCall("bootstrap", oidc, email, password);
    result.bootstrap = bootstrap.ok && bootstrap.data?.bucket === true && bootstrap.data?.qaUser === true;
    if (!result.bootstrap) {
      return NextResponse.json({ ok: false, result, gate: "bootstrap" }, { status: 503 });
    }

    const login = await signInAdmin(email, password);
    result.login = Boolean(login.user);
    result.session = Boolean(await getAdminUser());
    token = await getAdminAccessToken();

    if (!result.login || !token) {
      return NextResponse.json({ ok: false, result, gate: "admin_login" }, { status: 503 });
    }

    const authConfig = getSupabasePublicConfig();
    if (!authConfig) throw new Error("Supabase Auth config missing");
    const qaClient = createClient(authConfig.url, authConfig.publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const directLogin = await qaClient.auth.signInWithPassword({ email, password });
    const directToken = directLogin.data.session?.access_token || token;
    token = directToken;

    const current = await backendJson<{ content?: Record<string, unknown> }>("admin-content-get", { token });
    if (!current.ok) throw new Error("content_read_failed");
    originalContent = current.data.content || {};

    await saveSiteContent(originalContent as unknown as SiteContent);
    const afterWrite = await backendJson<{ content?: Record<string, unknown> }>("public-content");
    result.contentWrite = afterWrite.ok &&
      JSON.stringify(afterWrite.data.content || {}) === JSON.stringify(originalContent);

    const image = await sharp({
      create: {
        width: 24,
        height: 24,
        channels: 3,
        background: { r: 238, g: 238, b: 238 },
      },
    }).webp({ quality: 82 }).toBuffer();

    testMediaPath = `qa/2026-10-07/${randomUUID()}.webp`;
    const upload = await backendRequest("admin-media-upload", {
      method: "POST",
      token,
      params: { path: testMediaPath },
      headers: { "Content-Type": "image/webp" },
      rawBody: image.buffer.slice(image.byteOffset, image.byteOffset + image.byteLength) as ArrayBuffer,
    });
    const uploadJson = await upload.json().catch(() => ({})) as { path?: string };
    result.imageUpload = upload.ok && uploadJson.path === testMediaPath;

    const originalMedia = originalContent.media && typeof originalContent.media === "object"
      ? originalContent.media as Record<string, unknown>
      : {};
    const tempContent = {
      ...originalContent,
      media: {
        ...originalMedia,
        technicalImageUrl: `/api/media/${testMediaPath.split("/").map(encodeURIComponent).join("/")}`,
      },
    };

    await saveSiteContent(tempContent as unknown as SiteContent);
    const persisted = await backendJson<{ content?: Record<string, unknown> }>("public-content");
    const persistedMedia = persisted.data.content?.media && typeof persisted.data.content.media === "object"
      ? persisted.data.content.media as Record<string, unknown>
      : {};
    result.imagePersist = persisted.ok &&
      persistedMedia.technicalImageUrl === tempContent.media.technicalImageUrl;

    const downloaded = await backendRequest("media-download", {
      params: { path: testMediaPath },
    });
    const downloadedBytes = downloaded.ok ? (await downloaded.arrayBuffer()).byteLength : 0;
    result.imageRead = downloaded.ok && downloadedBytes > 0;

    await saveSiteContent(originalContent as unknown as SiteContent);
    const rolledBack = await backendJson<{ content?: Record<string, unknown> }>("public-content");
    result.contentRollback = rolledBack.ok &&
      JSON.stringify(rolledBack.data.content || {}) === JSON.stringify(originalContent);

    const marker = `jkp-qa-${randomUUID()}@example.invalid`;
    const formInsert = await backendJson<{ stored?: boolean }>("contact", {
      method: "POST",
      body: {
        kind: "contact",
        name: "VIDO QA",
        email: marker,
        phone: "",
        company: "JKP QA",
        business_id: null,
        property: null,
        message: "Automated release QA 2026-10-07 — safe to delete.",
        details: { qa: "2026-10-07" },
        consent: true,
      },
    });

    const submissions = await backendJson<{ items?: Record<string, unknown>[] }>("admin-submissions-list", { token });
    const match = (submissions.data.items || []).find((item) => item.email === marker);
    testSubmissionId = typeof match?.id === "string" ? match.id : "";
    result.formDb = formInsert.ok && formInsert.data.stored === true && Boolean(testSubmissionId);

    if (testSubmissionId) {
      const deleted = await backendJson<{ ok?: boolean }>("admin-submissions-delete", {
        method: "POST",
        token,
        body: { id: testSubmissionId },
      });
      if (deleted.ok) testSubmissionId = "";
    }
    if (testMediaPath) {
      const deleted = await backendJson<{ ok?: boolean }>("admin-media-delete", {
        method: "POST",
        token,
        body: { path: testMediaPath },
      });
      if (deleted.ok) testMediaPath = "";
    }
    result.testDataCleanup = !testSubmissionId && !testMediaPath;

    const cleanup = await setupCall("cleanup", oidc, email);
    result.qaUserCleanup = cleanup.ok && cleanup.data?.qaUserRemoved === true;

    const ok = Object.values(result).every(Boolean);
    return NextResponse.json({ ok, result }, { status: ok ? 200 : 503 });
  } catch (error) {
    console.error("JKP release QA failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, result, gate: "qa_exception" }, { status: 503 });
  } finally {
    if (originalContent && token && !result.contentRollback) {
      try { await saveSiteContent(originalContent as unknown as SiteContent); } catch {}
    }
    if (testSubmissionId && token) {
      try {
        await backendJson("admin-submissions-delete", {
          method: "POST",
          token,
          body: { id: testSubmissionId },
        });
      } catch {}
    }
    if (testMediaPath && token) {
      try {
        await backendJson("admin-media-delete", {
          method: "POST",
          token,
          body: { path: testMediaPath },
        });
      } catch {}
    }
    if (!result.qaUserCleanup) {
      try { await setupCall("cleanup", oidc, email); } catch {}
    }
  }
}
