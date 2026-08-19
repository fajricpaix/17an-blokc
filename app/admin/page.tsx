import {
  getCompetitions,
  getKategoriAntarBlok,
  getParticipants,
  getPerwakilan,
  getRundowns,
  getSponsors,
  getTahunRundownList,
} from "@/lib/db";
import AdminClient from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rundownTahunList = await getTahunRundownList();
  const rundownTahunParam =
    typeof params.rundownTahun === "string" ? params.rundownTahun : undefined;
  const rundownTahun =
    rundownTahunParam && /^\d{4}$/.test(rundownTahunParam)
      ? rundownTahunParam
      : (rundownTahunList[0] ?? String(new Date().getFullYear()));

  const [competitions, participants, kategoriAntarBlok, perwakilans, rundowns, sponsors] =
    await Promise.all([
      getCompetitions(),
      getParticipants(),
      getKategoriAntarBlok(),
      getPerwakilan(),
      getRundowns(rundownTahun),
      getSponsors(),
    ]);
  return (
    <AdminClient
      initialLombas={competitions}
      initialPesertas={participants}
      initialKategoriAntarBlok={kategoriAntarBlok}
      initialPerwakilans={perwakilans}
      initialRundowns={rundowns}
      rundownTahun={rundownTahun}
      rundownTahunList={
        rundownTahunList.includes(rundownTahun)
          ? rundownTahunList
          : [rundownTahun, ...rundownTahunList]
      }
      initialSponsors={sponsors}
    />
  );
}
