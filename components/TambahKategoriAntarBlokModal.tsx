"use client";

import { useState } from "react";
import Modal from "./Modal";
import { KategoriAntarBlok } from "@/lib/types";

export default function TambahKategoriAntarBlokModal({
  onClose,
  onSuccess,
  kategori,
}: {
  onClose: () => void;
  onSuccess: () => void;
  kategori?: KategoriAntarBlok;
}) {
  const isEdit = Boolean(kategori);
  const [icon, setIcon] = useState(kategori?.icon ?? "");
  const [nama, setNama] = useState(kategori?.name ?? "");
  const [tanggalMulai, setTanggalMulai] = useState(
    kategori?.tanggalMulai ?? ""
  );
  const [tanggalSelesai, setTanggalSelesai] = useState(
    kategori?.tanggalSelesai ?? ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/kategori-antar-blok/${kategori!.id}` : "/api/kategori-antar-blok",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            icon,
            name: nama,
            tanggalMulai,
            tanggalSelesai,
          }),
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
      title={isEdit ? "Edit Kategori Lomba Antar Blok" : "Tambah Kategori Lomba Antar Blok"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Icon <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Contoh: ⚽"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xl focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Lomba <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Voli Ibu-Ibu"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Tanggal Perlombaan
            </label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Tanggal Terakhir Perlombaan
            </label>
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
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
                : "Simpan Kategori Baru"}
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
