import { KategoriAntarBlok, Perwakilan } from "@/lib/types";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import PerwakilanCard from "./PerwakilanCard";

export default function PerwakilanSection({
  kategoriList,
  perwakilans,
  onDaftarClick,
}: {
  kategoriList: KategoriAntarBlok[];
  perwakilans: Perwakilan[];
  onDaftarClick: (kategori: KategoriAntarBlok) => void;
}) {
  const perwakilanByKategori = (k: KategoriAntarBlok) =>
    perwakilans.filter((p) => p.categories.includes(k.name));

  return (
    <section className="mb-14">
      <Reveal>
        <h2 className="mb-1 text-2xl font-extrabold text-primary sm:text-3xl">
          🏅 Lomba Antar Blok
        </h2>
        <p className="mb-5 text-gray-600">
          Daftar perlombaan tingkat lingkungan yang diikuti Blok C sebagai
          perwakilan. Total{" "}
          <strong className="text-dark-primary">
            <CountUp value={perwakilans.length} />
          </strong>{" "}
          perwakilan sudah terdaftar.
        </p>
      </Reveal>
      {kategoriList.length === 0 ? (
        <Reveal>
          <p className="rounded-2xl border border-dashed border-red-200 bg-white px-5 py-8 text-center text-sm text-gray-400 italic">
            Kategori lomba antar blok belum tersedia.
          </p>
        </Reveal>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kategoriList.map((k, i) => (
            <Reveal key={k.id} delay={i * 120} className="h-full">
              <PerwakilanCard
                kategori={k}
                pesertas={perwakilanByKategori(k)}
                onDaftarClick={() => onDaftarClick(k)}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
