"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import TambahLombaModal from "@/components/TambahLombaModal";
import { CATEGORY_LABELS, Competition, Participant } from "@/lib/types";
import { Tab } from "./CategoryTabs";
import LombaTable from "./LombaTable";
import PesertaLombaModal from "./PesertaLombaModal";

export interface LombaSectionHandle {
  bukaTambah: () => void;
}

const LombaSection = forwardRef<
  LombaSectionHandle,
  {
    initialLombas: Competition[];
    initialPesertas: Participant[];
    busyId: string | null;
    setBusyId: (id: string | null) => void;
    tampilkanNotif: (pesan: string) => void;
  }
>(function LombaSection(
  { initialLombas, initialPesertas, busyId, setBusyId, tampilkanNotif },
  ref
) {
  const [lombas, setLombas] = useState(initialLombas);
  const [pesertas] = useState(initialPesertas);
  const [tab] = useState<Tab>("Semua");
  const [showTambah, setShowTambah] = useState(false);
  const [editLomba, setEditLomba] = useState<Competition | null>(null);
  const [lihatPesertaLomba, setLihatPesertaLomba] =
    useState<Competition | null>(null);

  useImperativeHandle(ref, () => ({
    bukaTambah: () => setShowTambah(true),
  }));

  async function refreshLombas() {
    try {
      const res = await fetch("/api/competitions");
      if (res.ok) setLombas(await res.json());
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

  const lombaTampil =
    tab === "Semua" ? lombas : lombas.filter((l) => l.category === tab);

  return (
    <>
      <LombaTable
        tab={tab}
        lombaTampil={lombaTampil}
        pesertas={pesertas}
        busyId={busyId}
        onLihatPeserta={setLihatPesertaLomba}
        onEdit={setEditLomba}
        onHapus={hapusLomba}
      />

      {showTambah && (
        <TambahLombaModal
          onClose={() => setShowTambah(false)}
          onSuccess={() => {
            refreshLombas();
            tampilkanNotif("✅ Lomba baru berhasil disimpan.");
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
      {lihatPesertaLomba && (
        <PesertaLombaModal
          lomba={lihatPesertaLomba}
          pesertas={pesertas}
          onClose={() => setLihatPesertaLomba(null)}
        />
      )}
    </>
  );
});

export default LombaSection;
