import { Competition, Participant, CATEGORY_LABELS } from "@/lib/types";
import { Tab } from "./CategoryTabs";

export default function LombaTable({
  tab,
  lombaTampil,
  pesertas,
  busyId,
  onLihatPeserta,
  onEdit,
  onHapus,
}: {
  tab: Tab;
  lombaTampil: Competition[];
  pesertas: Participant[];
  busyId: string | null;
  onLihatPeserta: (l: Competition) => void;
  onEdit: (l: Competition) => void;
  onHapus: (l: Competition) => void;
}) {
  const jumlahPeserta = (l: Competition) =>
    pesertas.filter((p) => p.category === l.category).length;

  return (
    <section className="mb-8 print:hidden">
      <h2 className="mb-1 text-xl font-extrabold text-primary">
        🏆 Daftar Lomba :{tab !== "Semua" ? ` ${CATEGORY_LABELS[tab]}` : ""}
      </h2>
      <p className="mb-4 text-gray-600">
        Total <strong>{lombaTampil.length}</strong> lomba
        {tab !== "Semua" ? " di kategori ini" : " terdaftar"}.
      </p>
      <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Nama Lomba</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Jumlah Peserta</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {lombaTampil.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400 italic"
                >
                  Belum ada lomba di kategori ini.
                </td>
              </tr>
            ) : (
              lombaTampil.map((l, i) => (
                <tr
                  key={l.id}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">{l.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {CATEGORY_LABELS[l.category]}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onLihatPeserta(l)}
                      className="font-semibold text-dark-primary underline decoration-red-200 underline-offset-2 transition-colors hover:text-primary"
                    >
                      {jumlahPeserta(l)} orang
                    </button>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-gray-600">
                    {l.description || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(l)}
                        disabled={busyId === l.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onHapus(l)}
                        disabled={busyId === l.id}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                      >
                        {busyId === l.id ? "..." : "🗑️ Hapus"}
                      </button>
                    </div>
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
