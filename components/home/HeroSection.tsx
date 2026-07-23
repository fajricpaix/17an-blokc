"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection({
  isAdmin,
  onDaftarClick,
  onTambahLombaClick,
}: {
  isAdmin: boolean;
  onDaftarClick: () => void;
  onTambahLombaClick: () => void;
}) {
  return (
    <header className="relative -mx-4 mb-12 overflow-hidden bg-linear-to-br from-dark-primary via-primary to-rose-500 bg-size-[200%_200%] px-4 pt-16 pb-20 text-center text-white animate-gradient-x">
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

      <motion.div
        className="relative mx-auto max-w-3xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={item}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur"
        >
          <span className="inline-block origin-bottom-left animate-wave">
            🇮🇩
          </span>
          Dirgahayu Republik Indonesia
        </motion.p>
        <motion.h1
          variants={item}
          className="text-4xl font-black drop-shadow-sm sm:text-6xl"
        >
          Acara 17an Blok C
          <span className="mt-1 block bg-linear-to-r from-white via-rose-100 to-white bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl">
            Serpong Lagoon
          </span>
        </motion.h1>
        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-xl text-white/90"
        >
          Pusat informasi &amp; pendaftaran digital lomba kemerdekaan warga
          Blok C Pelican. Ayo ramaikan bersama keluarga!
        </motion.p>
        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={onDaftarClick}
            className="rounded-full bg-white px-7 py-3.5 font-bold text-primary shadow-xl shadow-red-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            🏁 Daftarkan Anak Ikut Lomba
          </button>
          {isAdmin && (
            <button
              onClick={onTambahLombaClick}
              className="rounded-full border-2 border-white/80 px-7 py-3.5 font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/15 active:scale-95"
            >
              + Tambah Jenis Lomba
            </button>
          )}
        </motion.div>
        {isAdmin && (
          <motion.div variants={item} className="mt-5 text-sm">
            <Link
              href="/admin"
              className="underline decoration-white/50 underline-offset-4 transition-colors hover:text-rose-100"
            >
              Buka Dashboard Panitia →
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* lengkung bawah */}
      <svg
        aria-hidden
        className="absolute bottom-0 left-0 w-full text-secondary"
        viewBox="0 0 1440 48"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0 48h1440V16c-120 21-360 32-720 32S120 37 0 16v32z" />
      </svg>
    </header>
  );
}
