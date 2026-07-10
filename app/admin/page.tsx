import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCompetitions, getParticipants, getRundowns } from "@/lib/db";
import AdminClient from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/login");
  }
  const [competitions, participants, rundowns] = await Promise.all([
    getCompetitions(),
    getParticipants(),
    getRundowns(),
  ]);
  return (
    <AdminClient
      initialLombas={competitions}
      initialPesertas={participants}
      initialRundowns={rundowns}
    />
  );
}
