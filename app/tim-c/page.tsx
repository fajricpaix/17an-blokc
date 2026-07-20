import { getKategoriAntarBlok, getPerwakilan } from "@/lib/db";
import TimCClient from "@/components/timc/TimCClient";

export const dynamic = "force-dynamic";

export default async function TimCPage() {
  const [kategoriAntarBlok, perwakilans] = await Promise.all([
    getKategoriAntarBlok(),
    getPerwakilan(),
  ]);
  return (
    <TimCClient
      initialKategoriAntarBlok={kategoriAntarBlok}
      initialPerwakilans={perwakilans}
    />
  );
}
