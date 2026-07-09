"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Competition,
  Participant,
  Category,
  ALL_CATEGORIES,
  CHILD_CATEGORIES,
  CATEGORY_LABELS,
} from "@/lib/types";
import TambahLombaModal from "./TambahLombaModal";

type Tab = "Semua" | Category;

export default function AdminClient({
  initialLombas,
  initialPesertas,
}: {
  initialLombas: Competition[];
  initialPesertas: Participant[];
}) {
  const router = useRouter();
  const [lombas, setLombas] = useState(initialLombas);
  const [pesertas, setPesertas] = useState(initialPesertas);
  const [tab, setTab] = useState<Tab>("Semua");
  const [showTambahLomba, setShowTambahLomba] = useState(false);
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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
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
      <header className="-mx-4 mb-8 bg-linear-to-r from-merah-tua via-merah to-rose-600 bg-size-[200%_100%] px-4 py-8 text-white animate-gradient-x">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              🛠️ Dashboard Panitia
            </h1>
            <p className="text-white/80">
              Manajemen pendaftaran Acara 17an Blok C Serpong Lagoon
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border-2 border-white px-4 py-2 text-sm font-bold hover:bg-white/10"
            >
              ← Halaman Utama
            </Link>
            <button
              onClick={() => setShowTambahLomba(true)}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-merah transition-all duration-300 hover:scale-105 hover:bg-red-50 active:scale-95"
            >
              + Tambah Jenis Lomba
            </button>
            <button
              onClick={logout}
              className="rounded-full border-2 border-white/50 px-4 py-2 text-sm font-bold text-white/80 hover:bg-white/10"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-red-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-merah-tua shadow-2xl shadow-red-900/10 backdrop-blur">
          {notif}
        </div>
      )}

      {/* Tab Kategori */}
      <nav className="mb-8 flex flex-wrap gap-2">
        {(["Semua", ...ALL_CATEGORIES] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
              tab === t
                ? "bg-merah text-white shadow-lg shadow-red-900/20"
                : "border border-red-200 bg-white text-merah-tua hover:bg-red-50"
            }`}
          >
            {t}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                tab === t ? "bg-white/25" : "bg-red-100 text-merah"
              }`}
            >
              {jumlahTab(t)}
            </span>
          </button>
        ))}
      </nav>

      {/* Daftar Lomba */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-extrabold text-merah">
          🏆 Daftar Lomba{tab !== "Semua" ? ` — ${CATEGORY_LABELS[tab]}` : ""}
        </h2>
        <p className="mb-4 text-gray-600">
          Total <strong>{lombaTampil.length}</strong> lomba
          {tab !== "Semua" ? " di kategori ini" : " terdaftar"}.
        </p>
        <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="bg-merah text-white">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Lomba</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lombaTampil.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-400 italic"
                  >
                    Belum ada lomba di kategori ini.
                  </td>
                </tr>
              ) : (
                lombaTampil.map((l, i) => (
                  <tr
                    key={l.id}
                    className={`transition-colors duration-200 hover:bg-red-50 ${
                      i % 2 ? "bg-red-50/40" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold">{l.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {CATEGORY_LABELS[l.category]}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-600">
                      {l.description || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditLomba(l)}
                          disabled={busyId === l.id}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-merah-tua transition-colors hover:bg-red-50 disabled:opacity-60"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => hapusLomba(l)}
                          disabled={busyId === l.id}
                          className="rounded-lg bg-merah px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-merah-tua disabled:opacity-60"
                        >
                          {busyId === l.id ? "..." : "🗑️ Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tabel Peserta */}
      {tabPunyaPeserta && (
        <section>
          <h2 className="mb-1 text-xl font-extrabold text-merah">
            📝 Tabel Data Peserta
            {tab !== "Semua" ? ` — ${CATEGORY_LABELS[tab]}` : ""}
          </h2>
          <p className="mb-4 text-gray-600">
            Total <strong>{pesertaTampil.length}</strong> peserta
            {tab !== "Semua" ? " di kategori ini" : " terdaftar"}. Gunakan
            tombol hapus untuk membersihkan data ganda, kesalahan input umur,
            atau pembatalan sebelum nomor dada dicetak.
          </p>
          <div className="overflow-x-auto rounded-xl border border-red-100 bg-white shadow-sm">
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="bg-merah text-white">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Umur</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pesertaTampil.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-400 italic"
                    >
                      Belum ada peserta terdaftar.
                    </td>
                  </tr>
                ) : (
                  pesertaTampil.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`transition-colors duration-200 hover:bg-red-50 ${
                        i % 2 ? "bg-red-50/40" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold">{p.name}</td>
                      <td className="px-4 py-3">{p.age} th</td>
                      <td className="px-4 py-3">
                        {CATEGORY_LABELS[p.category]}
                      </td>
                      <td className="px-4 py-3">
                        Blok {p.block} No. {p.houseNumber}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => hapusPeserta(p)}
                          disabled={busyId === p.id}
                          className="rounded-lg bg-merah px-3 py-1.5 text-xs font-bold text-white hover:bg-merah-tua disabled:opacity-60"
                        >
                          {busyId === p.id
                            ? "Menghapus..."
                            : "🗑️ Hapus Peserta"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
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
