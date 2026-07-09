import { Category, ALL_CATEGORIES } from "@/lib/types";

export type Tab = "Semua" | Category;

export default function CategoryTabs({
  tab,
  onTabChange,
  jumlahTab,
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  jumlahTab: (t: Tab) => number;
}) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 print:hidden">
      {(["Semua", ...ALL_CATEGORIES] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
            tab === t
              ? "bg-merah text-white shadow-lg shadow-red-900/20"
              : "border border-red-200 bg-white text-merah-tua hover:bg-red-50"
          }`}
        >
          {t}
          <span
            className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
              tab === t ? "bg-white/25" : "bg-red-100 text-merah"
            }`}
          >
            {jumlahTab(t)}
          </span>
        </button>
      ))}
    </nav>
  );
}
