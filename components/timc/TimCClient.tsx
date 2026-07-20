"use client";

import { useCallback, useEffect, useState } from "react";
import { KategoriAntarBlok, Perwakilan } from "@/lib/types";
import DaftarPerwakilanModal from "@/components/DaftarPerwakilanModal";
import PerwakilanSection from "@/components/home/PerwakilanSection";
import SiteFooter from "@/components/home/SiteFooter";
import TimCHeroSection from "./TimCHeroSection";

export default function TimCClient({
  initialKategoriAntarBlok,
  initialPerwakilans,
}: {
  initialKategoriAntarBlok: KategoriAntarBlok[];
  initialPerwakilans: Perwakilan[];
}) {
  const [kategoriAntarBlok, setKategoriAntarBlok] = useState(
    initialKategoriAntarBlok
  );
  const [perwakilans, setPerwakilans] = useState(initialPerwakilans);
  const [isAdmin, setIsAdmin] = useState(false);
  const [kategoriPerwakilan, setKategoriPerwakilan] =
    useState<KategoriAntarBlok | null>(null);
  const [notif, setNotif] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [kRes, wRes] = await Promise.all([
        fetch("/api/kategori-antar-blok"),
        fetch("/api/perwakilan"),
      ]);
      if (kRes.ok) setKategoriAntarBlok(await kRes.json());
      if (wRes.ok) setPerwakilans(await wRes.json());
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

  return (
    <main className="mx-auto w-full sm:max-w-6xl flex-1 px-4 pb-24 sm:pb-16">
      {/* Toast Notifikasi */}
      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-green-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-green-800 shadow-2xl shadow-green-900/10 backdrop-blur">
          {notif}
        </div>
      )}

      <TimCHeroSection isAdmin={isAdmin} />

      <PerwakilanSection
        kategoriList={kategoriAntarBlok}
        perwakilans={perwakilans}
        onDaftarClick={(kategori) => setKategoriPerwakilan(kategori)}
      />

      <SiteFooter />

      {kategoriPerwakilan && (
        <DaftarPerwakilanModal
          kategoriList={kategoriAntarBlok}
          kategoriAwal={kategoriPerwakilan}
          onClose={() => setKategoriPerwakilan(null)}
          onSuccess={() => {
            refresh();
            tampilkanNotif("🎉 Perwakilan berhasil didaftarkan. Merdeka!");
          }}
        />
      )}
    </main>
  );
}
