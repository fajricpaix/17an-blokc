"use client";

export default function KritikSaranFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Kirim Kritik & Saran"
      title="Kirim Kritik & Saran"
      className="fixed left-1/2 z-50 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br from-dark-primary via-primary to-rose-600 text-3xl leading-none font-bold text-white shadow-lg shadow-red-900/30 transition-transform duration-300 bottom-[calc(2.5rem+env(safe-area-inset-bottom))] hover:scale-110 active:scale-95 sm:right-6 sm:bottom-6 sm:left-auto sm:z-30 sm:translate-x-0 print:hidden"
    >
      📝
    </button>
  );
}
