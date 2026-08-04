"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Sponsor } from "@/lib/types";
import SponsorTable from "./SponsorTable";
import TambahSponsorModal from "./TambahSponsorModal";

export interface SponsorSectionHandle {
  bukaTambah: () => void;
}

const SponsorSection = forwardRef<
  SponsorSectionHandle,
  {
    initialSponsors: Sponsor[];
    busyId: string | null;
    setBusyId: (id: string | null) => void;
    tampilkanNotif: (pesan: string) => void;
  }
>(function SponsorSection(
  { initialSponsors, busyId, setBusyId, tampilkanNotif },
  ref
) {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [showTambah, setShowTambah] = useState(false);

  useImperativeHandle(ref, () => ({
    bukaTambah: () => setShowTambah(true),
  }));

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

  return (
    <>
      <SponsorTable
        sponsors={sponsors}
        busyId={busyId}
        onToggleActive={toggleActiveSponsor}
        onHapus={hapusSponsor}
      />

      {showTambah && (
        <TambahSponsorModal
          onClose={() => setShowTambah(false)}
          onSuccess={() => {
            refreshSponsors();
            tampilkanNotif("✅ Sponsor baru berhasil disimpan.");
          }}
        />
      )}
    </>
  );
});

export default SponsorSection;
