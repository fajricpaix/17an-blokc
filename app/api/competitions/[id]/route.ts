import { NextResponse } from "next/server";
import { updateCompetition, deleteCompetition } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { ALL_CATEGORIES, Category } from "@/lib/types";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah lomba." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const category = body.category as Category;

  if (!name) {
    return NextResponse.json(
      { error: "Nama perlombaan wajib diisi." },
      { status: 400 }
    );
  }
  if (!ALL_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Kategori tidak valid." },
      { status: 400 }
    );
  }

  const { id } = await params;
  if (!(await updateCompetition(id, { name, category, description }))) {
    return NextResponse.json(
      { error: "Lomba tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ id, name, category, description });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus lomba." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deleteCompetition(id))) {
    return NextResponse.json(
      { error: "Lomba tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
