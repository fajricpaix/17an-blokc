import { NextResponse } from "next/server";
import { addKritikSaran, getKritikSaran } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh melihat kritik & saran." },
      { status: 401 }
    );
  }
  return NextResponse.json(await getKritikSaran());
}

export async function POST(req: Request) {
  const body = await req.json();
  const pesan = typeof body.pesan === "string" ? body.pesan.trim() : "";

  if (!pesan) {
    return NextResponse.json(
      { error: "Isi kritik & saran wajib diisi." },
      { status: 400 }
    );
  }

  const entry = await addKritikSaran({ pesan });
  return NextResponse.json(entry, { status: 201 });
}
