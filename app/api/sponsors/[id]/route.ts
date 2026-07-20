import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { deleteSponsor } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

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
