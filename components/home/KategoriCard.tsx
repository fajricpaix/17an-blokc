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
      <h4 className="mb-3 flex items-center gap-2 border-b border-red-100 pb-2.5 font-bold text-merah-tua capitalize">
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
            <h5 className="mb-2 flex items-center justify-between gap-2 text-sm font-bold text-merah-tua">
              <span>📝 Peserta Terdaftar</span>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-merah">
                <CountUp value={pesertas.length} />
              </span>
            </h5>
            {pesertas.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Belum ada pendaftar. Jadilah yang pertama! 🚀
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-red-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-red-50 text-merah-tua">
                    <tr>
                      <th className="px-2 py-1.5 font-bold">No</th>
                      <th className="px-2 py-1.5 font-bold">Nama</th>
                      <th className="px-2 py-1.5 font-bold">Umur</th>
                      <th className="px-2 py-1.5 font-bold">Alamat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pesertas.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`transition-colors duration-200 hover:bg-red-50 ${
                          i % 2 ? "bg-red-50/40" : "bg-white"
                        }`}
                      >
                        <td className="px-2 py-1.5 text-gray-500">{i + 1}</td>
                        <td className="px-2 py-1.5 font-semibold capitalize">{p.name}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {p.age} th
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-gray-600 capitalize">
                          {p.block} / {p.houseNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
