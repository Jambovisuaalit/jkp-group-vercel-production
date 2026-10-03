import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminUser } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { defaultContent } from "@/content/defaults";

const MAX_FILE_SIZE = 12_000_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
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

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "jkp-media";
    const folder = String(formData.get("folder") || "website").replace(/[^a-z0-9/-]/gi, "");
    const path = `${folder || "website"}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.webp`;

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
    console.error("JKP image processing failed", error);
    return NextResponse.json({ message: "Kuvan käsittely epäonnistui." }, { status: 400 });
  }
}

type LibraryImage = { name: string; url: string; path: string; source: "default" | "uploaded"; };
/** Return a shared media library: static client-supplied assets and the files
 * already uploaded to JKP's private Supabase Storage bucket. No public listing. */
export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });

  const media = defaultContent.media;
  const defaults = Array.from(new Set([
    defaultContent.hero.imageUrl, media.technicalImageUrl, media.companyImageUrl,
    media.rentalImageUrl, ...media.serviceImages, ...media.referenceImages,
  ].filter(Boolean))).map((url): LibraryImage => ({
    name: url.split("/").pop() || "Asiakkaan kuva",
    url, path: url, source: "default",
  }));

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ items: defaults, storageConfigured: false });

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "jkp-media";
  const uploaded: LibraryImage[] = [];
  const visited = new Set<string>();
  try {
    async function scan(prefix: string, depth: number): Promise<void> {
      if (depth > 4 || visited.has(prefix) || uploaded.length >= 400) return;
      visited.add(prefix);
      for (let offset = 0; offset < 400 && uploaded.length < 400; offset += 100) {
        const { data, error } = await supabase!.storage.from(bucket).list(prefix, {
          limit: 100, offset, sortBy: { column: "name", order: "desc" },
        });
        if (error) throw error;
        if (!data?.length) break;
        for (const item of data) {
          const path = prefix ? prefix + "/" + item.name : item.name;
          if (!item.id) {
            if (depth < 4 && item.name !== ".emptyFolderPlaceholder") await scan(path, depth + 1);
          } else if (/\.(?:jpe?g|png|webp)$/i.test(item.name)) {
            uploaded.push({
              name: item.name, path, source: "uploaded",
              url: "/api/media/" + path.split("/").map(encodeURIComponent).join("/"),
            });
          }
        }
        if (data.length < 100) break;
      }
    }
    await scan("", 0);
    return NextResponse.json({ items: [...uploaded, ...defaults], storageConfigured: true });
  } catch (error) {
    console.error("JKP media library listing failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "Mediakirjaston lataus epäonnistui." }, { status: 502 });
  }
}
