import { NextResponse } from "next/server";
import { deleteRundown, updateRundown } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

const TAHUN_VALID = /^\d{4}$/;

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah rundown." },
      { status: 401 }
    );
  }
  const tahun = new URL(req.url).searchParams.get("tahun");
  if (!tahun || !TAHUN_VALID.test(tahun)) {
    return NextResponse.json(
      { error: "Parameter tahun tidak valid." },
      { status: 400 }
    );
  }
  const body = await req.json();
  const startTime = typeof body.startTime === "string" ? body.startTime : "";
  const endTime = typeof body.endTime === "string" ? body.endTime : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (!startTime || !endTime || !title) {
    return NextResponse.json(
      { error: "Jam mulai, jam selesai, dan nama rundown wajib diisi." },
      { status: 400 }
    );
  }

  const { id } = await params;
  if (
    !(await updateRundown(tahun, id, {
      startTime,
      endTime,
      title,
      description,
    }))
  ) {
    return NextResponse.json(
      { error: "Rundown tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ id, startTime, endTime, title, description });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus rundown." },
      { status: 401 }
    );
  }
  const tahun = new URL(req.url).searchParams.get("tahun");
  if (!tahun || !TAHUN_VALID.test(tahun)) {
    return NextResponse.json(
      { error: "Parameter tahun tidak valid." },
      { status: 400 }
    );
  }
  const { id } = await params;
  if (!(await deleteRundown(tahun, id))) {
    return NextResponse.json(
      { error: "Rundown tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
