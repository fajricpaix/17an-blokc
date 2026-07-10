"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function TambahRundownModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/rundowns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, title, description }),
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
    <Modal title="Tambah Rundown Acara" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold">
              Jam Mulai <span className="text-merah">*</span>
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold">
              Jam Selesai <span className="text-merah">*</span>
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Rundown <span className="text-merah">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Senam Bersama"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Deskripsi Rundown
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail singkat kegiatan..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-merah focus:outline-none"
          />
        </div>
        {error && <p className="text-sm font-medium text-merah">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-merah px-4 py-2 font-bold text-white hover:bg-merah-tua disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Rundown Baru"}
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
