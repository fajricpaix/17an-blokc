"use client";

import { useRef, useState } from "react";
import Modal from "@/components/Modal";
import { Competition, Participant, CATEGORY_LABELS } from "@/lib/types";

export default function PesertaLombaModal({
  lomba,
  pesertas,
  onClose,
}: {
  lomba: Competition;
  pesertas: Participant[];
  onClose: () => void;
}) {
  const pesertaLomba = pesertas.filter((p) => p.category === lomba.category);
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
      pdf.save(`peserta-${lomba.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  function cetakPDF() {
    window.print();
  }

  return (
    <Modal title={`📝 Peserta — ${lomba.name}`} onClose={onClose} size="lg">
      <h2 className="mb-1 hidden text-xl font-extrabold text-primary print:block">
        📝 Peserta {lomba.name}
      </h2>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-gray-600">
          Total <strong>{pesertaLomba.length}</strong> peserta di kategori{" "}
          {CATEGORY_LABELS[lomba.category]}.
        </p>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={downloadPDF}
            disabled={exporting}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            {exporting ? "Membuat PDF..." : "⬇️ Download PDF"}
          </button>
          <button
            onClick={cetakPDF}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary"
          >
            🖨️ Cetak / PDF
          </button>
        </div>
      </div>
      <div
        ref={tableRef}
        className="mt-4 overflow-x-auto rounded-xl border border-red-100"
      >
        <table className="w-full min-w-120 text-left text-sm print:border-collapse">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 print:border print:border-gray-400">
                No
              </th>
              <th className="px-4 py-3 print:border print:border-gray-400">
                Nama
              </th>
              <th className="px-4 py-3 print:border print:border-gray-400">
                Umur
              </th>
              <th className="px-4 py-3 print:border print:border-gray-400">
                Alamat
              </th>
              <th className="hidden px-4 py-3 print:table-cell print:border print:border-gray-400">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody>
            {pesertaLomba.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-400 italic"
                >
                  Belum ada peserta di kategori ini.
                </td>
              </tr>
            ) : (
              pesertaLomba.map((p, i) => (
                <tr
                  key={p.id}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500 print:border print:border-gray-400">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold print:border print:border-gray-400">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 print:border print:border-gray-400">
                    {p.age} th
                  </td>
                  <td className="px-4 py-3 print:border print:border-gray-400">
                    {p.block} No. {p.houseNumber}
                  </td>
                  <td className="hidden px-4 py-3 print:table-cell print:border print:border-gray-400">
                    &nbsp;
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
