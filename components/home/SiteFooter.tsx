"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { Sponsor } from "@/lib/types";

export default function SiteFooter() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Sponsor[]) =>
        setSponsors(list.filter((s) => s.active !== false))
      )
      .catch(() => {
        // biarkan tanpa sponsor kalau gagal dimuat
      });
  }, []);

  return (
    <Reveal>
      <footer className="mt-20 border-t border-red-100 pt-8 pb-2 text-center text-sm text-gray-500">
        {sponsors.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-bold tracking-wide text-transparent uppercase bg-linear-to-r from-dark-primary via-primary to-rose-600 bg-clip-text">
              Sponsor 17an Pelican C
            </p>
            {sponsors.length > 5 ? (
              <div className="group relative overflow-hidden">
                <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
                  {[...sponsors, ...sponsors].map((s, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${s.id}-${i}`}
                      src={s.logoUrl}
                      alt={s.name}
                      title={s.name}
                      className="w-20 h-auto shrink-0 rounded-lg border border-red-100 bg-white object-contain shadow-sm"
                    />
                  ))}
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-secondary to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-secondary to-transparent"
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-4">
                {sponsors.map((s) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={s.id}
                    src={s.logoUrl}
                    alt={s.name}
                    title={s.name}
                    className="w-20 h-auto rounded-lg border border-red-100 bg-white object-contain shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <span className="mb-2 block text-2xl">🇮🇩</span>
        Panitia 17an Blok C Pelican &mdash; Serpong Lagoon
      </footer>
    </Reveal>
  );
}
