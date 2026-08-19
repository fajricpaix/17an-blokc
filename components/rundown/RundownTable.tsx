"use client";

import { useEffect, useRef, useState } from "react";
import { Rundown, Sponsor } from "@/lib/types";

function formatJam(waktu: string) {
  return waktu.replace(":", ".");
}

export default function RundownTable({
  rundowns,
  tahun,
  busyId,
  onEdit,
  onHapus,
}: {
  rundowns: Rundown[];
  tahun: string;
  busyId: string | null;
  onEdit: (r: Rundown) => void;
  onHapus: (r: Rundown) => void;
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [previewGambar, setPreviewGambar] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Sponsor[]) =>
        setSponsors(list.filter((s) => s.active !== false))
      )
      .catch(() => {
        // biarkan tanpa sponsor kalau gagal dimuat
      });
  }, []);

  function tungguFrame() {
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
  }

  function tungguGambarSponsor(el: HTMLElement) {
    const imgs = Array.from(el.querySelectorAll("img"));
    return Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
      )
    );
  }

  async function jadikanGambar() {
    if (!tableRef.current) return;
    setExporting(true);
    // Tampilkan header & sponsor di DOM asli sebentar supaya ukurannya
    // ikut terhitung sebelum di-capture, baru disembunyikan lagi.
    setPreviewGambar(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const el = tableRef.current;
      await tungguFrame();
      await tungguGambarSponsor(el);
      const contentCanvas = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        onclone: (_doc, clonedEl) => {
          clonedEl.style.overflow = "visible";
        },
      });

      // Susun ulang jadi kanvas persegi (1:1) dengan konten di tengah.
      const sisi = Math.max(contentCanvas.width, contentCanvas.height);
      const squareCanvas = document.createElement("canvas");
      squareCanvas.width = sisi;
      squareCanvas.height = sisi;
      const ctx = squareCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sisi, sisi);
        ctx.drawImage(
          contentCanvas,
          (sisi - contentCanvas.width) / 2,
          (sisi - contentCanvas.height) / 2
        );
      }

      const a = document.createElement("a");
      a.href = (ctx ? squareCanvas : contentCanvas).toDataURL("image/png");
      a.download = "rundown-acara-blok-c.png";
      a.click();
    } finally {
      setPreviewGambar(false);
      setExporting(false);
    }
  }

  return (
    <section className="my-4 print:hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="mb-1 text-xl font-extrabold text-primary">
            📋 Rundown Acara {tahun}
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
        <div
          data-image-only
          className={`bg-white px-4 pt-6 pb-4 text-center ${
            previewGambar ? "" : "hidden"
          }`}
        >
          <h1 className="text-2xl font-extrabold text-dark-primary">
            🇮🇩 Rundown Acara 17an Pelican Blok C
          </h1>
        </div>
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">Jam</th>
              <th className="px-4 py-3">Kegiatan</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th
                className="px-4 py-3 print:hidden"
                data-html2canvas-ignore="true"
              >
                Aksi
              </th>
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
                  <td
                    className="px-4 py-3 whitespace-nowrap print:hidden"
                    data-html2canvas-ignore="true"
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(r)}
                        disabled={busyId === r.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onHapus(r)}
                        disabled={busyId === r.id}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                      >
                        {busyId === r.id ? "..." : "🗑️ Hapus"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {sponsors.length > 0 && (
          <div
            data-image-only
            className={`border-t border-red-100 bg-white px-4 py-5 text-center ${
              previewGambar ? "" : "hidden"
            }`}
          >
            <p className="mb-3 text-xs font-bold tracking-wide text-dark-primary uppercase">
              Didukung oleh
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {sponsors.map((s) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s.id}
                  src={s.logoUrl}
                  alt={s.name}
                  title={s.name}
                  className="h-auto w-20 rounded-lg border border-red-100 bg-white object-contain shadow-sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
