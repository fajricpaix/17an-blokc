import { getKritikSaran } from "@/lib/db";
import KritikSaranClient from "@/components/kritik-saran/KritikSaranClient";

export const dynamic = "force-dynamic";

export default async function KritikSaranPage() {
  const kritikSaran = await getKritikSaran();
  return <KritikSaranClient initialKritikSaran={kritikSaran} />;
}
