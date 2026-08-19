"use client";

import { useEffect, useRef, useState } from "react";

export default function TahunSwitcher({
  tahun,
  tahunList,
  onGanti,
}: {
  tahun: string;
  tahunList: string[];
  onGanti: (tahun: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
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

  function pilih(t: string) {
    setOpen(false);
    onGanti(t);
  }

  function tambahTahunBaru() {
    setOpen(false);
    const input = prompt("Tahun baru (contoh: 2027):");
    const t = input?.trim();
    if (!t || !/^\d{4}$/.test(t)) return;
    onGanti(t);
  }

  return (
    <div className="my-4 flex items-center gap-2 print:hidden">
      <span className="text-sm font-semibold text-dark-primary">Tahun:</span>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-1.5 text-sm font-bold text-dark-primary shadow-sm transition-colors duration-200 hover:bg-red-50"
        >
          {tahun}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-4 shrink-0 text-primary transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-20 mt-2 w-40 animate-pop-in overflow-hidden rounded-2xl border border-red-100 bg-white p-1.5 shadow-xl shadow-red-900/10"
          >
            {tahunList.map((t) => (
              <li key={t} role="option" aria-selected={tahun === t}>
                <button
                  type="button"
                  onClick={() => pilih(t)}
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
  );
}
