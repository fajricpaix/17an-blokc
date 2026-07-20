import { NextResponse } from "next/server";
import { addPerwakilan, getKategoriAntarBlok, getPerwakilan } from "@/lib/db";
import { KATEGORI_ANTAR_BLOK_BUTUH_KELAS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPerwakilan());
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const blockRaw =
    typeof body.block === "string"
      ? body.block.trim().toUpperCase().replace(/\s+/g, "")
      : "";
  const block = blockRaw === "CDANAU" ? "C DANAU" : blockRaw;
  const houseNumber =
    typeof body.houseNumber === "string" ? body.houseNumber.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";

  if (!name) {
    return NextResponse.json(
      { error: "Nama wajib diisi." },
      { status: 400 }
    );
  }
  const kategoriList = await getKategoriAntarBlok();
  const kategoriTerpilih = kategoriList.find((k) => k.name === category);
  if (!kategoriTerpilih) {
    return NextResponse.json(
      { error: "Kategori lomba antar blok tidak valid." },
      { status: 400 }
    );
  }
  if (kategoriTerpilih.locked) {
    return NextResponse.json(
      { error: "Pendaftaran cabor ini sudah dikunci oleh panitia." },
      { status: 400 }
    );
  }
  // Kelas peserta hanya diminta untuk kategori tertentu (mis. Futsal Junior).
  let kelas: string | undefined;
  if (category === KATEGORI_ANTAR_BLOK_BUTUH_KELAS) {
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

  const perwakilan = await addPerwakilan({
    name,
    kelas,
    block,
    houseNumber,
    categories: [category],
  });
  return NextResponse.json(perwakilan, { status: 201 });
}
