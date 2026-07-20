import { KategoriAntarBlok } from "./types";

export function formatTanggal(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function rentangTanggalKategori(k: KategoriAntarBlok) {
  if (!k.tanggalMulai) return null;
  if (!k.tanggalSelesai || k.tanggalSelesai === k.tanggalMulai) {
    return formatTanggal(k.tanggalMulai);
  }
  return `${formatTanggal(k.tanggalMulai)} - ${formatTanggal(k.tanggalSelesai)}`;
}
