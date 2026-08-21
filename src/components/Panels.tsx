import { AlertIcon, RefreshIcon, WhistleIcon } from "./icons";

export function SkeletonCard() {
  return (
    <div className="border border-line bg-pitch-900">
      <div className="skeleton aspect-video" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <section className="border-b border-line bg-pitch-900/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-44" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div>
            <div className="skeleton aspect-video w-full border border-line" />
            <div className="skeleton mt-5 h-8 w-4/5" />
            <div className="skeleton mt-3 h-4 w-2/5" />
            <div className="skeleton mt-4 h-3 w-full max-w-2xl" />
            <div className="skeleton mt-2 h-3 w-5/6 max-w-2xl" />
            <div className="skeleton mt-6 h-10 w-52" />
          </div>
          <div className="hidden border border-line bg-pitch-950/70 p-3 lg:block">
            <div className="skeleton mb-3 h-5 w-2/3" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-3 flex gap-3">
                <div className="skeleton h-14 w-24 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ErrorPanelProps {
  message: string;
  onRetry: () => void;
}

export function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <div className="border border-blaze/50 bg-blaze/10 p-7 sm:p-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <AlertIcon className="h-11 w-11 shrink-0 text-blaze" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blaze">
            /// Fischio dell'arbitro
          </p>
          <h3 className="mt-1.5 font-display text-3xl font-black italic tracking-tighter skew-item uppercase text-chalk sm:text-4xl">
            Fuorigioco tecnico
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-chalk-dim">{message}</p>
          <p className="mt-2 text-xs text-chalk-dim/80">
            Suggerimento: verifica la connessione, oppure attendi qualche minuto — la quota
            giornaliera dell'API si ricarica allo scoccare della mezzanotte (ora del Pacifico).
          </p>
          <button
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 bg-white text-black px-12 py-5 text-xs font-black uppercase tracking-[0.2em] border border-white transition-all duration-200 hover:bg-blaze hover:border-blaze hover:text-white active:translate-y-px"
          >
            <RefreshIcon className="h-4 w-4" />
            Riprova il lancio
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyPanel() {
  return (
    <div className="border border-line bg-pitch-900/70 p-10 text-center">
      <WhistleIcon className="mx-auto h-10 w-10 text-chalk-dim" />
      <h3 className="mt-4 font-display text-2xl font-black italic tracking-tighter skew-item uppercase text-chalk">Nessun fischio d'inizio</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-chalk-dim">
        Nessun video trovato per questo reparto. Prova a cambiare ordinamento oppure scegli
        un'altra categoria dalla tribuna qui sopra.
      </p>
    </div>
  );
}
