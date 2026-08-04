export type Category =
  | "PAUD-TK"
  | "SD Kecil"
  | "SD Besar"
  | "Anak Muda"
  | "Orang Dewasa";

export const CHILD_CATEGORIES: Category[] = [
  "PAUD-TK",
  "SD Kecil",
  "SD Besar",
  "Anak Muda",
];
export const ADULT_CATEGORIES: Category[] = ["Orang Dewasa"];
export const ALL_CATEGORIES: Category[] = [
  ...CHILD_CATEGORIES,
  ...ADULT_CATEGORIES,
];

export interface Competition {
  id: string;
  name: string;
  category: Category;
  description: string;
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  block: string;
  houseNumber: string;
  category: Category;
  registeredAt: string;
}

export interface Rundown {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

export function categoryFromAge(age: number): Category {
  if (age <= 5) return "PAUD-TK";
  if (age <= 9) return "SD Kecil";
  if (age <= 12) return "SD Besar";
  return "Anak Muda";
}

export const CATEGORY_LABELS: Record<Category, string> = {
  "PAUD-TK": "PAUD - TK",
  "SD Kecil": "SD Kecil - Kelas 1-3 SD",
  "SD Besar": "SD Besar - Kelas 4-6 SD",
  "Anak Muda": "Anak Muda - Usia 13-17 Tahun",
  "Orang Dewasa": "Orang Dewasa",
};

// Lomba antar blok: perlombaan tingkat RW/lingkungan yang diikuti Blok C
// sebagai perwakilan, terpisah dari lomba internal Blok C di atas.
// Jenis lombanya dikelola dinamis lewat admin (bukan daftar tetap),
// jadi disimpan sebagai data (nama + ikon) bukan union type.
export interface KategoriAntarBlok {
  id: string;
  name: string;
  icon: string;
  // Tanggal pelaksanaan lomba (opsional, format ISO "YYYY-MM-DD").
  tanggalMulai?: string;
  tanggalSelesai?: string;
  // Kalau true, peserta baru tidak bisa lagi ditambahkan ke cabor ini.
  locked?: boolean;
}

// Nama kategori yang butuh input kelas peserta saat pendaftaran perwakilan.
export const KATEGORI_ANTAR_BLOK_BUTUH_KELAS = "Futsal Junior";

export interface Perwakilan {
  id: string;
  name: string;
  // Kelas hanya diisi jika salah satu categories == KATEGORI_ANTAR_BLOK_BUTUH_KELAS.
  kelas?: string;
  block: string;
  houseNumber: string;
  // Satu peserta bisa ikut lebih dari satu cabor.
  categories: string[];
  registeredAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  // Path publik ke file logo, mis. "/sponsor/bank-serpong-172233.png".
  logoUrl: string;
  createdAt: string;
  // Kalau false, sponsor disembunyikan dari twibbon & footer publik.
  // Undefined (sponsor lama) diperlakukan sebagai aktif.
  active?: boolean;
}

export type JenisKeuangan = "Donasi" | "Pengeluaran";

// Pos pengeluaran acara 17an, dipilih saat mencatat transaksi jenis Pengeluaran.
export type KategoriPengeluaran =
  | "Hadiah"
  | "Konsumsi 17an"
  | "Acara & Perlengkapan"
  | "Perlengkapan Lomba dan Perform"
  | "Panitia & Registrasi"
  | "Tenaga Lapangan";

export const KATEGORI_PENGELUARAN: KategoriPengeluaran[] = [
  "Hadiah",
  "Konsumsi 17an",
  "Acara & Perlengkapan",
  "Perlengkapan Lomba dan Perform",
  "Panitia & Registrasi",
  "Tenaga Lapangan",
];

// Sesi konsumsi, dipilih saat kategoriPengeluaran == "Konsumsi 17an".
export type WaktuKonsumsi = "Sore" | "Malam";

export const WAKTU_KONSUMSI: WaktuKonsumsi[] = ["Sore", "Malam"];

export interface KeuanganEntry {
  id: string;
  // Tanggal transaksi, format ISO "YYYY-MM-DD".
  tanggal: string;
  keterangan: string;
  jenis: JenisKeuangan;
  jumlah: number;
  createdAt: string;
  // Wajib diisi untuk jenis "Donasi": alamat rumah donatur, mis. "Blok C No. 12".
  alamatRumah?: string;
  // Wajib diisi untuk jenis "Pengeluaran": pos pengeluarannya.
  kategoriPengeluaran?: KategoriPengeluaran;
  // Wajib diisi untuk jenis "Pengeluaran": rincian satuan, jumlah = jumlahSatuan * hargaSatuan.
  jumlahSatuan?: number;
  hargaSatuan?: number;
  // Wajib diisi untuk kategoriPengeluaran == "Konsumsi 17an": sesi konsumsinya.
  waktuKonsumsi?: WaktuKonsumsi;
}
