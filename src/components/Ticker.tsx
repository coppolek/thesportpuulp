interface TickerProps {
  items: string[];
}

/** Striscia "breaking" che scorre in loop; si ferma al passaggio del mouse. */
export default function Ticker({ items }: TickerProps) {
  return (
    <div className="ticker-zone relative z-30 overflow-hidden bg-lime text-pitch-950">
      <div className="ticker-track flex w-max items-center whitespace-nowrap py-1.5">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em]"
            aria-hidden={copy === 1}
          >
            {items.map((t, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-5">{t}</span>
                <span className="opacity-50">///</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
