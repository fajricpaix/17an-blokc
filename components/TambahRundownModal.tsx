"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Rundown } from "@/lib/types";

export default function TambahRundownModal({
  onClose,
  onSuccess,
  rundown,
}: {
  onClose: () => void;
  onSuccess: () => void;
  rundown?: Rundown;
}) {
  const isEdit = Boolean(rundown);
  const [startTime, setStartTime] = useState(rundown?.startTime ?? "");
  const [endTime, setEndTime] = useState(rundown?.endTime ?? "");
  const [title, setTitle] = useState(rundown?.title ?? "");
  const [description, setDescription] = useState(rundown?.description ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/rundowns/${rundown!.id}` : "/api/rundowns",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startTime, endTime, title, description }),
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
      title={isEdit ? "Edit Rundown Acara" : "Tambah Rundown Acara"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold">
              Jam Mulai <span className="text-primary">*</span>
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-semibold">
              Jam Selesai <span className="text-primary">*</span>
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Nama Rundown <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Senam Bersama"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
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
                : "Simpan Rundown Baru"}
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
