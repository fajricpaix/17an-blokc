import Link from "next/link";

export default function TimCHeroSection({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header className="relative -mx-4 mb-12 overflow-hidden bg-linear-to-br from-dark-primary via-primary to-rose-500 bg-size-[200%_200%] px-4 pt-16 pb-20 text-center text-white animate-gradient-x">
      {/* dekorasi melayang */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-10 size-48 rounded-full bg-white/10 blur-2xl animate-float-slow"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -bottom-7.5 size-64 rounded-full bg-rose-300/20 blur-3xl animate-float"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-10 right-[12%] text-4xl opacity-70 animate-float"
      >
        ⚽
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-[10%] text-4xl opacity-70 animate-float-slow"
      >
        🏆
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[4%] hidden text-3xl opacity-60 animate-float sm:block"
      >
        🎾
      </span>

      <div className="relative mx-auto max-w-3xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur animate-fade-up">
          <span className="inline-block origin-bottom-left animate-wave">
            🏅
          </span>
          Wakil Blok C
        </p>
        <h1 className="text-4xl font-black drop-shadow-sm sm:text-6xl animate-fade-up [animation-delay:120ms]">
          Tim C
          <span className="mt-1 block bg-linear-to-r from-white via-rose-100 to-white bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl">
            Lomba Antar Blok
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-white/90 animate-fade-up [animation-delay:240ms]">
          Daftarkan diri jadi perwakilan Blok C di berbagai cabang lomba
          tingkat lingkungan. Satu peserta boleh ikut lebih dari satu cabor!
        </p>
        {isAdmin && (
          <div className="mt-5 text-sm animate-fade-up [animation-delay:480ms]">
            <Link
              href="/admin"
              className="underline decoration-white/50 underline-offset-4 transition-colors hover:text-rose-100"
            >
              Buka Dashboard Panitia →
            </Link>
          </div>
        )}
      </div>

      {/* lengkung bawah */}
      <svg
        aria-hidden
        className="absolute bottom-0 left-0 w-full text-secondary"
        viewBox="0 0 1440 48"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0 48h1440V16c-120 21-360 32-720 32S120 37 0 16v32z" />
      </svg>
    </header>
  );
}
