import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { deleteSponsor, updateSponsor } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah status sponsor." },
      { status: 401 }
    );
  }
  const body = await req.json();
  if (typeof body.active !== "boolean") {
    return NextResponse.json(
      { error: "Status active wajib diisi." },
      { status: 400 }
    );
  }
  const { id } = await params;
  if (!(await updateSponsor(id, { active: body.active }))) {
    return NextResponse.json(
      { error: "Sponsor tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus sponsor." },
      { status: 401 }
    );
  }
  const { id } = await params;
  const deleted = await deleteSponsor(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Sponsor tidak ditemukan." },
      { status: 404 }
    );
  }

  // Best-effort hapus file logo dari disk — jangan gagalkan request kalau
  // filenya sudah tidak ada.
  try {
    const filename = path.basename(deleted.logoUrl);
    await unlink(path.join(process.cwd(), "public", "sponsor", filename));
  } catch {
    // abaikan jika file tidak ditemukan
  }

  return NextResponse.json({ ok: true });
}
