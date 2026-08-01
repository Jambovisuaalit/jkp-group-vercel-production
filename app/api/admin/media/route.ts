import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminUser } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 12_000_000;
const MAX_STORED_SIZE = 5_900_000;
const MAX_INPUT_PIXELS = 40_000_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_FOLDERS = new Set(["site", "rentals", "references"]);

async function optimizeImage(source: Buffer, quality: number): Promise<Buffer> {
  return sharp(source, { limitInputPixels: MAX_INPUT_PIXELS, sequentialRead: true })
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer();
}

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }
  if (!(await getAdminUser())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ message: "Supabasea ei ole konfiguroitu." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Valitse kuvatiedosto." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Sallittuja tiedostomuotoja ovat JPEG, PNG ja WebP." },
        { status: 400 },
      );
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Alkuperäisen kuvan enimmäiskoko on 12 Mt." },
        { status: 400 },
      );
    }

    const requestedFolder = String(formData.get("folder") || "site");
    if (!ALLOWED_FOLDERS.has(requestedFolder)) {
      return NextResponse.json({ message: "Virheellinen kuvaluokka." }, { status: 400 });
    }

    const source = Buffer.from(await file.arrayBuffer());
    let optimized = await optimizeImage(source, 84);
    if (optimized.byteLength > MAX_STORED_SIZE) {
      optimized = await optimizeImage(source, 70);
    }
    if (optimized.byteLength > MAX_STORED_SIZE) {
      return NextResponse.json(
        { message: "Kuva on optimoinnin jälkeen liian suuri. Valitse pienempi kuva." },
        { status: 400 },
      );
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "jkp-media";
    const path = `${requestedFolder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.webp`;

    const { data, error } = await supabase.storage.from(bucket).upload(path, optimized, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      console.error("JKP media upload failed", error.message);
      return NextResponse.json({ message: "Kuvan tallennus epäonnistui." }, { status: 502 });
    }

    const encodedPath = data.path.split("/").map(encodeURIComponent).join("/");
    return NextResponse.json({
      path: data.path,
      url: `/api/media/${encodedPath}`,
      bytes: optimized.byteLength,
      format: "webp",
    });
  } catch (error) {
    console.error(
      "JKP image processing failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json({ message: "Kuvan käsittely epäonnistui." }, { status: 400 });
  }
}
