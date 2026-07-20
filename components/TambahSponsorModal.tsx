"use client";

import { useState } from "react";
import Modal from "./Modal";

const MAX_LOGO_SIZE = 200 * 1024; // 200 KB

export default function TambahSponsorModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nama, setNama] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError("");
    if (!file) {
      setLogo(null);
      setPreview("");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setError(
        `Ukuran logo ${(file.size / 1024).toFixed(0)} KB, maksimal 200 KB.`
      );
      e.target.value = "";
      setLogo(null);
      setPreview("");
      return;
    }
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!logo) {
      setError("Logo sponsor wajib diunggah.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", nama);
      formData.append("logo", logo);
      const res = await fetch("/api/sponsors", {
        method: "POST",
        body: formData,
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
    <Modal title="Tambah Sponsor" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Sponsor <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Bank Serpong"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Logo Sponsor <span className="text-primary">*</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Format PNG/JPG/WEBP/GIF, ukuran maksimal 200 KB.
          </p>
          <div className="flex items-center gap-3">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview logo"
                className="size-14 shrink-0 rounded-lg border border-gray-200 object-contain"
              />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleLogoChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
            {loading ? "Menyimpan..." : "Simpan Sponsor"}
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
