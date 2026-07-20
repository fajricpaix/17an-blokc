import { NextResponse } from "next/server";
import {
  deletePerwakilan,
  getKategoriAntarBlok,
  getPerwakilan,
  updatePerwakilan,
} from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { KATEGORI_ANTAR_BLOK_BUTUH_KELAS } from "@/lib/types";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah cabor perwakilan." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const categories = Array.isArray(body.categories)
    ? body.categories.filter((c: unknown): c is string => typeof c === "string")
    : [];

  if (categories.length === 0) {
    return NextResponse.json(
      { error: "Pilih minimal satu cabor." },
      { status: 400 }
    );
  }
  const { id } = await params;
  const existing = (await getPerwakilan()).find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json(
      { error: "Perwakilan tidak ditemukan." },
      { status: 404 }
    );
  }

  const kategoriList = await getKategoriAntarBlok();
  const validNames = kategoriList.map((k) => k.name);
  if (!categories.every((c: string) => validNames.includes(c))) {
    return NextResponse.json(
      { error: "Ada cabor yang tidak valid." },
      { status: 400 }
    );
  }

  const cabroBaru = categories.filter(
    (c: string) => !existing.categories.includes(c)
  );
  const cabroBaruTerkunci = cabroBaru.filter(
    (c: string) => kategoriList.find((k) => k.name === c)?.locked
  );
  if (cabroBaruTerkunci.length > 0) {
    return NextResponse.json(
      {
        error: `Cabor "${cabroBaruTerkunci.join(", ")}" sudah dikunci, tidak bisa menambahkan peserta baru.`,
      },
      { status: 400 }
    );
  }

  let kelas: string | null = null;
  if (categories.includes(KATEGORI_ANTAR_BLOK_BUTUH_KELAS)) {
    kelas = typeof body.kelas === "string" ? body.kelas.trim() : "";
    if (!kelas) {
      return NextResponse.json(
        {
          error: `Kelas peserta ${KATEGORI_ANTAR_BLOK_BUTUH_KELAS} wajib diisi.`,
        },
        { status: 400 }
      );
    }
  }

  if (!(await updatePerwakilan(id, { categories, kelas }))) {
    return NextResponse.json(
      { error: "Perwakilan tidak ditemukan." },
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
      { error: "Hanya panitia yang boleh menghapus perwakilan." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deletePerwakilan(id))) {
    return NextResponse.json(
      { error: "Perwakilan tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
