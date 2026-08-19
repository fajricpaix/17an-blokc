"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function KritikSaranModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/kritik-saran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesan }),
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
    <Modal title="Kritik & Saran" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Isi Kritik & Saran <span className="text-primary">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Sampaikan kritik atau saran Anda untuk acara ini..."
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Pesan dikirim tanpa nama (anonim) dan hanya bisa dilihat panitia.
          </p>
        </div>
        {error && <p className="text-sm font-medium text-primary">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-dark-primary disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim"}
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
