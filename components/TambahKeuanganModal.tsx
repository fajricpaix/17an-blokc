"use client";

import { useState } from "react";
import Modal from "./Modal";
import {
  JenisKeuangan,
  KATEGORI_PENGELUARAN,
  KategoriPengeluaran,
  KeuanganEntry,
  WAKTU_KONSUMSI,
  WaktuKonsumsi,
} from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export default function TambahKeuanganModal({
  onClose,
  onSuccess,
  entry,
  defaultJenis = "Donasi",
}: {
  onClose: () => void;
  onSuccess: () => void;
  entry?: KeuanganEntry;
  defaultJenis?: JenisKeuangan;
}) {
  const isEdit = Boolean(entry);
  const [tanggal, setTanggal] = useState(
    entry?.tanggal ?? new Date().toISOString().slice(0, 10)
  );
  const [jenis, setJenis] = useState<JenisKeuangan>(
    entry?.jenis ?? defaultJenis
  );
  const [alamatRumah, setAlamatRumah] = useState(entry?.alamatRumah ?? "");
  const [kategoriPengeluaran, setKategoriPengeluaran] =
    useState<KategoriPengeluaran | "">(entry?.kategoriPengeluaran ?? "");
  const [waktuKonsumsi, setWaktuKonsumsi] = useState<WaktuKonsumsi | "">(
    entry?.waktuKonsumsi ?? ""
  );
  const [keterangan, setKeterangan] = useState(
    entry?.jenis === "Pengeluaran" ? entry.keterangan : ""
  );
  const [jumlah, setJumlah] = useState(
    entry?.jenis === "Donasi" ? String(entry.jumlah) : ""
  );
  const [jumlahSatuan, setJumlahSatuan] = useState(
    entry?.jumlahSatuan ? String(entry.jumlahSatuan) : ""
  );
  const [hargaSatuan, setHargaSatuan] = useState(
    entry?.hargaSatuan ? String(entry.hargaSatuan) : ""
  );
  const totalPengeluaran = Number(jumlahSatuan) * Number(hargaSatuan) || 0;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (
      jenis === "Pengeluaran" &&
      kategoriPengeluaran === "Konsumsi 17an" &&
      !waktuKonsumsi
    ) {
      setError("Waktu konsumsi (Sore/Malam) wajib dipilih.");
      return;
    }
    setLoading(true);
    try {
      const body =
        jenis === "Donasi"
          ? { tanggal, jenis, jumlah: Number(jumlah), alamatRumah }
          : {
              tanggal,
              jenis,
              kategoriPengeluaran,
              keterangan,
              jumlahSatuan: Number(jumlahSatuan),
              hargaSatuan: Number(hargaSatuan),
              waktuKonsumsi:
                kategoriPengeluaran === "Konsumsi 17an"
                  ? waktuKonsumsi
                  : undefined,
            };
      const res = await fetch(
        isEdit ? `/api/keuangan/${entry!.id}` : "/api/keuangan",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title={isEdit ? "Edit Transaksi Keuangan" : "Tambah Transaksi Keuangan"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Jenis <span className="text-primary">*</span>
          </label>
          <div className="flex gap-3">
            {(["Donasi", "Pengeluaran"] as JenisKeuangan[]).map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => setJenis(j)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                  jenis === j
                    ? j === "Donasi"
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {j === "Donasi" ? "⬆️ Donasi" : "⬇️ Pengeluaran"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Tanggal <span className="text-primary">*</span>
          </label>
          <input
            type="date"
            required
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        {jenis === "Donasi" ? (
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Alamat Rumah <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={alamatRumah}
              onChange={(e) => setAlamatRumah(e.target.value)}
              placeholder="Contoh: Blok C No. 12"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Kategori Pengeluaran <span className="text-primary">*</span>
              </label>
              <select
                required
                value={kategoriPengeluaran}
                onChange={(e) =>
                  setKategoriPengeluaran(e.target.value as KategoriPengeluaran)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              >
                <option value="" disabled>
                  Pilih kategori...
                </option>
                {KATEGORI_PENGELUARAN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            {kategoriPengeluaran === "Konsumsi 17an" && (
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Waktu Konsumsi <span className="text-primary">*</span>
                </label>
                <div className="flex gap-3">
                  {WAKTU_KONSUMSI.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWaktuKonsumsi(w)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                        waktuKonsumsi === w
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {w === "Sore" ? "🌇 Sore" : "🌙 Malam"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Keterangan <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Piala & medali juara lomba"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-semibold">
                  Jumlah Satuan <span className="text-primary">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  value={jumlahSatuan}
                  onChange={(e) => setJumlahSatuan(e.target.value)}
                  placeholder="Contoh: 5"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-semibold">
                  Harga Satuan (Rp) <span className="text-primary">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  value={hargaSatuan}
                  onChange={(e) => setHargaSatuan(e.target.value)}
                  placeholder="Contoh: 50000"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Total (Rp)
              </label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-bold text-dark-primary">
                {formatRupiah(totalPengeluaran)}
              </div>
            </div>
          </>
        )}
        {jenis === "Donasi" && (
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Jumlah (Rp) <span className="text-primary">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              step={1}
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="Contoh: 500000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        )}
        {error && <p className="text-sm font-medium text-primary">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-dark-primary disabled:opacity-60"
          >
            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Transaksi"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
          >
            Tutup
          </button>
        </div>
      </form>
    </Modal>
  );
}
