import { Rundown } from "@/lib/types";

function formatJam(waktu: string) {
  return waktu.replace(":", ".");
}

export default function RundownTable({
  rundowns,
  busyId,
  onHapus,
}: {
  rundowns: Rundown[];
  busyId: string | null;
  onHapus: (r: Rundown) => void;
}) {
  return (
    <section className="my-4 print:hidden">
      <h2 className="mb-1 text-xl font-extrabold text-primary">
        📋 Rundown Acara
      </h2>
      <p className="mb-4 text-gray-600">
        Total <strong>{rundowns.length}</strong> sesi rundown terdaftar.
      </p>
      <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">Jam</th>
              <th className="px-4 py-3">Kegiatan</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Aksi</th>
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => onHapus(r)}
                      disabled={busyId === r.id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                    >
                      {busyId === r.id ? "..." : "🗑️ Hapus"}
                    </button>
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
