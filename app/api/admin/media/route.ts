import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminAccessToken, getAdminUser } from "@/lib/auth";
import { backendJson, backendRequest } from "@/lib/backend";
import { defaultContent } from "@/content/defaults";

const MAX_FILE_SIZE = 12_000_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Valitse kuvatiedosto." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ message: "Sallittuja tiedostomuotoja ovat JPEG, PNG ja WebP." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Alkuperäisen kuvan enimmäiskoko on 12 Mt." }, { status: 400 });
    }

    const source = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(source)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();

    const folder = String(formData.get("folder") || "website").replace(/[^a-z0-9/-]/gi, "");
    const path = `${folder || "website"}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.webp`;

    const uploadBody = optimized.buffer.slice(
      optimized.byteOffset,
      optimized.byteOffset + optimized.byteLength,
    ) as ArrayBuffer;

    const response = await backendRequest("admin-media-upload", {
      method: "POST",
      token,
      params: { path },
      headers: { "Content-Type": "image/webp" },
      rawBody: uploadBody,
    });
    const result = (await response.json().catch(() => ({}))) as { path?: string; message?: string };

    if (!response.ok || !result.path) {
      return NextResponse.json({ message: result.message || "Kuvan tallennus epäonnistui." }, { status: response.status || 502 });
    }

    const encodedPath = result.path.split("/").map(encodeURIComponent).join("/");
    return NextResponse.json({
      path: result.path,
      url: `/api/media/${encodedPath}`,
      bytes: optimized.byteLength,
      format: "webp",
    });
  } catch (error) {
    console.error("JKP image processing failed", error);
    return NextResponse.json({ message: "Kuvan käsittely epäonnistui." }, { status: 400 });
  }
}

type LibraryImage = { name: string; url: string; path: string; source: "default" | "uploaded"; };

export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  const token = await getAdminAccessToken();
  if (!token) return NextResponse.json({ message: "Istunto puuttuu." }, { status: 401 });

  const media = defaultContent.media;
  const defaults = Array.from(new Set([
    defaultContent.hero.imageUrl, media.technicalImageUrl, media.companyImageUrl,
    media.rentalImageUrl, ...media.serviceImages, ...media.referenceImages,
  ].filter(Boolean))).map((url): LibraryImage => ({
    name: url.split("/").pop() || "Asiakkaan kuva",
    url, path: url, source: "default",
  }));

  try {
    const result = await backendJson<{ items?: Array<{ name: string; path: string }>; message?: string }>("admin-media-list", { token });
    if (!result.ok) {
      return NextResponse.json({ message: result.data.message || "Mediakirjaston lataus epäonnistui." }, { status: result.status });
    }
    const uploaded: LibraryImage[] = (result.data.items || []).map((item) => ({
      name: item.name,
      path: item.path,
      source: "uploaded",
      url: "/api/media/" + item.path.split("/").map(encodeURIComponent).join("/"),
    }));
    return NextResponse.json({ items: [...uploaded, ...defaults], storageConfigured: true });
  } catch (error) {
    console.error("JKP media library listing failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "Mediakirjaston lataus epäonnistui." }, { status: 502 });
  }
}
