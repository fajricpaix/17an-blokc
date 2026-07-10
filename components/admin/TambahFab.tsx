"use client";

import { useEffect, useRef, useState } from "react";

const ACTIONS = [
  { key: "rundown", emoji: "📋", label: "Tambah Rundown Acara" },
  { key: "lomba", emoji: "🏆", label: "Tambah Jenis Lomba" },
] as const;

export default function TambahFab({
  onPilihLomba,
  onPilihRundown,
}: {
  onPilihLomba: () => void;
  onPilihRundown: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pilih(key: (typeof ACTIONS)[number]["key"]) {
    setOpen(false);
    if (key === "rundown") onPilihRundown();
    else onPilihLomba();
  }

  return (
    <div
      ref={rootRef}
      className="fixed right-6 bottom-6 z-40 flex flex-col items-end gap-3 print:hidden"
    >
      {open &&
        ACTIONS.map((a, i) => (
          <button
            key={a.key}
            type="button"
            role="menuitem"
            onClick={() => pilih(a.key)}
            style={{
              transitionDelay: `${(ACTIONS.length - 1 - i) * 70}ms`,
              animationDelay: `${(ACTIONS.length - 1 - i) * 70}ms`,
            }}
            className="animate-pop-in flex items-center gap-2.5 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-sm font-bold text-merah-tua shadow-lg shadow-red-900/15 ring-1 ring-red-100 transition-all duration-200 hover:-translate-x-1 hover:shadow-xl active:scale-95"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-merah-tua via-merah to-rose-600 text-base shadow-sm">
              {a.emoji}
            </span>
            {a.label}
          </button>
        ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Tambah data"
        className={`flex size-14 items-center justify-center rounded-full bg-linear-to-br from-merah-tua via-merah to-rose-600 text-3xl leading-none font-bold text-white shadow-lg shadow-red-900/30 transition-transform duration-300 hover:scale-110 active:scale-95 ${
          open ? "rotate-45" : ""
        }`}
      >
        +
      </button>
    </div>
  );
}
