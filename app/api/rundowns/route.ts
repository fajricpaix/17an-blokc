import { NextResponse } from "next/server";
import { addRundown, getRundowns } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const TAHUN_VALID = /^\d{4}$/;

export async function GET(req: Request) {
  const tahun = new URL(req.url).searchParams.get("tahun");
  if (!tahun || !TAHUN_VALID.test(tahun)) {
    return NextResponse.json(
      { error: "Parameter tahun tidak valid." },
      { status: 400 }
    );
  }
  return NextResponse.json(await getRundowns(tahun));
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menambah rundown." },
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
  const startTime =
    typeof body.startTime === "string" ? body.startTime.trim() : "";
  const endTime = typeof body.endTime === "string" ? body.endTime.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (!startTime || !endTime) {
    return NextResponse.json(
      { error: "Jam mulai dan jam selesai wajib diisi." },
      { status: 400 }
    );
  }
  if (!title) {
    return NextResponse.json(
      { error: "Nama rundown wajib diisi." },
      { status: 400 }
    );
  }

  const rundown = await addRundown(tahun, {
    startTime,
    endTime,
    title,
    description,
  });
  return NextResponse.json(rundown, { status: 201 });
}
