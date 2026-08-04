import { KategoriAntarBlok, Perwakilan } from "@/lib/types";
import { rentangTanggalKategori } from "@/lib/format";

export default function KategoriAntarBlokTable({
  kategoriList,
  perwakilans,
  busyId,
  onLihatPeserta,
  onEdit,
  onToggleLock,
  onHapus,
}: {
  kategoriList: KategoriAntarBlok[];
  perwakilans: Perwakilan[];
  busyId: string | null;
  onLihatPeserta: (k: KategoriAntarBlok) => void;
  onEdit: (k: KategoriAntarBlok) => void;
  onToggleLock: (k: KategoriAntarBlok) => void;
  onHapus: (k: KategoriAntarBlok) => void;
}) {
  const jumlahPerwakilan = (k: KategoriAntarBlok) =>
    perwakilans.filter((p) => p.categories.includes(k.name)).length;

  return (
    <section className="mb-8 print:hidden">
      <h2 className="mb-1 text-xl font-extrabold text-primary">
        🏅 Kategori Lomba Antar Blok
      </h2>
      <p className="mb-4 text-gray-600">
        Total <strong>{kategoriList.length}</strong> kategori lomba yang
        diikuti Blok C sebagai perwakilan. Kunci cabor kalau pendaftaran
        sudah ditutup.
      </p>
      <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">Nama Lomba</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Jumlah Perwakilan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategoriList.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400 italic"
                >
                  Belum ada kategori lomba antar blok.
                </td>
              </tr>
            ) : (
              kategoriList.map((k, i) => (
                <tr
                  key={k.id}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-xl">{k.icon}</td>
                  <td className="px-4 py-3 font-semibold">{k.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {rentangTanggalKategori(k) ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onLihatPeserta(k)}
                      className="font-semibold text-dark-primary underline decoration-red-200 underline-offset-2 transition-colors hover:text-primary"
                    >
                      {jumlahPerwakilan(k)} orang
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {k.locked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                        🔒 Terkunci
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                        🔓 Terbuka
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(k)}
                        disabled={busyId === k.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onToggleLock(k)}
                        disabled={busyId === k.id}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-primary transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        {k.locked ? "🔓 Buka" : "🔒 Kunci"}
                      </button>
                      <button
                        onClick={() => onHapus(k)}
                        disabled={busyId === k.id}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-dark-primary disabled:opacity-60"
                      >
                        {busyId === k.id ? "..." : "🗑️ Hapus"}
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
