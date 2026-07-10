"use client";

import { useState } from "react";
import Modal from "./Modal";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  Category,
  Competition,
} from "@/lib/types";

export default function TambahLombaModal({
  onClose,
  onSuccess,
  lomba,
}: {
  onClose: () => void;
  onSuccess: () => void;
  lomba?: Competition;
}) {
  const isEdit = Boolean(lomba);
  const [nama, setNama] = useState(lomba?.name ?? "");
  const [kategori, setKategori] = useState<Category>(
    lomba?.category ?? "PAUD-TK"
  );
  const [deskripsi, setDeskripsi] = useState(lomba?.description ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/competitions/${lomba!.id}` : "/api/competitions",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nama,
            category: kategori,
            description: deskripsi,
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
      title={isEdit ? "Edit Jenis Lomba" : "Tambah Jenis Lomba"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Perlombaan <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Lomba Balap Karung"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Kategori Umur/Peserta <span className="text-primary">*</span>
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value as Category)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          >
            {ALL_CATEGORIES.map((k) => (
              <option key={k} value={k}>
                {CATEGORY_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Deskripsi Aturan Lomba
          </label>
          <textarea
            rows={4}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Panduan atau teknis singkat jalannya lomba..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
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
                : "Simpan Lomba Baru"}
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
