import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="-mx-4 sm:mx-0 sm:mt-4 sm:rounded-3xl bg-linear-to-r from-merah-tua via-merah to-rose-600 bg-size-[200%_100%] px-4 py-8 text-white animate-gradient-x print:hidden">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          🛠️ Dashboard Panitia
        </h1>
        <p className="text-white/80">
          Manajemen Acara 17an Blok C Serpong Lagoon
        </p>
      </div>
    </header>
  );
}
