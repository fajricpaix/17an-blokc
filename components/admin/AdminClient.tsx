"use client";

import { useRef, useState } from "react";
import KategoriAntarBlokSection, {
  KategoriAntarBlokSectionHandle,
} from "@/components/kategori-antar-blok/KategoriAntarBlokSection";
import LombaSection, {
  LombaSectionHandle,
} from "@/components/lomba/LombaSection";
import RundownSection, {
  RundownSectionHandle,
} from "@/components/rundown/RundownSection";
import SponsorSection, {
  SponsorSectionHandle,
} from "@/components/sponsor/SponsorSection";
import {
  Competition,
  KategoriAntarBlok,
  Participant,
  Perwakilan,
  Rundown,
  Sponsor,
} from "@/lib/types";
import TambahFab from "./TambahFab";

export default function AdminClient({
  initialLombas,
  initialPesertas,
  initialKategoriAntarBlok,
  initialPerwakilans,
  initialRundowns,
  initialSponsors,
}: {
  initialLombas: Competition[];
  initialPesertas: Participant[];
  initialKategoriAntarBlok: KategoriAntarBlok[];
  initialPerwakilans: Perwakilan[];
  initialRundowns: Rundown[];
  initialSponsors: Sponsor[];
}) {
  const [notif, setNotif] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function tampilkanNotif(pesan: string) {
    setNotif(pesan);
    setTimeout(() => setNotif(""), 4000);
  }

  const rundownRef = useRef<RundownSectionHandle>(null);
  const kategoriAntarBlokRef = useRef<KategoriAntarBlokSectionHandle>(null);
  const lombaRef = useRef<LombaSectionHandle>(null);
  const sponsorRef = useRef<SponsorSectionHandle>(null);

  return (
    <>
      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-red-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-dark-primary shadow-2xl shadow-red-900/10 backdrop-blur print:hidden">
          {notif}
        </div>
      )}

      <TambahFab
        onPilihLomba={() => lombaRef.current?.bukaTambah()}
        onPilihRundown={() => rundownRef.current?.bukaTambah()}
        onPilihKategoriAntarBlok={() =>
          kategoriAntarBlokRef.current?.bukaTambah()
        }
        onPilihSponsor={() => sponsorRef.current?.bukaTambah()}
      />

      <RundownSection
        ref={rundownRef}
        initialRundowns={initialRundowns}
        busyId={busyId}
        setBusyId={setBusyId}
        tampilkanNotif={tampilkanNotif}
      />

      <div className="mb-4 pt-6 border-t border-primary print:hidden">
        <KategoriAntarBlokSection
          ref={kategoriAntarBlokRef}
          initialKategoriAntarBlok={initialKategoriAntarBlok}
          initialPerwakilans={initialPerwakilans}
          busyId={busyId}
          setBusyId={setBusyId}
          tampilkanNotif={tampilkanNotif}
        />
      </div>

      <LombaSection
        ref={lombaRef}
        initialLombas={initialLombas}
        initialPesertas={initialPesertas}
        busyId={busyId}
        setBusyId={setBusyId}
        tampilkanNotif={tampilkanNotif}
      />

      <div className="mb-4 pt-6 border-t border-primary print:hidden">
        <SponsorSection
          ref={sponsorRef}
          initialSponsors={initialSponsors}
          busyId={busyId}
          setBusyId={setBusyId}
          tampilkanNotif={tampilkanNotif}
        />
      </div>
    </>
  );
}
