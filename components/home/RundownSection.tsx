import Reveal from "@/components/Reveal";

const RUNDOWN = [
  {
    waktu: "06.30 - 07.00",
    kegiatan: "Kumpul Warga & Absensi",
    detail: "Registrasi warga Blok C & pembagian kupon doorprize.",
    emoji: "🙋",
  },
  {
    waktu: "07.00 - 07.30",
    kegiatan: "Jalan Sehat Kompleks",
    detail: "Rute pendek keliling kompleks (ramah anak-anak).",
    emoji: "🚶",
  },
  {
    waktu: "07.30 - 08.00",
    kegiatan: "Senam Bersama",
    detail: "Sesi senam pagi enerjik (Zumba / Senam Maumere).",
    emoji: "🤸",
  },
  {
    waktu: "08.00 - 08.15",
    kegiatan: "Istirahat & Konsumsi",
    detail: "Pembagian bubur kacang hijau / snack & persiapan area lomba.",
    emoji: "🥣",
  },
  {
    waktu: "08.15 - 09.30",
    kegiatan: "Lomba Kategori Anak (Paralel)",
    detail: "Perlombaan anak-anak serentak di titik lapangan berbeda.",
    emoji: "🧒",
  },
  {
    waktu: "09.30 - 10.30",
    kegiatan: "Lomba Kategori Dewasa & Pasangan",
    detail: "Lomba bapak, ibu, dan pasangan di bawah area teduh tenda.",
    emoji: "👨‍👩‍👧",
  },
  {
    waktu: "Selesai Maghrib",
    kegiatan: "Malam Puncak & Hiburan",
    detail:
      "Pembagian hadiah utama, doorprize, Live Musik, Karaoke, & Seni Tradisional.",
    emoji: "🎤",
  },
];

export default function RundownSection() {
  return (
    <Reveal>
      <section className="mb-14">
        <h2 className="mb-1 text-2xl font-extrabold text-merah sm:text-3xl">
          📋 Rundown 17an Blok C
        </h2>
        <p className="mb-5 text-gray-600">
          Susunan kegiatan dari pagi hingga malam puncak.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-red-100 bg-white shadow-sm">
          <table className="w-full min-w-140 text-left text-sm">
            <thead className="bg-linear-to-r from-merah-tua via-merah to-rose-600 text-white">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">Waktu</th>
                <th className="px-4 py-3.5">Kegiatan</th>
                <th className="px-4 py-3.5">Detail Kegiatan</th>
              </tr>
            </thead>
            <tbody>
              {RUNDOWN.map((r, i) => (
                <tr
                  key={r.waktu}
                  className={`transition-colors duration-200 hover:bg-red-50 ${
                    i % 2 ? "bg-red-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3.5 font-bold whitespace-nowrap text-merah-tua">
                    {r.waktu}
                  </td>
                  <td className="px-4 py-3.5 font-semibold">
                    <span className="mr-1.5">{r.emoji}</span>
                    {r.kegiatan}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Reveal>
  );
}
