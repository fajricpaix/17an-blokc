"use client";

import EditPerwakilanModal from "@/components/EditPerwakilanModal";
import PesertaKategoriModal from "@/components/PesertaKategoriModal";
import PesertaLombaModal from "@/components/PesertaLombaModal";
import TambahKategoriAntarBlokModal from "@/components/TambahKategoriAntarBlokModal";
import TambahLombaModal from "@/components/TambahLombaModal";
import TambahRundownModal from "@/components/TambahRundownModal";
import TambahSponsorModal from "@/components/TambahSponsorModal";
import {
  Category,
  CATEGORY_LABELS,
  CHILD_CATEGORIES,
  Competition,
  KategoriAntarBlok,
  Participant,
  Perwakilan,
  Rundown,
  Sponsor,
} from "@/lib/types";
import { useState } from "react";
import AdminHeader from "./AdminHeader";
import { Tab } from "./CategoryTabs";
import KategoriAntarBlokTable from "./KategoriAntarBlokTable";
import LombaTable from "./LombaTable";
import RundownTable from "./RundownTable";
import SponsorTable from "./SponsorTable";
import TambahFab from "./TambahFab";

export default function AdminClient({
  initialLombas,
  initialPesertas,
  initialKategoriAntarBlok,
  initialPerwakilans,
  initialRundowns,
  initialSponsors,
}: {
  initialLombas: Competition[];
  initialPesertas: Participant[];
  initialKategoriAntarBlok: KategoriAntarBlok[];
  initialPerwakilans: Perwakilan[];
  initialRundowns: Rundown[];
  initialSponsors: Sponsor[];
}) {
  const [lombas, setLombas] = useState(initialLombas);
  const [pesertas, setPesertas] = useState(initialPesertas);
  const [kategoriAntarBlok, setKategoriAntarBlok] = useState(
    initialKategoriAntarBlok
  );
  const [perwakilans, setPerwakilans] = useState(initialPerwakilans);
  const [rundowns, setRundowns] = useState(initialRundowns);
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [tab, setTab] = useState<Tab>("Semua");
  const [showTambahLomba, setShowTambahLomba] = useState(false);
  const [showTambahRundown, setShowTambahRundown] = useState(false);
  const [showTambahKategoriAntarBlok, setShowTambahKategoriAntarBlok] =
    useState(false);
  const [showTambahSponsor, setShowTambahSponsor] = useState(false);
  const [editLomba, setEditLomba] = useState<Competition | null>(null);
  const [lihatPesertaLomba, setLihatPesertaLomba] =
    useState<Competition | null>(null);
  const [editKategoriAntarBlok, setEditKategoriAntarBlok] =
    useState<KategoriAntarBlok | null>(null);
  const [editRundown, setEditRundown] = useState<Rundown | null>(null);
  const [lihatPesertaKategori, setLihatPesertaKategori] =
    useState<KategoriAntarBlok | null>(null);
  const [editPerwakilan, setEditPerwakilan] = useState<Perwakilan | null>(
    null
  );
  const [notif, setNotif] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function tampilkanNotif(pesan: string) {
    setNotif(pesan);
    setTimeout(() => setNotif(""), 4000);
  }

  async function refreshLombas() {
    try {
      const res = await fetch("/api/competitions");
      if (res.ok) setLombas(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function refreshRundowns() {
    try {
      const res = await fetch("/api/rundowns");
      if (res.ok) setRundowns(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function refreshKategoriAntarBlok() {
    try {
      const res = await fetch("/api/kategori-antar-blok");
      if (res.ok) setKategoriAntarBlok(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function refreshSponsors() {
    try {
      const res = await fetch("/api/sponsors");
      if (res.ok) setSponsors(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function toggleActiveSponsor(s: Sponsor, active: boolean) {
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/sponsors/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal mengubah status sponsor."}`);
        return;
      }
      setSponsors((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, active } : x))
      );
      tampilkanNotif(
        active
          ? `✅ Sponsor "${s.name}" diaktifkan.`
          : `🚫 Sponsor "${s.name}" dinonaktifkan.`
      );
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapusSponsor(s: Sponsor) {
    if (!confirm(`Hapus sponsor "${s.name}"?`)) {
      return;
    }
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/sponsors/${s.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus sponsor."}`);
        return;
      }
      setSponsors((prev) => prev.filter((x) => x.id !== s.id));
      tampilkanNotif(`🗑️ Sponsor "${s.name}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function refreshPerwakilans() {
    try {
      const res = await fetch("/api/perwakilan");
      if (res.ok) setPerwakilans(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function hapusPerwakilan(p: Perwakilan) {
    if (!confirm(`Hapus perwakilan "${p.name}" dari semua cabor?`)) {
      return;
    }
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/perwakilan/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus perwakilan."}`);
        return;
      }
      setPerwakilans((prev) => prev.filter((x) => x.id !== p.id));
      tampilkanNotif(`🗑️ Perwakilan "${p.name}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapusRundown(r: Rundown) {
    if (!confirm(`Hapus rundown "${r.title}"?`)) {
      return;
    }
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/rundowns/${r.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus rundown."}`);
        return;
      }
      setRundowns((prev) => prev.filter((x) => x.id !== r.id));
      tampilkanNotif(`🗑️ Rundown "${r.title}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapusKategoriAntarBlok(k: KategoriAntarBlok) {
    if (!confirm(`Hapus kategori lomba "${k.name}"?`)) {
      return;
    }
    setBusyId(k.id);
    try {
      const res = await fetch(`/api/kategori-antar-blok/${k.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus kategori."}`);
        return;
      }
      setKategoriAntarBlok((prev) => prev.filter((x) => x.id !== k.id));
      tampilkanNotif(`🗑️ Kategori "${k.name}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleLockKategoriAntarBlok(k: KategoriAntarBlok) {
    const akanDikunci = !k.locked;
    if (
      !confirm(
        akanDikunci
          ? `Kunci pendaftaran cabor "${k.name}"? Peserta baru tidak bisa didaftarkan lagi.`
          : `Buka kembali pendaftaran cabor "${k.name}"?`
      )
    ) {
      return;
    }
    setBusyId(k.id);
    try {
      const res = await fetch(`/api/kategori-antar-blok/${k.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: akanDikunci }),
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal mengubah status kunci."}`);
        return;
      }
      setKategoriAntarBlok((prev) =>
        prev.map((x) => (x.id === k.id ? { ...x, locked: akanDikunci } : x))
      );
      tampilkanNotif(
        akanDikunci
          ? `🔒 Cabor "${k.name}" berhasil dikunci.`
          : `🔓 Cabor "${k.name}" berhasil dibuka kembali.`
      );
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapusLomba(l: Competition) {
    if (!confirm(`Hapus lomba "${l.name}" (${CATEGORY_LABELS[l.category]})?`)) {
      return;
    }
    setBusyId(l.id);
    try {
      const res = await fetch(`/api/competitions/${l.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus lomba."}`);
        return;
      }
      setLombas((prev) => prev.filter((x) => x.id !== l.id));
      tampilkanNotif(`🗑️ Lomba "${l.name}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapusPeserta(p: Participant) {
    if (
      !confirm(
        `Hapus peserta "${p.name}" (${p.age} th, Blok ${p.block} No. ${p.houseNumber})?`
      )
    ) {
      return;
    }
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/participants/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus peserta."}`);
        return;
      }
      setPesertas((prev) => prev.filter((x) => x.id !== p.id));
      tampilkanNotif(`🗑️ Peserta "${p.name}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  function downloadPeserta() {
    const header = ["No", "Nama", "Umur", "Kategori", "Alamat"];
    const rows = pesertaTampil.map((p, i) => [
      i + 1,
      p.name,
      `${p.age} th`,
      CATEGORY_LABELS[p.category],
      `Blok ${p.block} No. ${p.houseNumber}`,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peserta-${tab === "Semua" ? "semua" : tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function cetakPesertaPDF() {
    window.print();
  }

  const lombaTampil =
    tab === "Semua" ? lombas : lombas.filter((l) => l.category === tab);
  const pesertaTampil =
    tab === "Semua" ? pesertas : pesertas.filter((p) => p.category === tab);
  // pendaftaran hanya untuk kategori anak
  const tabPunyaPeserta =
    tab === "Semua" || CHILD_CATEGORIES.includes(tab as Category);

  const jumlahTab = (t: Tab) =>
    t === "Semua"
      ? lombas.length
      : lombas.filter((l) => l.category === t).length;

  // Saat popup peserta lomba/kategori terbuka, tabel peserta utama disembunyikan
  // dari hasil cetak supaya yang tercetak cuma satu tabel (sesuai lomba yang dipilih).
  const sedangLihatPesertaModal = Boolean(
    lihatPesertaLomba || lihatPesertaKategori
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16">
      <AdminHeader />

      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-red-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-dark-primary shadow-2xl shadow-red-900/10 backdrop-blur print:hidden">
          {notif}
        </div>
      )}

      <TambahFab
        onPilihLomba={() => setShowTambahLomba(true)}
        onPilihRundown={() => setShowTambahRundown(true)}
        onPilihKategoriAntarBlok={() => setShowTambahKategoriAntarBlok(true)}
        onPilihSponsor={() => setShowTambahSponsor(true)}
      />

      <RundownTable
        rundowns={rundowns}
        busyId={busyId}
        onEdit={setEditRundown}
        onHapus={hapusRundown}
      />

      <div className="mb-4 pt-6 border-t border-primary print:hidden">
        <KategoriAntarBlokTable
          kategoriList={kategoriAntarBlok}
          perwakilans={perwakilans}
          busyId={busyId}
          onLihatPeserta={setLihatPesertaKategori}
          onEdit={setEditKategoriAntarBlok}
          onToggleLock={toggleLockKategoriAntarBlok}
          onHapus={hapusKategoriAntarBlok}
        />
      </div>

      <LombaTable
        tab={tab}
        lombaTampil={lombaTampil}
        pesertas={pesertas}
        busyId={busyId}
        onLihatPeserta={setLihatPesertaLomba}
        onEdit={setEditLomba}
        onHapus={hapusLomba}
      />

      <div className="mb-4 pt-6 border-t border-primary print:hidden">
        <SponsorTable
          sponsors={sponsors}
          busyId={busyId}
          onToggleActive={toggleActiveSponsor}
          onHapus={hapusSponsor}
        />
      </div>

      {showTambahLomba && (
        <TambahLombaModal
          onClose={() => setShowTambahLomba(false)}
          onSuccess={() => {
            refreshLombas();
            tampilkanNotif("✅ Lomba baru berhasil disimpan.");
          }}
        />
      )}
      {showTambahRundown && (
        <TambahRundownModal
          onClose={() => setShowTambahRundown(false)}
          onSuccess={() => {
            refreshRundowns();
            tampilkanNotif("✅ Rundown baru berhasil disimpan.");
          }}
        />
      )}
      {editLomba && (
        <TambahLombaModal
          lomba={editLomba}
          onClose={() => setEditLomba(null)}
          onSuccess={() => {
            refreshLombas();
            tampilkanNotif("✅ Perubahan lomba berhasil disimpan.");
          }}
        />
      )}
      {editRundown && (
        <TambahRundownModal
          rundown={editRundown}
          onClose={() => setEditRundown(null)}
          onSuccess={() => {
            refreshRundowns();
            tampilkanNotif("✅ Perubahan rundown berhasil disimpan.");
          }}
        />
      )}
      {showTambahKategoriAntarBlok && (
        <TambahKategoriAntarBlokModal
          onClose={() => setShowTambahKategoriAntarBlok(false)}
          onSuccess={() => {
            refreshKategoriAntarBlok();
            tampilkanNotif("✅ Kategori lomba antar blok berhasil disimpan.");
          }}
        />
      )}
      {showTambahSponsor && (
        <TambahSponsorModal
          onClose={() => setShowTambahSponsor(false)}
          onSuccess={() => {
            refreshSponsors();
            tampilkanNotif("✅ Sponsor baru berhasil disimpan.");
          }}
        />
      )}
      {editKategoriAntarBlok && (
        <TambahKategoriAntarBlokModal
          kategori={editKategoriAntarBlok}
          onClose={() => setEditKategoriAntarBlok(null)}
          onSuccess={() => {
            refreshKategoriAntarBlok();
            tampilkanNotif("✅ Perubahan kategori lomba berhasil disimpan.");
          }}
        />
      )}
      {lihatPesertaLomba && (
        <PesertaLombaModal
          lomba={lihatPesertaLomba}
          pesertas={pesertas}
          onClose={() => setLihatPesertaLomba(null)}
        />
      )}
      {lihatPesertaKategori && (
        <PesertaKategoriModal
          kategori={lihatPesertaKategori}
          perwakilans={perwakilans}
          busyId={busyId}
          onEdit={setEditPerwakilan}
          onHapus={hapusPerwakilan}
          onClose={() => setLihatPesertaKategori(null)}
        />
      )}
      {editPerwakilan && (
        <EditPerwakilanModal
          perwakilan={editPerwakilan}
          kategoriList={kategoriAntarBlok}
          onClose={() => setEditPerwakilan(null)}
          onSuccess={() => {
            refreshPerwakilans();
            tampilkanNotif("✅ Cabor perwakilan berhasil diperbarui.");
          }}
        />
      )}
    </main>
  );
}
