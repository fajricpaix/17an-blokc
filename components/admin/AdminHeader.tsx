import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="-mx-4 mb-4 bg-linear-to-r from-merah-tua via-merah to-rose-600 bg-size-[200%_100%] px-4 py-8 text-white animate-gradient-x print:hidden">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full border-2 border-white px-4 py-2 text-sm font-bold hover:bg-white/10"
          >
            ← Halaman Utama
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            🛠️ Dashboard Panitia
          </h1>
          <p className="text-white/80">
            Manajemen Acara 17an Blok C Serpong Lagoon
          </p>
        </div>

      </div>
    </header>
  );
}
