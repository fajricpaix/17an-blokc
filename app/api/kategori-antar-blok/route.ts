import { NextResponse } from "next/server";
import { addKategoriAntarBlok, getKategoriAntarBlok } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getKategoriAntarBlok());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menambah kategori lomba." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const icon = typeof body.icon === "string" ? body.icon.trim() : "";
  const tanggalMulai =
    typeof body.tanggalMulai === "string" && body.tanggalMulai
      ? body.tanggalMulai
      : undefined;
  const tanggalSelesai =
    typeof body.tanggalSelesai === "string" && body.tanggalSelesai
      ? body.tanggalSelesai
      : undefined;

  if (!name) {
    return NextResponse.json(
      { error: "Nama kategori lomba wajib diisi." },
      { status: 400 }
    );
  }
  if (!icon) {
    return NextResponse.json(
      { error: "Icon kategori lomba wajib diisi." },
      { status: 400 }
    );
  }
  if (tanggalMulai && tanggalSelesai && tanggalMulai > tanggalSelesai) {
    return NextResponse.json(
      { error: "Tanggal perlombaan tidak boleh setelah tanggal terakhir." },
      { status: 400 }
    );
  }

  const kategori = await addKategoriAntarBlok({
    name,
    icon,
    tanggalMulai,
    tanggalSelesai,
  });
  return NextResponse.json(kategori, { status: 201 });
}
