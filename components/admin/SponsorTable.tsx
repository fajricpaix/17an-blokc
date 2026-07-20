import { Sponsor } from "@/lib/types";

export default function SponsorTable({
  sponsors,
  busyId,
  onHapus,
}: {
  sponsors: Sponsor[];
  busyId: string | null;
  onHapus: (s: Sponsor) => void;
}) {
  return (
    <section className="mb-8 print:hidden">
      <h2 className="mb-1 text-xl font-extrabold text-primary">
        🤝 Sponsor
      </h2>
      <p className="mb-4 text-gray-600">
        Total <strong>{sponsors.length}</strong> sponsor terdaftar.
      </p>
      <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
        <table className="w-full min-w-120 text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3">Nama Sponsor</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-gray-400 italic"
                >
                  Belum ada sponsor.
                </td>
              </tr>
            ) : (
              sponsors.map((s, i) => (
                <tr
                  key={s.id}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="size-12 rounded-lg border border-gray-200 object-contain"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => onHapus(s)}
                      disabled={busyId === s.id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                    >
                      {busyId === s.id ? "..." : "🗑️ Hapus"}
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
