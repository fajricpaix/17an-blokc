"use client";

import { useRef, useState } from "react";
import { Rundown } from "@/lib/types";

function formatJam(waktu: string) {
  return waktu.replace(":", ".");
}

export default function RundownTable({ rundowns }: { rundowns: Rundown[] }) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function jadikanGambar() {
    if (!tableRef.current) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "rundown-acara-blok-c.png";
      a.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="my-4 print:hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="mb-1 text-xl font-extrabold text-primary">
            📋 Rundown Acara
          </h2>
          <p className="text-gray-600">
            Total <strong>{rundowns.length}</strong> sesi rundown terdaftar.
          </p>
        </div>
        <button
          onClick={jadikanGambar}
          disabled={exporting || rundowns.length === 0}
          className="rounded-full text-xs sm:text-sm border border-red-200 bg-white px-4 py-2 font-bold text-dark-primary shadow-sm transition-colors duration-200 hover:bg-red-50 disabled:opacity-60"
        >
          {exporting ? "Membuat gambar..." : "🖼️ Jadikan Gambar"}
        </button>
      </div>
      <div
        ref={tableRef}
        className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm"
      >
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">Jam</th>
              <th className="px-4 py-3">Kegiatan</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {rundowns.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-400 italic"
                >
                  Belum ada rundown acara.
                </td>
              </tr>
            ) : (
              rundowns.map((r, i) => (
                <tr
                  key={r.id}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 font-bold whitespace-nowrap text-dark-primary">
                    {formatJam(r.startTime)} - {formatJam(r.endTime)}
                  </td>
                  <td className="px-4 py-3 font-semibold">{r.title}</td>
                  <td className="max-w-xs px-4 py-3 text-gray-600">
                    {r.description || "-"}
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
