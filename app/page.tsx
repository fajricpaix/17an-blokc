import { getCompetitions, getParticipants } from "@/lib/db";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [competitions, participants] = await Promise.all([
    getCompetitions(),
    getParticipants(),
  ]);
  return (
    <HomeClient initialLombas={competitions} initialPesertas={participants} />
  );
}
