import { NextResponse } from "next/server";
import { addParticipant, getParticipants } from "@/lib/db";
import { categoryFromAge } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getParticipants());
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const age = Number(body.age);
  const blockRaw =
    typeof body.block === "string"
      ? body.block.trim().toUpperCase().replace(/\s+/g, "")
      : "";
  const block = blockRaw === "CDANAU" ? "C DANAU" : blockRaw;
  const houseNumber =
    typeof body.houseNumber === "string" ? body.houseNumber.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama anak wajib diisi." },
      { status: 400 }
    );
  }
  if (!Number.isInteger(age) || age < 4 || age > 12) {
    return NextResponse.json(
      { error: "Umur anak harus antara 4 - 12 tahun." },
      { status: 400 }
    );
  }
  if (!/^C(1[01]|[1-9])$/.test(block) && block !== "C DANAU") {
    return NextResponse.json(
      { error: "Blok rumah harus antara C1 - C11 atau C Danau. Contoh: C5" },
      { status: 400 }
    );
  }
  if (!houseNumber) {
    return NextResponse.json(
      { error: "Nomor rumah wajib diisi." },
      { status: 400 }
    );
  }

  const participant = await addParticipant({
    name,
    age,
    block,
    houseNumber,
    category: categoryFromAge(age),
  });
  return NextResponse.json(participant, { status: 201 });
}
