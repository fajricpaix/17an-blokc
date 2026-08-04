"use client";

import { useState } from "react";
import { JenisKeuangan, KeuanganEntry } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import DonasiTable from "./DonasiTable";
import PengeluaranTable from "./PengeluaranTable";

export default function KeuanganTable({
  entries,
  busyId,
  onTambah,
  onEdit,
  onHapus,
}: {
  entries: KeuanganEntry[];
  busyId: string | null;
  onTambah: (jenis: JenisKeuangan) => void;
  onEdit: (e: KeuanganEntry) => void;
  onHapus: (e: KeuanganEntry) => void;
}) {
  const [subTab, setSubTab] = useState<JenisKeuangan>("Donasi");

  const donasi = entries.filter((e) => e.jenis === "Donasi");
  const pengeluaran = entries.filter((e) => e.jenis === "Pengeluaran");
  const totalDonasi = donasi.reduce((sum, e) => sum + e.jumlah, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, e) => sum + e.jumlah, 0);
  const saldo = totalDonasi - totalPengeluaran;

  return (
    <section className="mb-8">
      <div className="my-4 print:hidden">
        <h2 className="mb-1 text-xl font-extrabold text-primary">
          💰 Laporan Keuangan Acara
        </h2>
        <p className="text-gray-600">
          Total <strong>{entries.length}</strong> transaksi tercatat.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-semibold text-green-700">
            Total Donasi
          </p>
          <p className="mt-1 text-lg font-extrabold text-green-700">
            {formatRupiah(totalDonasi)}
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold text-primary">
            Total Pengeluaran
          </p>
          <p className="mt-1 text-lg font-extrabold text-primary">
            {formatRupiah(totalPengeluaran)}
          </p>
        </div>
        <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-dark-primary">Saldo</p>
          <p
            className={`mt-1 text-lg font-extrabold ${
              saldo < 0 ? "text-primary" : "text-dark-primary"
            }`}
          >
            {formatRupiah(saldo)}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="w-full sm:w-auto flex gap-2 rounded-full border border-red-100 bg-white p-1.5 shadow-sm">
          {(["Donasi", "Pengeluaran"] as JenisKeuangan[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSubTab(t)}
              className={`w-full sm:w-auto rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                subTab === t
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark-primary hover:bg-red-50"
              }`}
            >
              {t === "Donasi" ? "🎁 Donasi" : "🧾 Pengeluaran"}
            </button>
          ))}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-dark-primary shadow-sm transition-colors hover:bg-red-50"
          >
            🖨️ Cetak
          </button>
          <button
            type="button"
            onClick={() => onTambah(subTab)}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-dark-primary sm:flex-none"
          >
            + Tambah {subTab === "Donasi" ? "Donasi" : "Pengeluaran"}
          </button>
        </div>
      </div>

      {subTab === "Donasi" ? (
        <DonasiTable
          entries={donasi}
          busyId={busyId}
          onEdit={onEdit}
          onHapus={onHapus}
        />
      ) : (
        <PengeluaranTable
          entries={pengeluaran}
          busyId={busyId}
          onEdit={onEdit}
          onHapus={onHapus}
        />
      )}
    </section>
  );
}
