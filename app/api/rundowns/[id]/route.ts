import { NextResponse } from "next/server";
import { deleteRundown } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus rundown." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deleteRundown(id))) {
    return NextResponse.json(
      { error: "Rundown tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
