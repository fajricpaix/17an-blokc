"use client";

import { useState } from "react";
import Modal from "./Modal";
import {
  KATEGORI_ANTAR_BLOK_BUTUH_KELAS,
  KategoriAntarBlok,
  Perwakilan,
} from "@/lib/types";

export default function EditPerwakilanModal({
  perwakilan,
  kategoriList,
  onClose,
  onSuccess,
}: {
  perwakilan: Perwakilan;
  kategoriList: KategoriAntarBlok[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [categories, setCategories] = useState<string[]>(
    perwakilan.categories
  );
  const [kelas, setKelas] = useState(perwakilan.kelas ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const butuhKelas = categories.includes(KATEGORI_ANTAR_BLOK_BUTUH_KELAS);

  function toggleKategori(nama: string) {
    setCategories((prev) =>
      prev.includes(nama) ? prev.filter((c) => c !== nama) : [...prev, nama]
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (categories.length === 0) {
      setError("Pilih minimal satu cabor.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/perwakilan/${perwakilan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories,
          ...(butuhKelas ? { kelas } : {}),
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
    <Modal title={`Atur Cabor — ${perwakilan.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Cabor Diikuti <span className="text-primary">*</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Centang semua cabor yang diikuti peserta ini.
          </p>
          <div className="space-y-1.5">
            {kategoriList.map((k) => {
              const dicentang = categories.includes(k.name);
              const kunciAktif = Boolean(k.locked) && !dicentang;
              return (
                <label
                  key={k.id}
                  className={`flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 transition-colors ${
                    kunciAktif
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-red-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dicentang}
                    disabled={kunciAktif}
                    onChange={() => toggleKategori(k.name)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-lg">{k.icon}</span>
                  <span className="text-sm font-semibold">{k.name}</span>
                  {k.locked && (
                    <span className="ml-auto text-xs font-bold text-gray-400">
                      🔒 Terkunci
                    </span>
                  )}
                </label>
              );
            })}
          </div>
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
        {error && <p className="text-sm font-medium text-primary">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-dark-primary disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
