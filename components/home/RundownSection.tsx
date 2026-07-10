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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RUNDOWN.map((r, i) => (
            <Reveal key={r.waktu} delay={i * 60}>
              <div className="group flex h-full flex-col rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-merah-tua via-merah to-rose-600 text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    {r.emoji}
                  </span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold whitespace-nowrap text-merah-tua">
                    {r.waktu}
                  </span>
                </div>
                <h3 className="mb-1.5 font-bold text-merah-tua">
                  {r.kegiatan}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {r.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
