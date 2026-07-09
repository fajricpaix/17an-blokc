import Link from "next/link";

export default function AdminHeader({
  onTambahLombaClick,
  onLogout,
}: {
  onTambahLombaClick: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="-mx-4 mb-8 bg-linear-to-r from-merah-tua via-merah to-rose-600 bg-size-[200%_100%] px-4 py-8 text-white animate-gradient-x print:hidden">
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
            onClick={onTambahLombaClick}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-merah transition-all duration-300 hover:scale-105 hover:bg-red-50 active:scale-95"
          >
            + Tambah Jenis Lomba
          </button>
          <button
            onClick={onLogout}
            className="rounded-full border-2 border-white/50 px-4 py-2 text-sm font-bold text-white/80 hover:bg-white/10"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
