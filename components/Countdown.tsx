"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-08-16T14:00:00+07:00");

function hitungSisaWaktu() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
    jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
    menit: Math.floor((diff / (1000 * 60)) % 60),
    detik: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [sisa, setSisa] = useState<ReturnType<typeof hitungSisaWaktu>>(null);

  useEffect(() => {
    setMounted(true);
    setSisa(hitungSisaWaktu());
    const t = setInterval(() => setSisa(hitungSisaWaktu()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!mounted) return null;

  if (!sisa) {
    return (
      <p className="mt-7 text-lg font-bold">🎉 Acaranya sudah mulai!</p>
    );
  }

  const unit = [
    { label: "Hari", value: sisa.hari },
    { label: "Jam", value: sisa.jam },
    { label: "Menit", value: sisa.menit },
    { label: "Detik", value: sisa.detik },
  ];

  return (
    <div className="mx-auto mt-7 flex max-w-sm justify-center gap-2.5 sm:gap-3">
      {unit.map((u) => (
        <div
          key={u.label}
          className="flex-1 rounded-2xl border border-white/25 bg-white/10 py-2.5 text-center backdrop-blur"
        >
          <span className="block text-2xl font-black tabular-nums sm:text-3xl">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="block text-[10px] font-bold tracking-wide text-white/80 uppercase sm:text-xs">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
