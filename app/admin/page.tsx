import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import {
  getCompetitions,
  getKategoriAntarBlok,
  getParticipants,
  getPerwakilan,
  getRundowns,
} from "@/lib/db";
import AdminClient from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/login");
  }
  const [competitions, participants, kategoriAntarBlok, perwakilans, rundowns] =
    await Promise.all([
      getCompetitions(),
      getParticipants(),
      getKategoriAntarBlok(),
      getPerwakilan(),
      getRundowns(),
    ]);
  return (
    <AdminClient
      initialLombas={competitions}
      initialPesertas={participants}
      initialKategoriAntarBlok={kategoriAntarBlok}
      initialPerwakilans={perwakilans}
      initialRundowns={rundowns}
    />
  );
}
