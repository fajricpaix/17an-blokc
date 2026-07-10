import Reveal from "@/components/Reveal";
import { Rundown } from "@/lib/types";

function formatJam(waktu: string) {
  return waktu.replace(":", ".");
}

export default function RundownSection({
  rundowns,
}: {
  rundowns: Rundown[];
}) {
  return (
    <Reveal className="sm:max-w-xl sm:mx-auto">
      <section className="mb-14">
        <h2 className="mb-1 text-2xl sm:text-center font-extrabold text-primary sm:text-3xl">
          📋 Rundown 17an Blok C
        </h2>
        <p className="sm:text-center mb-6 text-gray-600">
          {rundowns.length > 0
            ? `Susunan ${rundowns.length} kegiatan dari pagi hingga malam puncak, urut waktu.`
            : "Susunan kegiatan dari pagi hingga malam puncak."}
        </p>

        {rundowns.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-red-200 bg-white px-5 py-8 text-center text-sm text-gray-400 italic">
            Rundown acara belum tersedia.
          </p>
        ) : (
          <ol className="relative space-y-4">
            <div
              aria-hidden
              className="absolute top-2 bottom-2 left-4 w-0.5 bg-linear-to-b from-dark-primary via-primary to-rose-200 sm:left-5"
            />
            {rundowns.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <li className="relative flex gap-4 pb-6 last:pb-0 sm:gap-5">
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-dark-primary via-primary to-rose-600 text-xs font-extrabold text-white shadow-sm ring-4 ring-secondary sm:size-10 sm:text-sm">
                    {i + 1}
                  </div>
                  <div className="group flex-1 rounded-2xl border border-red-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5 sm:p-5">
                    <span className="mb-1.5 inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-dark-primary">
                      {formatJam(r.startTime)} - {formatJam(r.endTime)}
                    </span>
                    <h3 className="font-bold capitalize text-dark-primary">{r.title}</h3>
                    {r.description && (
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                        {r.description}
                      </p>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        )}
      </section>
    </Reveal>
  );
}
