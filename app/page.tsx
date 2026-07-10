import { getCompetitions, getParticipants, getRundowns } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [competitions, participants, rundowns] = await Promise.all([
    getCompetitions(),
    getParticipants(),
    getRundowns(),
  ]);
  return (
    <HomeClient
      initialLombas={competitions}
      initialPesertas={participants}
      initialRundowns={rundowns}
    />
  );
}
