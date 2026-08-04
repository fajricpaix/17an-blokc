import { KeuanganEntry } from "@/lib/types";
import { formatRupiah, formatTanggal } from "@/lib/format";

export default function DonasiTable({
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
  const totalDonasi = entries.reduce((sum, e) => sum + e.jumlah, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
      <table className="w-full min-w-120 text-left text-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Alamat Rumah</th>
            <th className="px-4 py-3">Jumlah Donasi</th>
            <th className="px-4 py-3 print:hidden">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-gray-400 italic"
              >
                Belum ada donasi tercatat.
              </td>
            </tr>
          ) : (
            entries.map((e, i) => (
              <tr
                key={e.id}
                className={`transition-colors duration-200 hover:bg-red-50 ${
                  i % 2 ? "bg-red-50/40" : "bg-white"
                }`}
              >
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-semibold">
                  {e.alamatRumah ?? e.keterangan}
                </td>
                <td className="px-4 py-3 font-bold whitespace-nowrap text-green-700">
                  {formatRupiah(e.jumlah)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap print:hidden">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(e)}
                      disabled={busyId === e.id}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-60"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onHapus(e)}
                      disabled={busyId === e.id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                    >
                      {busyId === e.id ? "..." : "🗑️"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
        {entries.length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-red-100 bg-red-50/60 font-bold">
              <td className="px-4 py-3" colSpan={2}>
                Total Donasi
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-green-700">
                {formatRupiah(totalDonasi)}
              </td>
              <td className="print:hidden" />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
