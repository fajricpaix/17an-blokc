import { NextResponse } from "next/server";
import { deleteKeuangan, updateKeuangan } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { KATEGORI_PENGELUARAN, KeuanganEntry, WAKTU_KONSUMSI } from "@/lib/types";

const JENIS_VALID: KeuanganEntry["jenis"][] = ["Donasi", "Pengeluaran"];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh mengubah transaksi keuangan." },
      { status: 401 }
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

  const { id } = await params;
  let data: Omit<KeuanganEntry, "id" | "createdAt">;

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
    data = { tanggal, keterangan: alamatRumah, jenis, jumlah, alamatRumah };
  } else {
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
    data = {
      tanggal,
      keterangan: keteranganInput,
      jenis,
      jumlah: jumlahSatuan * hargaSatuan,
      kategoriPengeluaran,
      jumlahSatuan,
      hargaSatuan,
      ...(kategoriPengeluaran === "Konsumsi 17an" ? { waktuKonsumsi } : {}),
    };
  }

  if (!(await updateKeuangan(id, data))) {
    return NextResponse.json(
      { error: "Transaksi tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ id, ...data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menghapus transaksi keuangan." },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!(await deleteKeuangan(id))) {
    return NextResponse.json(
      { error: "Transaksi tidak ditemukan." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
