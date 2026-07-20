"use client";

import { useState } from "react";
import Modal from "./Modal";
import { KATEGORI_ANTAR_BLOK_BUTUH_KELAS, KategoriAntarBlok } from "@/lib/types";

export default function DaftarPerwakilanModal({
  kategoriList,
  onClose,
  onSuccess,
  kategoriAwal,
}: {
  kategoriList: KategoriAntarBlok[];
  onClose: () => void;
  onSuccess: () => void;
  kategoriAwal?: KategoriAntarBlok;
}) {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [blok, setBlok] = useState("");
  const [nomorRumah, setNomorRumah] = useState("");
  const [kategori, setKategori] = useState<string>(
    (kategoriAwal ?? kategoriList.find((k) => !k.locked) ?? kategoriList[0])
      ?.name ?? ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const butuhKelas = kategori === KATEGORI_ANTAR_BLOK_BUTUH_KELAS;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/perwakilan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nama,
          ...(butuhKelas ? { kelas } : {}),
          block: blok,
          houseNumber: nomorRumah,
          category: kategori,
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
    <Modal title="Daftar Perwakilan Blok C" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Jenis Lomba <span className="text-primary">*</span>
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          >
            {kategoriList.map((k) => (
              <option key={k.id} value={k.name} disabled={k.locked}>
                {k.icon} {k.name}
                {k.locked ? " (Ditutup)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Peserta <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        {butuhKelas && (
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Kelas Peserta <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              placeholder="Contoh: Kelas 5 SD"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Blok Rumah <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={blok}
              onChange={(e) => setBlok(e.target.value)}
              placeholder="Contoh: C5 atau C Danau"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Nomor Rumah <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={nomorRumah}
              onChange={(e) => setNomorRumah(e.target.value)}
              placeholder="Contoh: 15"
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
            {loading ? "Mengirim..." : "Daftar Sebagai Perwakilan"}
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
