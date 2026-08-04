"use client";

import { useState } from "react";
import TambahKeuanganModal from "@/components/TambahKeuanganModal";
import { JenisKeuangan, KeuanganEntry } from "@/lib/types";
import KeuanganTable from "./KeuanganTable";

export default function KeuanganClient({
  initialKeuangan,
}: {
  initialKeuangan: KeuanganEntry[];
}) {
  const [keuangan, setKeuangan] = useState(initialKeuangan);
  const [showTambahKeuangan, setShowTambahKeuangan] = useState(false);
  const [tambahKeuanganJenis, setTambahKeuanganJenis] =
    useState<JenisKeuangan>("Donasi");
  const [editKeuangan, setEditKeuangan] = useState<KeuanganEntry | null>(
    null
  );
  const [notif, setNotif] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function tampilkanNotif(pesan: string) {
    setNotif(pesan);
    setTimeout(() => setNotif(""), 4000);
  }

  async function refreshKeuangan() {
    try {
      const res = await fetch("/api/keuangan");
      if (res.ok) setKeuangan(await res.json());
    } catch {
      // biarkan data lama jika gagal
    }
  }

  async function hapusKeuangan(k: KeuanganEntry) {
    if (!confirm(`Hapus transaksi "${k.keterangan}"?`)) {
      return;
    }
    setBusyId(k.id);
    try {
      const res = await fetch(`/api/keuangan/${k.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        tampilkanNotif(`⚠️ ${data.error ?? "Gagal menghapus transaksi."}`);
        return;
      }
      setKeuangan((prev) => prev.filter((x) => x.id !== k.id));
      tampilkanNotif(`🗑️ Transaksi "${k.keterangan}" berhasil dihapus.`);
    } catch {
      tampilkanNotif("⚠️ Gagal terhubung ke server.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-red-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-dark-primary shadow-2xl shadow-red-900/10 backdrop-blur print:hidden">
          {notif}
        </div>
      )}

      <KeuanganTable
        entries={keuangan}
        busyId={busyId}
        onTambah={(jenis) => {
          setTambahKeuanganJenis(jenis);
          setShowTambahKeuangan(true);
        }}
        onEdit={setEditKeuangan}
        onHapus={hapusKeuangan}
      />

      {showTambahKeuangan && (
        <TambahKeuanganModal
          defaultJenis={tambahKeuanganJenis}
          onClose={() => setShowTambahKeuangan(false)}
          onSuccess={() => {
            refreshKeuangan();
            tampilkanNotif("✅ Transaksi keuangan berhasil disimpan.");
          }}
        />
      )}
      {editKeuangan && (
        <TambahKeuanganModal
          entry={editKeuangan}
          onClose={() => setEditKeuangan(null)}
          onSuccess={() => {
            refreshKeuangan();
            tampilkanNotif("✅ Perubahan transaksi berhasil disimpan.");
          }}
        />
      )}
    </>
  );
}
