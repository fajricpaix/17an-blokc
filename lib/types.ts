export type Category =
  | "PAUD-TK"
  | "SD Kecil"
  | "SD Besar"
  | "Bapak"
  | "Ibu"
  | "Pasangan";

export const CHILD_CATEGORIES: Category[] = ["PAUD-TK", "SD Kecil", "SD Besar"];
export const ADULT_CATEGORIES: Category[] = ["Bapak", "Ibu", "Pasangan"];
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
  if (age <= 6) return "PAUD-TK";
  if (age <= 9) return "SD Kecil";
  return "SD Besar";
}

export const CATEGORY_LABELS: Record<Category, string> = {
  "PAUD-TK": "PAUD - TK",
  "SD Kecil": "SD Kecil - Kelas 1-3 SD",
  "SD Besar": "SD Besar - Kelas 4-6 SD",
  Bapak: "Bapak-Bapak",
  Ibu: "Ibu-Ibu",
  Pasangan: "Pasangan (Suami-Istri)",
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
