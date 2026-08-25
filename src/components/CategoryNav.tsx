import { getIcon, type Category } from "../data/categories";
import type { Order } from "../lib/youtube";
import { RefreshIcon, SettingsIcon } from "./icons";

interface CategoryNavProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  order: Order;
  onOrder: (o: Order) => void;
  onRefresh: () => void;
  onSettings: () => void;
  loading: boolean;
}

export default function CategoryNav({
  categories,
  activeId,
  onSelect,
  order,
  onOrder,
  onRefresh,
  onSettings,
  loading,
}: CategoryNavProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-pitch-950/95 backdrop-blur-sm">
      {/* Indicatore gradiente per scroll su mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-pitch-950 to-transparent pointer-events-none md:hidden" />
      <div className="relative mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6">
        <span className="mr-1 hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] text-chalk-dim lg:block">
          Campo //
        </span>

        {categories.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              aria-pressed={active}
              className={`shrink-0 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] border transition-all duration-200 ${
                active
                  ? "bg-lime text-pitch-950 border-lime"
                  : "border-line text-chalk-dim hover:bg-white/[0.05] hover:text-chalk"
              }`}
            >
              <span className="flex items-center gap-2">
                {getIcon(c.iconName)}
                {c.label}
              </span>
            </button>
          );
        })}

        <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
          <div className="flex items-center border border-line text-[10px] font-bold uppercase tracking-widest bg-pitch-950">
            <button
              onClick={() => onOrder("relevance")}
              className={`px-3 py-2 transition-colors hidden sm:block ${
                order === "relevance"
                  ? "bg-lime text-pitch-950"
                  : "text-chalk-dim hover:text-chalk"
              }`}
            >
              Top
            </button>
            <button
              onClick={() => onOrder("date")}
              className={`px-3 py-2 transition-colors hidden sm:block ${
                order === "date" ? "bg-lime text-pitch-950" : "text-chalk-dim hover:text-chalk"
              }`}
            >
              Recenti
            </button>
            <button
              onClick={() => onOrder("viewCount")}
              className={`px-3 py-2 transition-colors hidden sm:block ${
                order === "viewCount" ? "bg-lime text-pitch-950" : "text-chalk-dim hover:text-chalk"
              }`}
            >
              Più Visti
            </button>
            <button
              onClick={() => onOrder("rating")}
              className={`px-3 py-2 transition-colors hidden md:block ${
                order === "rating" ? "bg-lime text-pitch-950" : "text-chalk-dim hover:text-chalk"
              }`}
            >
              Più Votati
            </button>
            <select
              value={order}
              onChange={(e) => onOrder(e.target.value as Order)}
              className="sm:hidden bg-pitch-900 text-chalk px-2 py-1.5 outline-none font-bold uppercase border-none text-[10px] tracking-wider"
            >
              <option value="relevance" className="bg-pitch-950">Top</option>
              <option value="date" className="bg-pitch-950">Recenti</option>
              <option value="viewCount" className="bg-pitch-950">Più Visti</option>
              <option value="rating" className="bg-pitch-950">Più Votati</option>
            </select>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Aggiorna i video del reparto"
            className="grid h-[34px] w-[34px] place-items-center border border-line text-chalk-dim transition-colors hover:border-lime hover:text-lime disabled:opacity-40"
          >
            <RefreshIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onSettings}
            title="Impostazioni API"
            className="grid h-[34px] w-[34px] place-items-center border border-line text-chalk-dim transition-colors hover:border-lime hover:text-lime"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
