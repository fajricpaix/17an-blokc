"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Baby,
  Backpack,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Flag,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Competition, Participant, Category, CATEGORY_LABELS } from "@/lib/types";
import CountUp from "@/components/CountUp";
import Modal from "@/components/Modal";

const KATEGORI_ICON: Record<Category, LucideIcon> = {
  "PAUD-TK": Baby,
  "SD Kecil": Backpack,
  "SD Besar": BookOpen,
  "Anak Muda": User,
  "Orang Dewasa": Users,
};

// Palette avatar peserta — warna dipilih dari hash nama, bukan selalu merah,
// biar grid peserta gampang dibedain sekilas.
const AVATAR_PALETTE = [
  "from-red-500 to-rose-600",
  "from-orange-400 to-amber-600",
  "from-amber-400 to-yellow-600",
  "from-lime-400 to-green-600",
  "from-emerald-400 to-teal-600",
  "from-cyan-400 to-sky-600",
  "from-blue-400 to-indigo-600",
  "from-violet-400 to-purple-600",
  "from-fuchsia-400 to-pink-600",
  "from-pink-400 to-rose-600",
];

function warnaAvatar(nama: string) {
  let hash = 0;
  for (let i = 0; i < nama.length; i++) {
    hash = (hash * 31 + nama.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

const BARIS_AWAL = 6;

export default function KategoriCard({
  kategori,
  lombas,
  pesertas,
}: {
  kategori: Category;
  lombas: Competition[];
  pesertas?: Participant[];
}) {
  const [detailLomba, setDetailLomba] = useState<Competition | null>(null);
  const [showSemuaPeserta, setShowSemuaPeserta] = useState(false);
  const adaLebihBanyak = (pesertas?.length ?? 0) > BARIS_AWAL;
  const pesertaTampil = pesertas?.slice(0, BARIS_AWAL);
  const IkonKategori = KATEGORI_ICON[kategori];

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5">
      <h4 className="mb-3 flex items-center gap-2.5 border-b border-red-100 pb-2.5 font-bold text-dark-primary capitalize">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <IkonKategori className="size-4.5" strokeWidth={2.4} />
        </span>
        {CATEGORY_LABELS[kategori]}
      </h4>
      {lombas.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Belum Ada Lomba.</p>
      ) : (
        <ul className="space-y-3.5 text-sm">
          {lombas.map((l) => (
            <li key={l.id}>
              <p className="flex items-center gap-1.5 font-semibold capitalize">
                <Flag
                  className="size-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                />
                {l.name}
              </p>
              {l.description && (
                <>
                  <p className="mt-0.5 line-clamp-1 leading-relaxed text-gray-600">
                    {l.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDetailLomba(l)}
                    className="mt-0.5 text-xs font-bold text-primary hover:underline"
                  >
                    Lihat detail
                  </button>
                </>
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
              <span className="flex items-center gap-1.5">
                <ClipboardList className="size-4" strokeWidth={2.4} />
                Peserta Terdaftar
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-primary">
                <CountUp value={pesertas.length} />
              </span>
            </h5>
            {pesertas.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Belum ada pendaftar. Jadilah yang pertama! 🚀
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {pesertaTampil!.map((p, i) => (
                    <PesertaCard key={p.id} peserta={p} delay={i * 40} />
                  ))}
                </div>
                {adaLebihBanyak && (
                  <button
                    type="button"
                    onClick={() => setShowSemuaPeserta(true)}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100 py-1.5 text-xs font-bold text-dark-primary transition-colors duration-200 hover:bg-red-50"
                  >
                    {`Lihat Semua (${pesertas.length})`}
                    <ChevronDown className="size-3.5 shrink-0" strokeWidth={2.5} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {detailLomba && (
          <Modal
            key="detail-lomba"
            title={`🚩 ${detailLomba.name}`}
            onClose={() => setDetailLomba(null)}
          >
            <p className="leading-relaxed whitespace-pre-line text-gray-600">
              {detailLomba.description}
            </p>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSemuaPeserta && pesertas && (
          <Modal
            key="semua-peserta"
            title={`📝 Peserta ${CATEGORY_LABELS[kategori]} (${pesertas.length})`}
            onClose={() => setShowSemuaPeserta(false)}
            size="lg"
          >
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {pesertas.map((p, i) => (
                <PesertaCard key={p.id} peserta={p} delay={i * 30} />
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function PesertaCard({
  peserta,
  delay = 0,
}: {
  peserta: Participant;
  delay?: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="animate-pop-in group/peserta flex min-w-0 flex-col items-center gap-1 rounded-xl border border-red-100 bg-white px-2 py-2.5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md hover:shadow-red-900/10"
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-extrabold text-white shadow-sm transition-transform duration-300 group-hover/peserta:scale-110 group-hover/peserta:-rotate-6 ${warnaAvatar(
          peserta.name
        )}`}
      >
        {peserta.name.charAt(0).toUpperCase()}
      </span>
      <p className="w-full truncate text-xs font-semibold capitalize">
        {peserta.name}
      </p>
      <p className="w-full truncate text-[10px] whitespace-nowrap text-gray-500 capitalize">
        {peserta.age} th &middot; {peserta.block}/{peserta.houseNumber}
      </p>
    </div>
  );
}
