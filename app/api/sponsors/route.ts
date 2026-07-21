import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { addSponsor, getSponsors } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_LOGO_SIZE = 200 * 1024; // 200 KB
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "sponsor"
  );
}

export async function GET() {
  return NextResponse.json(await getSponsors());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menambah sponsor." },
      { status: 401 }
    );
  }

  const form = await req.formData();
  const name =
    typeof form.get("name") === "string" ? String(form.get("name")).trim() : "";
  const logo = form.get("logo");

  if (!name) {
    return NextResponse.json(
      { error: "Nama sponsor wajib diisi." },
      { status: 400 }
    );
  }
  if (!(logo instanceof File) || logo.size === 0) {
    return NextResponse.json(
      { error: "Logo sponsor wajib diunggah." },
      { status: 400 }
    );
  }
  const ext = ALLOWED_TYPES[logo.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Format logo harus PNG, JPG, WEBP, atau GIF." },
      { status: 400 }
    );
  }
  if (logo.size > MAX_LOGO_SIZE) {
    return NextResponse.json(
      { error: "Ukuran logo maksimal 200 KB." },
      { status: 400 }
    );
  }

  const dir = path.join(process.cwd(), "public", "sponsor");
  await mkdir(dir, { recursive: true });

  const filename = `${slugify(name)}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await logo.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const sponsor = await addSponsor({
    name,
    logoUrl: `/sponsor/${filename}`,
    createdAt: new Date().toISOString(),
    active: true,
  });
  return NextResponse.json(sponsor, { status: 201 });
}
