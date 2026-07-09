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
