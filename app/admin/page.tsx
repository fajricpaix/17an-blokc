import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCompetitions, getParticipants } from "@/lib/db";
import AdminClient from "@/components/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/login");
  }
  const [competitions, participants] = await Promise.all([
    getCompetitions(),
    getParticipants(),
  ]);
  return (
    <AdminClient
      initialLombas={competitions}
      initialPesertas={participants}
    />
  );
}
