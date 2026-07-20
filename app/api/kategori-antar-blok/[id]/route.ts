import { NextResponse } from "next/server";
import { deleteKategoriAntarBlok, updateKategoriAntarBlok } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah kategori lomba." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const data: {
    name?: string;
    icon?: string;
    tanggalMulai?: string | null;
    tanggalSelesai?: string | null;
    locked?: boolean;
  } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Nama kategori lomba wajib diisi." },
        { status: 400 }
      );
    }
    data.name = name;
  }
  if (typeof body.icon === "string") {
    const icon = body.icon.trim();
    if (!icon) {
      return NextResponse.json(
        { error: "Icon kategori lomba wajib diisi." },
        { status: 400 }
      );
    }
    data.icon = icon;
  }
  if ("tanggalMulai" in body) {
    data.tanggalMulai =
      typeof body.tanggalMulai === "string" && body.tanggalMulai
        ? body.tanggalMulai
        : null;
  }
  if ("tanggalSelesai" in body) {
    data.tanggalSelesai =
      typeof body.tanggalSelesai === "string" && body.tanggalSelesai
        ? body.tanggalSelesai
        : null;
  }
  if (typeof body.locked === "boolean") {
    data.locked = body.locked;
  }
  if (
    data.tanggalMulai &&
    data.tanggalSelesai &&
    data.tanggalMulai > data.tanggalSelesai
  ) {
    return NextResponse.json(
      { error: "Tanggal perlombaan tidak boleh setelah tanggal terakhir." },
      { status: 400 }
    );
  }

  const { id } = await params;
  if (!(await updateKategoriAntarBlok(id, data))) {
    return NextResponse.json(
      { error: "Kategori lomba tidak ditemukan." },
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
      { error: "Hanya panitia yang boleh menghapus kategori lomba." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deleteKategoriAntarBlok(id))) {
    return NextResponse.json(
      { error: "Kategori lomba tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
