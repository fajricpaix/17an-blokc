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
  const data: {
    name?: string;
    category?: Category;
    description?: string;
    active?: boolean;
  } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Nama perlombaan wajib diisi." },
        { status: 400 }
      );
    }
    data.name = name;
  }
  if ("category" in body) {
    if (!ALL_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { error: "Kategori tidak valid." },
        { status: 400 }
      );
    }
    data.category = body.category as Category;
  }
  if (typeof body.description === "string") {
    data.description = body.description.trim();
  }
  if (typeof body.active === "boolean") {
    data.active = body.active;
  }

  const { id } = await params;
  if (!(await updateCompetition(id, data))) {
    return NextResponse.json(
      { error: "Lomba tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ id, ...data });
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
