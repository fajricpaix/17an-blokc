import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function BannerAcaraSection() {
  return (
    <Reveal className="sm:max-w-xl sm:mx-auto">
      <section className="mb-14">
        <h2 className="mb-1 text-2xl sm:text-center font-extrabold text-primary sm:text-3xl">
          📢 Banner Acara
        </h2>
        <p className="sm:text-center mb-6 text-gray-600">
          Simpan &amp; sebarkan ke tetangga biar makin ramai!
        </p>

        <div className="group relative mx-auto max-w-70 sm:max-w-80">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-4xl bg-linear-to-br from-dark-primary via-primary to-rose-500 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40"
          />
          <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white p-1.5 shadow-lg shadow-red-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/20">
            <div className="relative aspect-1131/1600 w-full overflow-hidden rounded-xl">
              <Image
                src="/banner-acara.JPG"
                alt="Banner Acara 17an Blok C Serpong Lagoon"
                fill
                sizes="(min-width: 640px) 20rem, 17.5rem"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
