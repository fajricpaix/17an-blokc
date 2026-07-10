import { Competition, Participant, Category, CATEGORY_LABELS } from "@/lib/types";
import CountUp from "@/components/CountUp";

const EMOJI_KATEGORI: Record<Category, string> = {
  "PAUD-TK": "🧸",
  "SD Kecil": "🎒",
  "SD Besar": "📚",
  Bapak: "👨",
  Ibu: "👩",
  Pasangan: "👩🏻‍❤️‍👨🏻",
};

export default function KategoriCard({
  kategori,
  lombas,
  pesertas,
}: {
  kategori: Category;
  lombas: Competition[];
  pesertas?: Participant[];
}) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5">
      <h4 className="mb-3 flex items-center gap-2 border-b border-red-100 pb-2.5 font-bold text-dark-primary capitalize">
        <span className="inline-block text-xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
          {EMOJI_KATEGORI[kategori]}
        </span>
        {CATEGORY_LABELS[kategori]}
      </h4>
      {lombas.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum Ada Lomba.</p>
      ) : (
        <ul className="space-y-3.5 text-sm">
          {lombas.map((l) => (
            <li key={l.id}>
              <p className="font-semibold capitalize">🚩 {l.name}</p>
              {l.description && (
                <p className="mt-0.5 leading-relaxed text-gray-600">
                  {l.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Daftar peserta di bagian paling bawah card */}
      {pesertas && (
        <div className="mt-auto pt-4">
          <div className="border-t border-red-100 pt-3">
            <h5 className="mb-2 flex items-center justify-between gap-2 text-sm font-bold text-dark-primary">
              <span>📝 Peserta Terdaftar</span>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-primary">
                <CountUp value={pesertas.length} />
              </span>
            </h5>
            {pesertas.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Belum ada pendaftar. Jadilah yang pertama! 🚀
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
                {pesertas.map((p, i) => (
                  <div
                    key={p.id}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="animate-pop-in group/peserta flex min-w-0 flex-col items-center gap-1 rounded-xl border border-red-100 bg-white px-2 py-2.5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md hover:shadow-red-900/10"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-dark-primary via-primary to-rose-600 text-xs font-extrabold text-white shadow-sm transition-transform duration-300 group-hover/peserta:scale-110 group-hover/peserta:-rotate-6">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                    <p className="w-full truncate text-xs font-semibold capitalize">
                      {p.name}
                    </p>
                    <p className="w-full truncate text-[10px] whitespace-nowrap text-gray-500 capitalize">
                      {p.age} th &middot; {p.block}/{p.houseNumber}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
