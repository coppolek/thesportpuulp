import { useEffect, useState } from "react";
import { formatClock } from "../lib/format";
import { SearchIcon } from "./icons";
import type { SiteSettings } from "../lib/settings";

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums text-lime">{formatClock(now)}</span>;
}

export function Brand({ settings }: { settings?: SiteSettings }) {
  const name = settings?.niche || "Arena Sport";
  const firstWord = name.split(" ")[0] || "Arena";
  const remainingWords = name.substring(firstWord.length).trim() || "Sport";
  const initial = firstWord.charAt(0).toUpperCase() || "A";

  return (
    <a href="#top" className="group flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center bg-lime font-display text-2xl text-pitch-950 shadow-[4px_4px_0_rgba(216,243,74,0.25)] transition-transform duration-200 [transform:skewX(-8deg)] group-hover:[transform:skewX(-8deg)_translateY(-2px)]">
        <span className="[transform:skewX(8deg)]">{initial}</span>
      </span>
      <span className="leading-none">
        <span className="block font-display text-4xl font-black italic tracking-tighter skew-item uppercase">
          {firstWord} <span className="text-lime">{remainingWords}</span>
        </span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.4em] text-chalk-dim font-bold">
          Video portale tematico
        </span>
      </span>
    </a>
  );
}

interface MastheadProps {
  settings: SiteSettings;
  categoryLabel: string;
  videoCount: number;
  categoryCount: number;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function Masthead({ settings, categoryLabel, videoCount, categoryCount, searchQuery, onSearch }: MastheadProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  const titleParts = settings.niche.split(" ");
  const titleLast = titleParts.pop();
  const titleStart = titleParts.join(" ");

  return (
    <header className="relative overflow-hidden border-b border-line">
      {/* parola fantasma di sfondo */}
      <span
        aria-hidden="true"
        className="ghost-word pointer-events-none absolute -bottom-10 -left-10 text-white/[0.03] text-huge font-black select-none"
      >
        {titleLast?.toUpperCase() || "VIDEO"}
      </span>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 pb-8 sm:pt-8 sm:pb-14 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Brand settings={settings} />
          <p className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-chalk-dim md:flex">
            <span className="inline-block h-1.5 w-1.5 bg-lime" />
            Dati · YouTube Data API v3
          </p>
        </div>

        <div className="mt-8 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:mt-14 lg:gap-8">
          <div className="z-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-lime font-bold mb-2">
              /// Palinsesto video
            </p>
            <h1 className="mt-4 font-display text-4xl font-black italic tracking-tighter skew-item uppercase leading-[0.85] sm:text-6xl md:text-7xl lg:text-[84px] mb-6 sm:mb-8">
              Il meglio da YouTube.
              <br />
              Un solo <span className="text-lime">posto.</span>
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-chalk-dim">
              {settings.tagline} Scegli il tuo reparto, premi play: al resto pensa il cronometro.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md items-center border border-line bg-white/[0.02]">
              <input 
                type="text" 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Cerca video..." 
                className="w-full bg-transparent px-4 py-3 text-sm text-chalk focus:outline-none placeholder-chalk-dim/50" 
              />
              <button type="submit" className="grid w-12 place-items-center text-chalk-dim hover:text-lime transition-colors">
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* tabellone segnapunti */}
          <div className="z-10 w-full border border-line bg-white/[0.02] p-5 sm:p-8 lg:max-w-sm lg:w-[320px]">
            <div className="flex items-center justify-between border-b border-line px-2 sm:px-4 py-2.5 mb-5 sm:mb-6">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-blaze">
                <span className="relative flex h-2 w-2">
                  <span className="ping-ring absolute inline-flex h-full w-full bg-blaze" />
                  <span className="live-dot relative inline-flex h-2 w-2 bg-blaze" />
                </span>
                In onda
              </span>
              <span className="text-[10px] uppercase tracking-wider text-chalk-dim font-bold">
                <LiveClock />
              </span>
            </div>
            <dl className="space-y-4 px-4 font-sans text-sm font-bold uppercase tracking-tight">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[10px] text-chalk-dim tracking-widest opacity-50">Reparto</dt>
                <dd className="text-right text-lime">{categoryLabel}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[10px] text-chalk-dim tracking-widest opacity-50">Video in campo</dt>
                <dd className="text-chalk tabular-nums">
                  {videoCount > 0 ? videoCount : "—"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[10px] text-chalk-dim tracking-widest opacity-50">Categorie</dt>
                <dd className="text-chalk tabular-nums">{categoryCount}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[10px] text-chalk-dim tracking-widest opacity-50">Stato</dt>
                <dd className="text-gold">Pronti al via</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </header>
  );
}
