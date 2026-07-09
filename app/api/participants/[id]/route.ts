import { NextResponse } from "next/server";
import { deleteParticipant } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus peserta." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deleteParticipant(id))) {
    return NextResponse.json(
      { error: "Peserta tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
