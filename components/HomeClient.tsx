"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Competition,
  Participant,
  Category,
  CHILD_CATEGORIES,
  ADULT_CATEGORIES,
  CATEGORY_LABELS,
} from "@/lib/types";
import DaftarAnakModal from "./DaftarAnakModal";
import TambahLombaModal from "./TambahLombaModal";
import Reveal from "./Reveal";
import CountUp from "./CountUp";

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

const EMOJI_KATEGORI: Record<Category, string> = {
  "PAUD-TK": "🧸",
  "SD Kecil": "🎒",
  "SD Besar": "📚",
  Bapak: "👨",
  Ibu: "👩",
  Pasangan: "💑",
};

export default function HomeClient({
  initialLombas,
  initialPesertas,
}: {
  initialLombas: Competition[];
  initialPesertas: Participant[];
}) {
  const [lombas, setLombas] = useState(initialLombas);
  const [pesertas, setPesertas] = useState(initialPesertas);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDaftar, setShowDaftar] = useState(false);
  const [showTambahLomba, setShowTambahLomba] = useState(false);
  const [notif, setNotif] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [lRes, pRes] = await Promise.all([
        fetch("/api/competitions"),
        fetch("/api/participants"),
      ]);
      if (lRes.ok) setLombas(await lRes.json());
      if (pRes.ok) setPesertas(await pRes.json());
    } catch {
      // biarkan data lama tampil jika refresh gagal
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(Boolean(d.admin)))
      .catch(() => {});
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [refresh]);

  function tampilkanNotif(pesan: string) {
    setNotif(pesan);
    setTimeout(() => setNotif(""), 4000);
  }

  const lombaByKategori = (k: Category) =>
    lombas.filter((l) => l.category === k);
  const pesertaByKategori = (k: Category) =>
    pesertas.filter((p) => p.category === k);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16">
      {/* Toast Notifikasi */}
      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-green-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-green-800 shadow-2xl shadow-green-900/10 backdrop-blur">
          {notif}
        </div>
      )}

      {/* Hero */}
      <header className="relative -mx-4 mb-12 overflow-hidden bg-linear-to-br from-merah-tua via-merah to-rose-500 bg-size-[200%_200%] px-4 pt-16 pb-20 text-center text-white animate-gradient-x">
        {/* dekorasi melayang */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 -left-10 size-48 rounded-full bg-white/10 blur-2xl animate-float-slow"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-7.5 size-64 rounded-full bg-rose-300/20 blur-3xl animate-float"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-10 right-[12%] text-4xl opacity-70 animate-float"
        >
          🎈
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-12 left-[10%] text-4xl opacity-70 animate-float-slow"
        >
          🎉
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/3 left-[4%] hidden text-3xl opacity-60 animate-float sm:block"
        >
          🚩
        </span>

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur animate-fade-up">
            <span className="inline-block origin-bottom-left animate-wave">
              🇮🇩
            </span>
            Dirgahayu Republik Indonesia
          </p>
          <h1 className="text-4xl font-black drop-shadow-sm sm:text-6xl animate-fade-up [animation-delay:120ms]">
            Acara 17an Blok C
            <span className="mt-1 block bg-linear-to-r from-white via-rose-100 to-white bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl">
              Serpong Lagoon
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/90 animate-fade-up [animation-delay:240ms]">
            Pusat informasi &amp; pendaftaran digital lomba kemerdekaan warga
            Blok C Pelican. Ayo ramaikan bersama keluarga!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-up [animation-delay:360ms]">
            <button
              onClick={() => setShowDaftar(true)}
              className="rounded-full bg-white px-7 py-3.5 font-bold text-merah shadow-xl shadow-red-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              🏁 Daftarkan Anak Ikut Lomba
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowTambahLomba(true)}
                className="rounded-full border-2 border-white/80 px-7 py-3.5 font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/15 active:scale-95"
              >
                + Tambah Jenis Lomba
              </button>
            )}
          </div>
          {isAdmin && (
            <div className="mt-5 text-sm animate-fade-up [animation-delay:480ms]">
              <Link
                href="/admin"
                className="underline decoration-white/50 underline-offset-4 transition-colors hover:text-rose-100"
              >
                Buka Dashboard Panitia →
              </Link>
            </div>
          )}
        </div>

        {/* lengkung bawah */}
        <svg
          aria-hidden
          className="absolute bottom-0 left-0 w-full text-krem"
          viewBox="0 0 1440 48"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0 48h1440V16c-120 21-360 32-720 32S120 37 0 16v32z" />
        </svg>
      </header>

      {/* Rundown */}
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

      {/* Jenis Lomba */}
      <section className="mb-14">
        <Reveal>
          <h2 className="mb-1 text-2xl font-extrabold text-merah sm:text-3xl">
            🏆 Jenis-Jenis Lomba
          </h2>
          <p className="mb-5 text-gray-600">
            Dikelompokkan berdasarkan kategori umur peserta.
          </p>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">
                🧒 Kategori Anak-Anak{" "}
                <span className="text-sm font-medium text-gray-500">
                  (Sistem Paralel | 08.15 - 09.30)
                </span>
              </h3>
              <p className="text-sm text-gray-600">
                Daftar peserta diperbarui otomatis — total{" "}
                <strong className="text-merah-tua">
                  <CountUp value={pesertas.length} />
                </strong>{" "}
                anak terdaftar.
              </p>
            </div>
            <button
              onClick={() => setShowDaftar(true)}
              className="rounded-full bg-merah px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-merah-tua active:scale-95"
            >
              + Daftarkan Anak
            </button>
          </div>
        </Reveal>
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHILD_CATEGORIES.map((k, i) => (
            <Reveal key={k} delay={i * 120} className="h-full">
              <KategoriCard
                kategori={k}
                lombas={lombaByKategori(k)}
                pesertas={pesertaByKategori(k)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="mb-4 text-lg font-bold">
            👨‍👩‍👧 Kategori Dewasa &amp; Pasangan{" "}
            <span className="text-sm font-medium text-gray-500">
              (09.30 - 10.30)
            </span>
          </h3>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADULT_CATEGORIES.map((k, i) => (
            <Reveal key={k} delay={i * 120} className="h-full">
              <KategoriCard kategori={k} lombas={lombaByKategori(k)} />
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <footer className="mt-20 border-t border-red-100 pt-8 pb-2 text-center text-sm text-gray-500">
          <span className="mb-2 block text-2xl">🇮🇩</span>
          Panitia 17an Blok C Pelican &mdash; Serpong Lagoon
        </footer>
      </Reveal>

      {showDaftar && (
        <DaftarAnakModal
          onClose={() => setShowDaftar(false)}
          onSuccess={() => {
            refresh();
            tampilkanNotif("🎉 Peserta berhasil didaftarkan. Merdeka!");
          }}
        />
      )}
      {showTambahLomba && (
        <TambahLombaModal
          onClose={() => setShowTambahLomba(false)}
          onSuccess={() => {
            refresh();
            tampilkanNotif("✅ Lomba baru berhasil disimpan.");
          }}
        />
      )}
    </main>
  );
}

function KategoriCard({
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
      <h4 className="mb-3 flex items-center gap-2 border-b border-red-100 pb-2.5 font-bold text-merah-tua">
        <span className="inline-block text-xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
          {EMOJI_KATEGORI[kategori]}
        </span>
        {CATEGORY_LABELS[kategori]}
      </h4>
      {lombas.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum ada lomba.</p>
      ) : (
        <ul className="space-y-3.5 text-sm">
          {lombas.map((l) => (
            <li key={l.id}>
              <p className="font-semibold">🚩 {l.name}</p>
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
                        <td className="px-2 py-1.5 font-semibold">{p.name}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {p.age} th
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-gray-600">
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
