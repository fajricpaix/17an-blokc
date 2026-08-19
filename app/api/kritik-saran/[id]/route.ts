import { NextResponse } from "next/server";
import { deleteKritikSaran, updateKritikSaran } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah status kritik & saran." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const { id } = await params;
  const dibaca = Boolean(body.dibaca);

  if (!(await updateKritikSaran(id, { dibaca }))) {
    return NextResponse.json(
      { error: "Kritik & saran tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ id, dibaca });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus kritik & saran." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deleteKritikSaran(id))) {
    return NextResponse.json(
      { error: "Kritik & saran tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
