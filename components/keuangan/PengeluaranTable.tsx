"use client";

import { Fragment, useRef, useState } from "react";
import { KATEGORI_PENGELUARAN, KeuanganEntry, WAKTU_KONSUMSI } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

function BarisPengeluaran({
  entry,
  no,
  zebra,
  busyId,
  onEdit,
  onHapus,
}: {
  entry: KeuanganEntry;
  no: number;
  zebra: boolean;
  busyId: string | null;
  onEdit: (e: KeuanganEntry) => void;
  onHapus: (e: KeuanganEntry) => void;
}) {
  return (
    <tr
      className={`transition-colors duration-200 hover:bg-red-50 ${
        zebra ? "bg-red-50/40" : "bg-white"
      }`}
    >
      <td className="px-4 py-3">{no}.</td>
      <td className="px-4 py-3 font-semibold capitalize">{entry.keterangan}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        {entry.jumlahSatuan?.toLocaleString("id-ID") ?? "-"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {entry.hargaSatuan ? formatRupiah(entry.hargaSatuan) : "-"}
      </td>
      <td className="px-4 py-3 font-bold whitespace-nowrap text-primary">
        {formatRupiah(entry.jumlah)}
      </td>
      <td
        className="px-4 py-3 whitespace-nowrap print:hidden"
        data-html2canvas-ignore="true"
      >
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(entry)}
            disabled={busyId === entry.id}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-60"
          >
            ✏️
          </button>
          <button
            onClick={() => onHapus(entry)}
            disabled={busyId === entry.id}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
          >
            {busyId === entry.id ? "..." : "🗑️"}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PengeluaranTable({
  entries,
  busyId,
  onEdit,
  onHapus,
}: {
  entries: KeuanganEntry[];
  busyId: string | null;
  onEdit: (e: KeuanganEntry) => void;
  onHapus: (e: KeuanganEntry) => void;
}) {
  const totalPengeluaran = entries.reduce((sum, e) => sum + e.jumlah, 0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function downloadPDF() {
    if (!tableRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const el = tableRef.current;
      const canvas = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        onclone: (_doc, clonedEl) => {
          clonedEl.style.overflow = "visible";
        },
      });
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );
      pdf.save("pengeluaran-acara-blok-c.pdf");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-gray-600">
          Total <strong>{entries.length}</strong> transaksi pengeluaran
          tercatat.
        </p>
      </div>
      <div ref={tableRef} className="space-y-6">
        {KATEGORI_PENGELUARAN.map((kategori) => {
          const list = entries.filter(
            (e) => e.kategoriPengeluaran === kategori
          );
          const subtotal = list.reduce((sum, e) => sum + e.jumlah, 0);
          const listBernomor = list.map((entry, i) => ({ entry, no: i + 1 }));
          const isKonsumsi = kategori === "Konsumsi 17an";

          return (
            <div key={kategori}>
              <h3 className="mb-2 text-sm font-extrabold text-dark-primary">
                {kategori}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm print:overflow-visible">
                <table className="w-full min-w-120 text-left text-sm print:min-w-0">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3">Satuan</th>
                      <th className="px-4 py-3">Harga Satuan</th>
                      <th className="px-4 py-3">Biaya</th>
                      <th
                        className="px-4 py-3 print:hidden"
                        data-html2canvas-ignore="true"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-gray-400 italic"
                        >
                          Belum ada pengeluaran di kategori ini.
                        </td>
                      </tr>
                    ) : isKonsumsi ? (
                      WAKTU_KONSUMSI.map((waktu) => {
                        const grup = listBernomor.filter(
                          ({ entry }) => entry.waktuKonsumsi === waktu
                        );
                        if (grup.length === 0) return null;
                        return (
                          <Fragment key={waktu}>
                            <tr className="bg-gray-100">
                              <td
                                colSpan={6}
                                className="px-4 py-2 text-xs font-extrabold text-dark-primary"
                              >
                                {waktu}
                              </td>
                            </tr>
                            {grup.map(({ entry, no }, i) => (
                              <BarisPengeluaran
                                key={entry.id}
                                entry={entry}
                                no={no}
                                zebra={i % 2 === 1}
                                busyId={busyId}
                                onEdit={onEdit}
                                onHapus={onHapus}
                              />
                            ))}
                          </Fragment>
                        );
                      })
                    ) : (
                      listBernomor.map(({ entry, no }, i) => (
                        <BarisPengeluaran
                          key={entry.id}
                          entry={entry}
                          no={no}
                          zebra={i % 2 === 1}
                          busyId={busyId}
                          onEdit={onEdit}
                          onHapus={onHapus}
                        />
                      ))
                    )}
                  </tbody>
                  {list.length > 0 && (
                    <tfoot>
                      <tr className="border-t-2 border-red-100 bg-red-50/60 font-bold">
                        <td className="px-4 py-3" colSpan={4}>
                          Subtotal {kategori}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-primary">
                          {formatRupiah(subtotal)}
                        </td>
                        <td className="print:hidden" />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-extrabold text-primary">
          <span>Total Pengeluaran</span>
          <span>{formatRupiah(totalPengeluaran)}</span>
        </div>
      </div>
    </div>
  );
}
