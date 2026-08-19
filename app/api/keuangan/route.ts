import { NextResponse } from "next/server";
import { addKeuangan, getKeuangan } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { KATEGORI_PENGELUARAN, KeuanganEntry, WAKTU_KONSUMSI } from "@/lib/types";

export const dynamic = "force-dynamic";

const JENIS_VALID: KeuanganEntry["jenis"][] = ["Donasi", "Pengeluaran"];
const TAHUN_VALID = /^\d{4}$/;

export async function GET(req: Request) {
  const tahun = new URL(req.url).searchParams.get("tahun");
  if (!tahun || !TAHUN_VALID.test(tahun)) {
    return NextResponse.json(
      { error: "Parameter tahun tidak valid." },
      { status: 400 }
    );
  }
  return NextResponse.json(await getKeuangan(tahun));
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menambah transaksi keuangan." },
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
  const tanggal = typeof body.tanggal === "string" ? body.tanggal.trim() : "";
  const jenis = body.jenis;
  const alamatRumah =
    typeof body.alamatRumah === "string" ? body.alamatRumah.trim() : "";
  const kategoriPengeluaran = body.kategoriPengeluaran;
  const keteranganInput =
    typeof body.keterangan === "string" ? body.keterangan.trim() : "";

  if (!tanggal) {
    return NextResponse.json(
      { error: "Tanggal wajib diisi." },
      { status: 400 }
    );
  }
  if (!JENIS_VALID.includes(jenis)) {
    return NextResponse.json(
      { error: "Jenis transaksi tidak valid." },
      { status: 400 }
    );
  }

  if (jenis === "Donasi") {
    const jumlah = Number(body.jumlah);
    if (!Number.isFinite(jumlah) || jumlah <= 0) {
      return NextResponse.json(
        { error: "Jumlah harus berupa angka lebih dari 0." },
        { status: 400 }
      );
    }
    if (!alamatRumah) {
      return NextResponse.json(
        { error: "Alamat rumah donatur wajib diisi." },
        { status: 400 }
      );
    }
    const entry = await addKeuangan(tahun, {
      tanggal,
      keterangan: alamatRumah,
      jenis,
      jumlah,
      alamatRumah,
    });
    return NextResponse.json(entry, { status: 201 });
  }

  if (!KATEGORI_PENGELUARAN.includes(kategoriPengeluaran)) {
    return NextResponse.json(
      { error: "Kategori pengeluaran tidak valid." },
      { status: 400 }
    );
  }
  if (!keteranganInput) {
    return NextResponse.json(
      { error: "Keterangan pengeluaran wajib diisi." },
      { status: 400 }
    );
  }
  const jumlahSatuan = Number(body.jumlahSatuan);
  const hargaSatuan = Number(body.hargaSatuan);
  if (!Number.isFinite(jumlahSatuan) || jumlahSatuan <= 0) {
    return NextResponse.json(
      { error: "Jumlah satuan harus berupa angka lebih dari 0." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(hargaSatuan) || hargaSatuan <= 0) {
    return NextResponse.json(
      { error: "Harga satuan harus berupa angka lebih dari 0." },
      { status: 400 }
    );
  }

  const waktuKonsumsi = body.waktuKonsumsi;
  if (
    kategoriPengeluaran === "Konsumsi 17an" &&
    !WAKTU_KONSUMSI.includes(waktuKonsumsi)
  ) {
    return NextResponse.json(
      { error: "Waktu konsumsi (Sore/Malam) wajib dipilih." },
      { status: 400 }
    );
  }

  const entry = await addKeuangan(tahun, {
    tanggal,
    keterangan: keteranganInput,
    jenis,
    jumlah: jumlahSatuan * hargaSatuan,
    kategoriPengeluaran,
    jumlahSatuan,
    hargaSatuan,
    ...(kategoriPengeluaran === "Konsumsi 17an" ? { waktuKonsumsi } : {}),
  });
  return NextResponse.json(entry, { status: 201 });
}
