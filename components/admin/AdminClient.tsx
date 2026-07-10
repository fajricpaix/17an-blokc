"use client";

import { useState } from "react";
import {
  Competition,
  Participant,
  Rundown,
  Category,
  CHILD_CATEGORIES,
  CATEGORY_LABELS,
} from "@/lib/types";
import TambahLombaModal from "@/components/TambahLombaModal";
import TambahRundownModal from "@/components/TambahRundownModal";
import AdminHeader from "./AdminHeader";
import CategoryTabs, { Tab } from "./CategoryTabs";
import LombaTable from "./LombaTable";
import ParticipantTable from "./ParticipantTable";
import RundownTable from "./RundownTable";
import TambahFab from "./TambahFab";

export default function AdminClient({
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
  const [tab, setTab] = useState<Tab>("Semua");
  const [showTambahLomba, setShowTambahLomba] = useState(false);
  const [showTambahRundown, setShowTambahRundown] = useState(false);
  const [editLomba, setEditLomba] = useState<Competition | null>(null);
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

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16">
      <AdminHeader />

      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-red-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-merah-tua shadow-2xl shadow-red-900/10 backdrop-blur print:hidden">
          {notif}
        </div>
      )}

      <TambahFab
        onPilihLomba={() => setShowTambahLomba(true)}
        onPilihRundown={() => setShowTambahRundown(true)}
      />

      <RundownTable
        rundowns={rundowns}
        busyId={busyId}
        onHapus={hapusRundown}
      />

      <div className="mt-6 mb-2 pt-4 border-t border-merah">
        <CategoryTabs tab={tab} onTabChange={setTab} jumlahTab={jumlahTab} />
      </div>

      <LombaTable
        tab={tab}
        lombaTampil={lombaTampil}
        busyId={busyId}
        onEdit={setEditLomba}
        onHapus={hapusLomba}
      />

      {tabPunyaPeserta && (
        <div className="mb-4 pt-6 border-t border-merah">
          <ParticipantTable
            tab={tab}
            pesertaTampil={pesertaTampil}
            busyId={busyId}
            onDownload={downloadPeserta}
            onPrint={cetakPesertaPDF}
            onHapus={hapusPeserta}
          />
        </div>
      )}

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
    </main>
  );
}
