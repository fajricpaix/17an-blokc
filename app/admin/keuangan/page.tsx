import { getKeuangan } from "@/lib/db";
import KeuanganClient from "@/components/admin/KeuanganClient";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  const keuangan = await getKeuangan();
  return <KeuanganClient initialKeuangan={keuangan} />;
}
