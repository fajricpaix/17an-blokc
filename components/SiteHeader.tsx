"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-white/85 shadow-lg shadow-red-900/5" : "bg-white/60"
      }`}
    >
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex">
            <span
              aria-hidden
              className="absolute -inset-0.75 rounded-full bg-[conic-gradient(from_0deg,#c8102e,#ffffff,#c8102e)] opacity-90 animate-[spin_6s_linear_infinite]"
            />
            <Image
              src="/logo.webp"
              alt="Logo Blok C Serpong Lagoon"
              width={48}
              height={48}
              priority
              className={`relative rounded-full object-cover ring-2 ring-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                scrolled ? "size-10" : "size-12"
              }`}
            />
          </span>
          <span className="leading-tight">
            <span className="block bg-linear-to-r from-dark-primary via-primary to-rose-500 bg-clip-text text-base font-extrabold text-transparent sm:text-lg">
              17an Blok C
            </span>
            <span className="block text-[11px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
              Serpong Lagoon
            </span>
          </span>
        </Link>

        {isAdmin ? (
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-1.5 text-sm font-bold text-primary shadow-sm transition-colors duration-200 hover:bg-red-50"
          >
            Keluar
          </button>
        ) : (
          <span className="items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-1.5 text-sm font-bold text-primary shadow-sm inline-flex">
            <span className="inline-block origin-bottom-left animate-wave">
              🇮🇩
            </span>
            Dirgahayu RI
          </span>
        )}
      </div>
      <div className="h-0.75 w-full bg-[linear-gradient(90deg,#c8102e,#ff5a5f,#ffffff,#ff5a5f,#c8102e)] bg-size-[200%_100%] animate-gradient-x" />
    </header>
  );
}
