import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteContent, isContentStorageConfigured, saveSiteContent } from "@/lib/content";
import { removeManagedMedia } from "@/lib/media-storage";
import { isTrustedMutationRequest } from "@/lib/request-security";
import { normalizeSiteContent } from "@/lib/site-content-validation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return NextResponse.json({ message: "Pyyntö hylättiin." }, { status: 403 });
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Ei käyttöoikeutta." }, { status: 401 });
  }
  if (!isContentStorageConfigured()) {
    return NextResponse.json({ message: "Sisältötietokantaa ei ole konfiguroitu." }, { status: 503 });
  }

  try {
    const raw = await request.json();
    const content = normalizeSiteContent(raw);
    if (!EMAIL_PATTERN.test(content.company.email)) {
      return NextResponse.json({ message: "Yhteyssähköposti ei ole kelvollinen." }, { status: 400 });
    }

    const previous = await getSiteContent();
    await saveSiteContent(content);

    if (previous.hero.imageUrl && previous.hero.imageUrl !== content.hero.imageUrl) {
      await removeManagedMedia([previous.hero.imageUrl]);
    }

    return NextResponse.json({ message: "Tallennettu." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Tallennus epäonnistui." },
      { status: 500 },
    );
  }
}
