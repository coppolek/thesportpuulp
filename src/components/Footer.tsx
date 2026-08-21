import { CATEGORIES } from "../data/categories";
import { Brand } from "./Masthead";
import { ArrowUpIcon } from "./icons";

interface FooterProps {
  onSelect: (id: string) => void;
}

export default function Footer({ onSelect }: FooterProps) {
  return (
    <footer className="border-t border-line bg-pitch-900/60">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1.1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-chalk-dim">
            Il campo dove ogni sport trova il suo video: highlights, clip e momenti che fanno
            saltare dalla sedia, organizzati per reparto e pronti al fischio d'inizio.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-chalk-dim">
            <span className="inline-block h-1.5 w-1.5 bg-lime" />
            Powered by YouTube Data API v3
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-lime">
            /// Categorie
          </h4>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className="text-left text-sm font-semibold uppercase tracking-wide text-chalk-dim transition-colors hover:text-lime"
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-lime">
            /// Regolamento di campo
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-chalk-dim">
            <li>I video sono incorporati da YouTube e restano di proprietà dei rispettivi canali.</li>
            <li>
              Usa <span className="font-sans font-bold text-xs text-lime">TOP / RECENTI</span> per cambiare
              l'ordinamento del reparto attivo.
            </li>
            <li>
              Il tasto <span className="font-sans font-bold text-xs text-lime">↻</span> richiama il cronometro
              e aggiorna i video dalla rete.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-chalk-dim">
            © 2026 Arena Sport — fischio d'inizio dato a Milano
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 border border-line px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-chalk-dim transition-colors hover:border-lime hover:text-lime"
          >
            <ArrowUpIcon className="h-3.5 w-3.5" />
            Torna in tribuna
          </button>
        </div>
      </div>
    </footer>
  );
}
