import { getKeuangan, getTahunKeuanganList } from "@/lib/db";
import KeuanganClient from "@/components/keuangan/KeuanganClient";

export const dynamic = "force-dynamic";

export default async function KeuanganPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const tahunList = await getTahunKeuanganList();
  const tahunParam =
    typeof params.tahun === "string" ? params.tahun : undefined;
  const tahun =
    tahunParam && /^\d{4}$/.test(tahunParam)
      ? tahunParam
      : (tahunList[0] ?? String(new Date().getFullYear()));
  const keuangan = await getKeuangan(tahun);

  return (
    <KeuanganClient
      initialKeuangan={keuangan}
      tahun={tahun}
      tahunList={tahunList.includes(tahun) ? tahunList : [tahun, ...tahunList]}
    />
  );
}
