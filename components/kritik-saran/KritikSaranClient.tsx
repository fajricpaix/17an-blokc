"use client";

import { useState } from "react";
import { KritikSaran } from "@/lib/types";

function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function KritikSaranClient({
  initialKritikSaran,
}: {
  initialKritikSaran: KritikSaran[];
}) {
  const [items, setItems] = useState(initialKritikSaran);
  const [notif, setNotif] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function tampilkanNotif(pesan: string) {
    setNotif(pesan);
    setTimeout(() => setNotif(""), 4000);
  }

  async function toggleDibaca(item: KritikSaran) {
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/kritik-saran/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dibaca: !item.dibaca }),
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal mengubah status."}`);
        return;
      }
      setItems((prev) =>
        prev.map((x) =>
          x.id === item.id ? { ...x, dibaca: !item.dibaca } : x
        )
      );
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapus(item: KritikSaran) {
    if (!confirm("Hapus kritik & saran ini?")) return;
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/kritik-saran/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus."}`);
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      tampilkanNotif("🗑️ Kritik & saran berhasil dihapus.");
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-red-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-dark-primary shadow-2xl shadow-red-900/10 backdrop-blur print:hidden">
          {notif}
        </div>
      )}

      <h2 className="mb-4 mt-6 text-xl font-extrabold text-dark-primary">
        📝 Kritik & Saran ({items.length})
      </h2>

      {items.length === 0 ? (
        <p className="rounded-xl border border-red-100 bg-white p-8 text-center text-gray-400 italic shadow-sm">
          Belum ada kritik & saran masuk.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 shadow-sm transition-colors ${
                item.dibaca
                  ? "border-gray-200 bg-white"
                  : "border-red-200 bg-red-50/40"
              }`}
            >
              <p className="whitespace-pre-wrap text-gray-800">
                {item.pesan}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatWaktu(item.createdAt)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${
                      item.dibaca
                        ? "bg-gray-100 text-gray-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {item.dibaca ? "Sudah dibaca" : "Belum dibaca"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDibaca(item)}
                    disabled={busyId === item.id}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-60"
                  >
                    {item.dibaca ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </button>
                  <button
                    onClick={() => hapus(item)}
                    disabled={busyId === item.id}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                  >
                    {busyId === item.id ? "..." : "🗑️"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
