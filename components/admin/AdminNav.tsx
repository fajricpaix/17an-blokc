"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Home", emoji: "🏠" },
  { href: "/admin/keuangan", label: "Keuangan", emoji: "💰" },
] as const;

export function AdminNavDesktop() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 rounded-full bg-white/15 p-1 sm:flex">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
              active
                ? "bg-white text-primary shadow-sm"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            {item.emoji} {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminNavMobile() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-red-100 bg-white/95 shadow-[0_-4px_20px_-4px_rgba(158,12,36,0.15)] backdrop-blur-xl sm:hidden print:hidden">
      <div className="flex flex-1 items-stretch justify-around pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-transform duration-200 active:scale-90"
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full text-lg transition-all duration-300 ${
                  active
                    ? "-translate-y-0.5 scale-110 bg-linear-to-br from-dark-primary via-primary to-rose-600 text-white shadow-md shadow-red-900/30"
                    : "text-gray-400"
                }`}
              >
                {item.emoji}
              </span>
              <span
                className={`text-[11px] font-bold transition-colors duration-300 ${
                  active ? "text-primary" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
