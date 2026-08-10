"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

export default function BannerAcaraSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  // Hormati setting aksesibilitas OS — kalau user aktifin reduce-motion,
  // idle float di bawah dimatikan total (tilt sentuhan tetap jalan, itu
  // hasil aksi langsung user jadi bukan termasuk "motion" yang mengganggu).
  const prefersReducedMotion = useReducedMotion();

  // Posisi jari relatif di atas kartu, 0..1 di tiap sumbu. Nilai awal 0.5
  // (tengah) = kartu datar/nggak miring pas belum disentuh.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // useSpring membuat rotasi "mengejar" posisi jari dengan pegas, bukan
  // langsung nempel — hasilnya kerasa lebih hidup/natural drpd transform
  // instan, dan otomatis animasi balik ke 0 pas jari dilepas (px/py di-reset).
  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), {
    stiffness: 260,
    damping: 24,
  });

  // "Glare" tipis yang ikut posisi jari — nambah kesan permukaan kartu
  // mengkilap/berlapis kaca, bukan cuma foto datar yang dimiringkan.
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4), transparent 55%)`;

  function updateTilt(e: React.PointerEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function resetTilt() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <section className="mb-14 sm:mx-auto sm:max-w-xl">
      <h2 className="mb-1 text-2xl sm:text-center font-extrabold text-primary sm:text-3xl">
        📢 Banner Acara
      </h2>
      <p className="sm:text-center mb-6 text-gray-600">
        Simpan &amp; sebarkan ke tetangga biar makin ramai!
      </p>

      {/* Wrapper luar ini yang ngurusin animasi ENTRANCE: pas kartu masuk
          viewport (di-scroll), dia "jatuh" dari kemiringan 28° ke rata,
          kayak kartu ditaruh ke meja. Ini efek utamanya buat mobile —
          semua orang scroll, jadi pasti kelihatan, beda dgn efek hover yg
          nggak ada gunanya di HP. */}
      <motion.div
        className="mx-auto max-w-70 sm:max-w-80"
        style={{ perspective: 1200 }}
        initial={{ opacity: 0, y: 40, rotateX: 28 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Lapisan IDLE FLOAT — jalan terus tanpa henti (loop infinite),
            walau user nggak ngapa-ngapain, biar kartunya kerasa "hidup"
            bukan gambar statis yang cuma bereaksi kalau disentuh. Naik-
            turun pelan (y) + miring dikit gantian (rotate) kayak
            mengambang di air. Dipisah dari layer tilt-sentuhan di bawah
            biar dua animasi ini nggak rebutan kontrol sumbu yang sama. */}
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -8, 0, 6, 0], rotate: [0, 0.8, 0, -0.7, 0] }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Kartu dalam ini yang ngurusin TILT interaktif — dimiringkan
              ngikutin posisi jari selama disentuh, balik rata pas dilepas.
              Sengaja PAKAI Pointer Events biasa (bukan touch-action:none),
              biar scroll halaman tetap jalan normal walau jari sempat
              menyentuh gambar ini pas nge-scroll lewat. */}
          <motion.div
            ref={cardRef}
            onPointerMove={updateTilt}
            onPointerDown={updateTilt}
            onPointerUp={resetTilt}
            onPointerLeave={resetTilt}
            onPointerCancel={resetTilt}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative select-none"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-4xl bg-linear-to-br from-dark-primary via-primary to-rose-500 opacity-25 blur-xl"
            />
            <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white p-1.5 shadow-xl shadow-red-900/15">
              <div className="relative aspect-1131/1600 w-full overflow-hidden rounded-xl">
                <Image
                  src="/banner-acara.JPG"
                  alt="Banner Acara 17an Blok C Serpong Lagoon"
                  fill
                  sizes="(min-width: 640px) 20rem, 17.5rem"
                  className="object-cover"
                  priority
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: glareBackground }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
