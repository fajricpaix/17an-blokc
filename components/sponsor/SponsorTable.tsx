import { Sponsor } from "@/lib/types";

export default function SponsorTable({
  sponsors,
  busyId,
  onToggleActive,
  onHapus,
}: {
  sponsors: Sponsor[];
  busyId: string | null;
  onToggleActive: (s: Sponsor, active: boolean) => void;
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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
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
                      type="button"
                      onClick={() => onToggleActive(s, s.active === false)}
                      disabled={busyId === s.id}
                      aria-label={
                        s.active !== false
                          ? "Nonaktifkan sponsor"
                          : "Aktifkan sponsor"
                      }
                      className={`relative h-7 w-16 shrink-0 rounded-full transition-colors duration-300 disabled:opacity-60 ${
                        s.active !== false ? "bg-green-500" : "bg-primary"
                      }`}
                    >
                      <span
                        className={`absolute inset-0 flex items-center text-[10px] font-bold text-white ${
                          s.active !== false
                            ? "justify-start pl-2.5"
                            : "justify-end pr-2.5"
                        }`}
                      >
                        {s.active !== false ? "ON" : "OFF"}
                      </span>
                      <span
                        className={`absolute top-0.5 size-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                          s.active !== false ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </td>
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
