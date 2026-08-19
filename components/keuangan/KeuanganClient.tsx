"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TambahKeuanganModal from "./TambahKeuanganModal";
import { JenisKeuangan, KeuanganEntry } from "@/lib/types";
import KeuanganTable from "./KeuanganTable";

export default function KeuanganClient({
  initialKeuangan,
  tahun,
  tahunList,
}: {
  initialKeuangan: KeuanganEntry[];
  tahun: string;
  tahunList: string[];
}) {
  const router = useRouter();
  const [keuangan, setKeuangan] = useState(initialKeuangan);
  const [showTambahKeuangan, setShowTambahKeuangan] = useState(false);
  const [tambahKeuanganJenis, setTambahKeuanganJenis] =
    useState<JenisKeuangan>("Donasi");
  const [editKeuangan, setEditKeuangan] = useState<KeuanganEntry | null>(
    null
  );
  const [notif, setNotif] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tahunOpen, setTahunOpen] = useState(false);
  const tahunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tahunOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (!tahunRef.current?.contains(e.target as Node)) setTahunOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setTahunOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [tahunOpen]);

  function tampilkanNotif(pesan: string) {
    setNotif(pesan);
    setTimeout(() => setNotif(""), 4000);
  }

  function gantiTahun(t: string) {
    setTahunOpen(false);
    router.push(`/admin/keuangan?tahun=${t}`);
  }

  function tambahTahunBaru() {
    setTahunOpen(false);
    const input = prompt("Tahun baru (contoh: 2027):");
    const t = input?.trim();
    if (!t || !/^\d{4}$/.test(t)) return;
    gantiTahun(t);
  }

  async function refreshKeuangan() {
    try {
      const res = await fetch(`/api/keuangan?tahun=${tahun}`);
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
      const res = await fetch(`/api/keuangan/${k.id}?tahun=${tahun}`, {
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

      <div className="my-4 flex items-center gap-2 print:hidden">
        <span className="text-sm font-semibold text-dark-primary">Tahun:</span>
        <div ref={tahunRef} className="relative">
          <button
            type="button"
            onClick={() => setTahunOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={tahunOpen}
            className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-1.5 text-sm font-bold text-dark-primary shadow-sm transition-colors duration-200 hover:bg-red-50"
          >
            {tahun}
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`size-4 shrink-0 text-primary transition-transform duration-200 ${
                tahunOpen ? "rotate-180" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {tahunOpen && (
            <ul
              role="listbox"
              className="absolute z-20 mt-2 w-40 animate-pop-in overflow-hidden rounded-2xl border border-red-100 bg-white p-1.5 shadow-xl shadow-red-900/10"
            >
              {tahunList.map((t) => (
                <li key={t} role="option" aria-selected={tahun === t}>
                  <button
                    type="button"
                    onClick={() => gantiTahun(t)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors duration-150 ${
                      tahun === t
                        ? "bg-primary text-white"
                        : "text-dark-primary hover:bg-red-50"
                    }`}
                  >
                    {t}
                  </button>
                </li>
              ))}
              <li className="mt-1 border-t border-red-100 pt-1">
                <button
                  type="button"
                  onClick={tambahTahunBaru}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-dark-primary transition-colors duration-150 hover:bg-red-50"
                >
                  + Tahun Baru
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

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
          tahun={tahun}
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
          tahun={tahun}
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
