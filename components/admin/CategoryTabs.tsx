"use client";

import { useEffect, useRef, useState } from "react";
import { Category, ALL_CATEGORIES } from "@/lib/types";

export type Tab = "Semua" | Category;

const OPTIONS = ["Semua", ...ALL_CATEGORIES] as Tab[];

export default function CategoryTabs({
  tab,
  onTabChange,
  jumlahTab,
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  jumlahTab: (t: Tab) => number;
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

  return (
    <div ref={rootRef} className="relative w-full print:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-dark-primary shadow-sm transition-colors duration-200 hover:bg-red-50"
      >
        <span className="flex items-center gap-2">
          {tab}
          <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-primary">
            {jumlahTab(tab)}
          </span>
        </span>
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
          className="absolute z-20 mt-2 w-full animate-pop-in overflow-hidden rounded-2xl border border-red-100 bg-white p-1.5 shadow-xl shadow-red-900/10"
        >
          {OPTIONS.map((t) => (
            <li key={t} role="option" aria-selected={tab === t}>
              <button
                type="button"
                onClick={() => {
                  onTabChange(t);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors duration-150 ${
                  tab === t
                    ? "bg-primary text-white"
                    : "text-dark-primary hover:bg-red-50"
                }`}
              >
                {t}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    tab === t ? "bg-white/25" : "bg-red-100 text-primary"
                  }`}
                >
                  {jumlahTab(t)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
