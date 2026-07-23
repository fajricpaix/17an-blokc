"use client";

import { Fragment, useState } from "react";
import {
  KATEGORI_ANTAR_BLOK_BUTUH_KELAS,
  KategoriAntarBlok,
  Perwakilan,
} from "@/lib/types";
import { rentangTanggalKategori } from "@/lib/format";
import CountUp from "@/components/CountUp";

const BARIS_AWAL = 6;

const KELOMPOK_KELAS = [
  { label: "Kelas 1-3 SD", kelas: [1, 2, 3] },
  { label: "Kelas 4-6 SD", kelas: [4, 5, 6] },
];

function nomorKelas(kelas?: string): number | null {
  const match = kelas?.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function indexKelompok(kelas?: string): number {
  const n = nomorKelas(kelas);
  if (n === null) return KELOMPOK_KELAS.length;
  const idx = KELOMPOK_KELAS.findIndex((k) => k.kelas.includes(n));
  return idx === -1 ? KELOMPOK_KELAS.length : idx;
}

function urutkanPerKelas(pesertas: Perwakilan[]): Perwakilan[] {
  return [...pesertas].sort((a, b) => {
    const kelompokA = indexKelompok(a.kelas);
    const kelompokB = indexKelompok(b.kelas);
    if (kelompokA !== kelompokB) return kelompokA - kelompokB;
    return (nomorKelas(a.kelas) ?? Infinity) - (nomorKelas(b.kelas) ?? Infinity);
  });
}

export default function PerwakilanCard({
  kategori,
  pesertas,
  onDaftarClick,
}: {
  kategori: KategoriAntarBlok;
  pesertas: Perwakilan[];
  onDaftarClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isFutsalJunior = kategori.name === KATEGORI_ANTAR_BLOK_BUTUH_KELAS;
  const pesertaUrut = isFutsalJunior ? urutkanPerKelas(pesertas) : pesertas;
  const adaLebihBanyak = pesertaUrut.length > BARIS_AWAL;
  const pesertaTampil = expanded
    ? pesertaUrut
    : pesertaUrut.slice(0, BARIS_AWAL);
  const tanggal = rentangTanggalKategori(kategori);

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5">
      <h4 className="mb-1 flex items-center justify-between gap-2 font-bold text-dark-primary">
        <span className="flex items-center gap-2">
          <span className="inline-block text-xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
            {kategori.icon}
          </span>
          {kategori.name}
        </span>
        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-primary">
          <CountUp value={pesertas.length} /> orang
        </span>
      </h4>
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-red-100 pb-2.5">
        <span className="text-xs text-gray-500">
          {tanggal ? `📅 ${tanggal}` : "Tanggal belum ditentukan"}
        </span>
        {kategori.locked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-gray-600">
            🔒 Ditutup
          </span>
        )}
      </div>

      {pesertas.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          Belum ada perwakilan. Jadilah yang pertama! 🚀
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {pesertaTampil.map((p, i) => {
              const tampilkanHeaderKelompok =
                isFutsalJunior &&
                (i === 0 ||
                  indexKelompok(p.kelas) !==
                    indexKelompok(pesertaTampil[i - 1].kelas));
              return (
                <Fragment key={p.id}>
                  {tampilkanHeaderKelompok && (
                    <p className="col-span-3 mt-2 text-[11px] font-bold tracking-wide text-gray-400 uppercase first:mt-0">
                      {KELOMPOK_KELAS[indexKelompok(p.kelas)]?.label ??
                        "Kelas Lainnya"}
                    </p>
                  )}
                  <div
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
                      {p.kelas ? `${p.kelas} · ` : ""}
                      {p.block}/{p.houseNumber}
                    </p>
                  </div>
                </Fragment>
              );
            })}
          </div>
          {adaLebihBanyak && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100 py-1.5 text-xs font-bold text-dark-primary transition-colors duration-200 hover:bg-red-50"
            >
              {expanded ? "Sembunyikan" : `Lihat Semua (${pesertas.length})`}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`size-3.5 shrink-0 transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onDaftarClick}
        disabled={kategori.locked}
        className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-dark-primary disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
      >
        {kategori.locked ? "🔒 Pendaftaran Ditutup" : "+ Daftar Jadi Perwakilan"}
      </button>
    </div>
  );
}
