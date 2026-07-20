"use client";

import Modal from "./Modal";
import { KategoriAntarBlok, Perwakilan } from "@/lib/types";

export default function PesertaKategoriModal({
  kategori,
  perwakilans,
  busyId,
  onEdit,
  onHapus,
  onClose,
}: {
  kategori: KategoriAntarBlok;
  perwakilans: Perwakilan[];
  busyId: string | null;
  onEdit: (p: Perwakilan) => void;
  onHapus: (p: Perwakilan) => void;
  onClose: () => void;
}) {
  const peserta = perwakilans.filter((p) =>
    p.categories.includes(kategori.name)
  );

  return (
    <Modal
      title={`${kategori.icon} Peserta — ${kategori.name}`}
      onClose={onClose}
      size="lg"
    >
      <p className="mb-4 text-sm text-gray-600">
        Total <strong>{peserta.length}</strong> peserta terdaftar di cabor
        ini. Klik Edit untuk mengatur cabor yang diikuti — satu peserta bisa
        ikut lebih dari satu cabor.
      </p>
      {peserta.length === 0 ? (
        <p className="rounded-xl border border-dashed border-red-200 bg-white px-4 py-8 text-center text-sm text-gray-400 italic">
          Belum ada peserta di cabor ini.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-red-100">
          <table className="w-full min-w-140 text-left text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {peserta.map((p, i) => (
                <tr
                  key={p.id}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">
                    {p.name}
                    {p.kelas && (
                      <span className="ml-1 font-normal text-gray-500">
                        ({p.kelas})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.block} No. {p.houseNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        disabled={busyId === p.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onHapus(p)}
                        disabled={busyId === p.id}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                      >
                        {busyId === p.id ? "..." : "🗑️ Hapus"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
