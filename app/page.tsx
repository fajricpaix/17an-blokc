import { getCompetitions, getParticipants, getRundowns } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tahun = String(new Date().getFullYear());
  const [competitions, participants, rundowns] = await Promise.all([
    getCompetitions(),
    getParticipants(),
    getRundowns(tahun),
  ]);
  return (
    <HomeClient
      initialLombas={competitions.filter((l) => l.active !== false)}
      initialPesertas={participants}
      initialRundowns={rundowns}
    />
  );
}
