import { getKeuangan } from "@/lib/db";
import KeuanganClient from "@/components/keuangan/KeuanganClient";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  const keuangan = await getKeuangan();
  return <KeuanganClient initialKeuangan={keuangan} />;
}
