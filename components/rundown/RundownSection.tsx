"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useRouter } from "next/navigation";
import { Rundown } from "@/lib/types";
import RundownTable from "./RundownTable";
import TambahRundownModal from "./TambahRundownModal";
import TahunSwitcher from "./TahunSwitcher";

export interface RundownSectionHandle {
  bukaTambah: () => void;
}

const RundownSection = forwardRef<
  RundownSectionHandle,
  {
    initialRundowns: Rundown[];
    tahun: string;
    tahunList: string[];
    busyId: string | null;
    setBusyId: (id: string | null) => void;
    tampilkanNotif: (pesan: string) => void;
  }
>(function RundownSection(
  { initialRundowns, tahun, tahunList, busyId, setBusyId, tampilkanNotif },
  ref
) {
  const router = useRouter();
  const [rundowns, setRundowns] = useState(initialRundowns);
  const [showTambah, setShowTambah] = useState(false);
  const [editRundown, setEditRundown] = useState<Rundown | null>(null);

  useImperativeHandle(ref, () => ({
    bukaTambah: () => setShowTambah(true),
  }));

  function gantiTahun(t: string) {
    router.push(`/admin?rundownTahun=${t}`);
  }

  async function refreshRundowns() {
    try {
      const res = await fetch(`/api/rundowns?tahun=${tahun}`);
      if (res.ok) setRundowns(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function hapusRundown(r: Rundown) {
    if (!confirm(`Hapus rundown "${r.title}"?`)) {
      return;
    }
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/rundowns/${r.id}?tahun=${tahun}`, {
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

  return (
    <>
      <TahunSwitcher tahun={tahun} tahunList={tahunList} onGanti={gantiTahun} />

      <RundownTable
        rundowns={rundowns}
        tahun={tahun}
        busyId={busyId}
        onEdit={setEditRundown}
        onHapus={hapusRundown}
      />

      {showTambah && (
        <TambahRundownModal
          tahun={tahun}
          onClose={() => setShowTambah(false)}
          onSuccess={() => {
            refreshRundowns();
            tampilkanNotif("✅ Rundown baru berhasil disimpan.");
          }}
        />
      )}
      {editRundown && (
        <TambahRundownModal
          tahun={tahun}
          rundown={editRundown}
          onClose={() => setEditRundown(null)}
          onSuccess={() => {
            refreshRundowns();
            tampilkanNotif("✅ Perubahan rundown berhasil disimpan.");
          }}
        />
      )}
    </>
  );
});

export default RundownSection;
