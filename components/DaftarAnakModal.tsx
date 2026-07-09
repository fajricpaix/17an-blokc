"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function DaftarAnakModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [blok, setBlok] = useState("");
  const [nomorRumah, setNomorRumah] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nama,
          age: Number(umur),
          block: blok,
          houseNumber: nomorRumah,
        }),
      });
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
    <Modal title="Daftarkan Peserta Anak" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Anak <span className="text-merah">*</span>
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Umur Anak (4 - 12 tahun) <span className="text-merah">*</span>
          </label>
          <input
            type="number"
            required
            min={4}
            max={12}
            value={umur}
            onChange={(e) => setUmur(e.target.value)}
            placeholder="Contoh: 8"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Blok Rumah (C1 - C11) <span className="text-merah">*</span>
            </label>
            <input
              type="text"
              required
              value={blok}
              onChange={(e) => setBlok(e.target.value)}
              placeholder="Contoh: C5"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Nomor Rumah <span className="text-merah">*</span>
            </label>
            <input
              type="text"
              required
              value={nomorRumah}
              onChange={(e) => setNomorRumah(e.target.value)}
              placeholder="Contoh: 15"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="text-sm font-medium text-merah">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-merah px-4 py-2 font-bold text-white hover:bg-merah-tua disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Daftarkan Anak"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
        </div>
      </form>
    </Modal>
  );
}
