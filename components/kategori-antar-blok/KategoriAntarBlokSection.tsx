"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { KategoriAntarBlok, Perwakilan } from "@/lib/types";
import KategoriAntarBlokTable from "./KategoriAntarBlokTable";
import TambahKategoriAntarBlokModal from "./TambahKategoriAntarBlokModal";
import PesertaKategoriModal from "./PesertaKategoriModal";
import EditPerwakilanModal from "./EditPerwakilanModal";

export interface KategoriAntarBlokSectionHandle {
  bukaTambah: () => void;
}

const KategoriAntarBlokSection = forwardRef<
  KategoriAntarBlokSectionHandle,
  {
    initialKategoriAntarBlok: KategoriAntarBlok[];
    initialPerwakilans: Perwakilan[];
    busyId: string | null;
    setBusyId: (id: string | null) => void;
    tampilkanNotif: (pesan: string) => void;
  }
>(function KategoriAntarBlokSection(
  { initialKategoriAntarBlok, initialPerwakilans, busyId, setBusyId, tampilkanNotif },
  ref
) {
  const [kategoriAntarBlok, setKategoriAntarBlok] = useState(
    initialKategoriAntarBlok
  );
  const [perwakilans, setPerwakilans] = useState(initialPerwakilans);
  const [showTambah, setShowTambah] = useState(false);
  const [editKategoriAntarBlok, setEditKategoriAntarBlok] =
    useState<KategoriAntarBlok | null>(null);
  const [lihatPesertaKategori, setLihatPesertaKategori] =
    useState<KategoriAntarBlok | null>(null);
  const [editPerwakilan, setEditPerwakilan] = useState<Perwakilan | null>(
    null
  );

  useImperativeHandle(ref, () => ({
    bukaTambah: () => setShowTambah(true),
  }));

  async function refreshKategoriAntarBlok() {
    try {
      const res = await fetch("/api/kategori-antar-blok");
      if (res.ok) setKategoriAntarBlok(await res.json());
    } catch {
      // biarkan data lama jika gagal
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

  return (
    <>
      <KategoriAntarBlokTable
        kategoriList={kategoriAntarBlok}
        perwakilans={perwakilans}
        busyId={busyId}
        onLihatPeserta={setLihatPesertaKategori}
        onEdit={setEditKategoriAntarBlok}
        onToggleLock={toggleLockKategoriAntarBlok}
        onHapus={hapusKategoriAntarBlok}
      />

      {showTambah && (
        <TambahKategoriAntarBlokModal
          onClose={() => setShowTambah(false)}
          onSuccess={() => {
            refreshKategoriAntarBlok();
            tampilkanNotif("✅ Kategori lomba antar blok berhasil disimpan.");
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
    </>
  );
});

export default KategoriAntarBlokSection;
