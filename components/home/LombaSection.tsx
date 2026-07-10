import {
  Competition,
  Participant,
  Category,
  CHILD_CATEGORIES,
  ADULT_CATEGORIES,
} from "@/lib/types";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import KategoriCard from "./KategoriCard";

export default function LombaSection({
  lombas,
  pesertas,
  onDaftarClick,
}: {
  lombas: Competition[];
  pesertas: Participant[];
  onDaftarClick: () => void;
}) {
  const lombaByKategori = (k: Category) =>
    lombas.filter((l) => l.category === k);
  const pesertaByKategori = (k: Category) =>
    pesertas.filter((p) => p.category === k);

  return (
    <section className="mb-14">
      <Reveal>
        <h2 className="mb-1 text-2xl font-extrabold text-primary sm:text-3xl">
          🏆 Jenis-Jenis Lomba
        </h2>
        <p className="mb-5 text-gray-600">
          Dikelompokkan berdasarkan kategori umur peserta.
        </p>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">
              🧒 Kategori Anak-Anak
            </h3>
            <p className="text-sm text-gray-600">
              Daftar peserta diperbarui otomatis <br /> 
              total{" "}
              <strong className="text-dark-primary">
                <CountUp value={pesertas.length} />
              </strong>{" "}
              anak terdaftar.
            </p>
          </div>
          <button
            onClick={onDaftarClick}
            className="rounded-full text-xs sm:text-sm bg-primary px-5 py-2.5 font-bold text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-dark-primary active:scale-95"
          >
            + Daftarkan Anak
          </button>
        </div>
      </Reveal>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHILD_CATEGORIES.map((k, i) => (
          <Reveal key={k} delay={i * 120} className="h-full">
            <KategoriCard
              kategori={k}
              lombas={lombaByKategori(k)}
              pesertas={pesertaByKategori(k)}
            />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className="mb-4 text-lg font-bold">
          👨‍👩‍👧 Kategori Dewasa &amp; Pasangan{" "}
        </h3>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADULT_CATEGORIES.map((k, i) => (
          <Reveal key={k} delay={i * 120} className="h-full">
            <KategoriCard kategori={k} lombas={lombaByKategori(k)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
