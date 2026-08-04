import {
  getCompetitions,
  getKategoriAntarBlok,
  getParticipants,
  getPerwakilan,
  getRundowns,
  getSponsors,
} from "@/lib/db";
import AdminClient from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    competitions,
    participants,
    kategoriAntarBlok,
    perwakilans,
    rundowns,
    sponsors,
  ] = await Promise.all([
    getCompetitions(),
    getParticipants(),
    getKategoriAntarBlok(),
    getPerwakilan(),
    getRundowns(),
    getSponsors(),
  ]);
  return (
    <AdminClient
      initialLombas={competitions}
      initialPesertas={participants}
      initialKategoriAntarBlok={kategoriAntarBlok}
      initialPerwakilans={perwakilans}
      initialRundowns={rundowns}
      initialSponsors={sponsors}
    />
  );
}
