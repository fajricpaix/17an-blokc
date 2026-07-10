"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login gagal. Coba lagi.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h1 className="mb-1 text-center text-2xl font-extrabold text-primary">
            🔐 Area Panitia
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Acara 17an Blok C Serpong Lagoon
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Email / Username Panitia
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="panitia@blokc.id"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-primary">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-dark-primary hover:shadow-lg active:scale-95 disabled:opacity-60"
            >
              {loading ? "Memeriksa..." : "Masuk Area Panitia"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-primary underline hover:text-dark-primary">
            ← Kembali ke Halaman Utama
          </Link>
        </p>
      </div>
    </main>
  );
}
