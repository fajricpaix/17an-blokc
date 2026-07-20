"use client";

export default function TwibbonFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buat Twibbon 17 Agustus"
      title="Buat Twibbon 17 Agustus"
      className="fixed right-5 bottom-24 z-30 flex size-14 items-center justify-center rounded-full bg-linear-to-br from-dark-primary via-primary to-rose-600 text-3xl leading-none font-bold text-white shadow-lg shadow-red-900/30 transition-transform duration-300 hover:scale-110 active:scale-95 sm:right-6 sm:bottom-6 print:hidden"
    >
      +
    </button>
  );
}
