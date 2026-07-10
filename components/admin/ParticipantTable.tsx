import { Participant, CATEGORY_LABELS } from "@/lib/types";
import { Tab } from "./CategoryTabs";

export default function ParticipantTable({
  tab,
  pesertaTampil,
  busyId,
  onDownload,
  onPrint,
  onHapus,
}: {
  tab: Tab;
  pesertaTampil: Participant[];
  busyId: string | null;
  onDownload: () => void;
  onPrint: () => void;
  onHapus: (p: Participant) => void;
}) {
  return (
    <section>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-primary">
          📝 Tabel Data Peserta
          {tab !== "Semua" ? ` — ${CATEGORY_LABELS[tab]}` : ""}
        </h2>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={onDownload}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50"
          >
            ⬇️ Download
          </button>
          <button
            onClick={onPrint}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary"
          >
            🖨️ Cetak / PDF
          </button>
        </div>
      </div>
      <p className="mb-4 text-gray-600 print:hidden">
        Total <strong>{pesertaTampil.length}</strong> peserta
        {tab !== "Semua" ? " di kategori ini" : " terdaftar"}. Gunakan tombol
        hapus untuk membersihkan data ganda, kesalahan input umur, atau
        pembatalan sebelum nomor dada dicetak.
      </p>
      <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
        <table className="w-full min-w-160 text-left text-sm print:border-collapse">
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
              <th className="px-4 py-3 print:border print:border-gray-400">
                Kategori
              </th>
              <th className="px-4 py-3 print:hidden">Aksi</th>
              <th className="hidden px-4 py-3 print:table-cell print:border print:border-gray-400">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody>
            {pesertaTampil.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400 italic"
                >
                  Belum ada peserta terdaftar.
                </td>
              </tr>
            ) : (
              pesertaTampil.map((p, i) => (
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
                  <td className="px-4 py-3 print:border print:border-gray-400">
                    {CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="px-4 py-3 print:hidden">
                    <button
                      onClick={() => onHapus(p)}
                      disabled={busyId === p.id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dark-primary disabled:opacity-60"
                    >
                      {busyId === p.id ? "Menghapus..." : "🗑️ Hapus"}
                    </button>
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
    </section>
  );
}
