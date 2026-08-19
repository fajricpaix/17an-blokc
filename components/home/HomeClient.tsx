"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Competition, Participant, Rundown } from "@/lib/types";
import DaftarAnakModal from "@/components/DaftarAnakModal";
import TambahLombaModal from "@/components/TambahLombaModal";
import HeroSection from "./HeroSection";
import BannerAcaraSection from "./BannerAcaraSection";
import RundownSection from "./RundownSection";
import LombaSection from "./LombaSection";
import SiteFooter from "./SiteFooter";

export default function HomeClient({
  initialLombas,
  initialPesertas,
  initialRundowns,
}: {
  initialLombas: Competition[];
  initialPesertas: Participant[];
  initialRundowns: Rundown[];
}) {
  const [lombas, setLombas] = useState(initialLombas);
  const [pesertas, setPesertas] = useState(initialPesertas);
  const [rundowns, setRundowns] = useState(initialRundowns);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDaftar, setShowDaftar] = useState(false);
  const [showTambahLomba, setShowTambahLomba] = useState(false);
  const [notif, setNotif] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const jedaMinimum = new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const tahun = new Date().getFullYear();
      const [lRes, pRes, rRes] = await Promise.all([
        fetch("/api/competitions"),
        fetch("/api/participants"),
        fetch(`/api/rundowns?tahun=${tahun}`),
      ]);
      if (lRes.ok) {
        const lombas: Competition[] = await lRes.json();
        setLombas(lombas.filter((l) => l.active !== false));
      }
      if (pRes.ok) setPesertas(await pRes.json());
      if (rRes.ok) setRundowns(await rRes.json());
    } catch {
      // biarkan data lama tampil jika refresh gagal
    } finally {
      await jedaMinimum;
      setIsRefreshing(false);
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

  return (
    <main className="mx-auto w-full sm:max-w-6xl flex-1 px-4 pb-24 sm:pb-16">
      {/* Indikator sinkronisasi data latar belakang */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            key="sync"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-red-100 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-md backdrop-blur"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Memperbarui data...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifikasi */}
      <AnimatePresence>
        {notif && (
          <motion.div
            key="notif"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-green-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-green-800 shadow-2xl shadow-green-900/10 backdrop-blur"
          >
            {notif}
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection
        isAdmin={isAdmin}
        onDaftarClick={() => setShowDaftar(true)}
        onTambahLombaClick={() => setShowTambahLomba(true)}
      />

      <BannerAcaraSection />

      <RundownSection rundowns={rundowns} />

      <LombaSection
        lombas={lombas}
        pesertas={pesertas}
        onDaftarClick={() => setShowDaftar(true)}
      />

      <SiteFooter />

      <AnimatePresence>
        {showDaftar && (
          <DaftarAnakModal
            key="daftar-anak"
            onClose={() => setShowDaftar(false)}
            onSuccess={() => {
              refresh();
              tampilkanNotif("🎉 Peserta berhasil didaftarkan. Merdeka!");
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTambahLomba && (
          <TambahLombaModal
            key="tambah-lomba"
            onClose={() => setShowTambahLomba(false)}
            onSuccess={() => {
              refresh();
              tampilkanNotif("✅ Lomba baru berhasil disimpan.");
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
