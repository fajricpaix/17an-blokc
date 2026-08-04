import { AdminNavDesktop } from "./AdminNav";

export default function AdminHeader() {
  return (
    <header className="w-full sm:w-5xl mx-auto sm:mt-4 sm:rounded-3xl bg-linear-to-r from-dark-primary via-primary to-rose-600 bg-size-[200%_100%] px-4 py-8 text-white animate-gradient-x print:hidden">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            🛠️ Dashboard Panitia
          </h1>
          <p className="text-white/80">
            Manajemen Acara 17an Blok C Serpong Lagoon
          </p>
        </div>
        <AdminNavDesktop />
      </div>
    </header>
  );
}
