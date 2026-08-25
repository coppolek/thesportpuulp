import type { ReactNode } from "react";

export interface Category {
  id: string;
  label: string;
  query: string;
  tagline: string;
  iconName: string;
}

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const iconWrapper = (children: ReactNode): ReactNode => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" {...S} aria-hidden="true">
    {children}
  </svg>
);

export const ICONS: Record<string, ReactNode> = {
  calcio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l4.3 3.1-1.6 5H9.3l-1.6-5z" />
      <path d="M12 3v4.5M20.6 9.2l-4.3 1.4M17.4 20.3l-2.7-4.7M6.6 20.3l2.7-4.7M3.4 9.2l4.3 1.4" />
    </>
  ),
  basket: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
      <path d="M5.6 5.6c3.6 3.6 3.6 9.2 0 12.8M18.4 5.6c-3.6 3.6-3.6 9.2 0 12.8" />
    </>
  ),
  tennis: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 4.8c3.2 2.2 5.2 5.1 5.2 7.2s-2 5-5.2 7.2" />
      <path d="M18.5 4.8c-3.2 2.2-5.2 5.1-5.2 7.2s2 5 5.2 7.2" />
    </>
  ),
  motori: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4.5h13.5l-3 4.25 3 4.25H5" />
      <path d="M8.5 4.5v8.5M12.5 4.5l-1.4 8.5" />
    </>
  ),
  ciclismo: (
    <>
      <circle cx="5.5" cy="17" r="3.4" />
      <circle cx="18.5" cy="17" r="3.4" />
      <path d="M5.5 17l4-8h5l4 8M9.5 9h6" />
      <path d="M9.5 9 8 5h-2M12.5 9l-1.8-4h2.6" />
    </>
  ),
  volley: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c.5 3.4-.3 6.9-2.5 9.7-1.9 2.5-4.5 4.2-7.2 4.9" />
      <path d="M20.9 14.7c-3.3-.6-6.3-2.4-8.4-5.2-1.3-1.7-2.1-3.7-2.4-5.9" />
      <path d="M6.5 20.4c2-2.6 4.9-4.3 8.1-4.8 2.7-.4 5.4 0 7.7 1.2" />
    </>
  ),
  nuoto: (
    <>
      <circle cx="17" cy="6.6" r="2.1" />
      <path d="M2.5 13.5 9 10l4.4 2.4 4.1-2.4" />
      <path d="M2 18.4c2.4 1.6 5 1.6 7.4 0s5-1.6 7.4 0 3.4 1.1 5.2.6" />
    </>
  ),
  atletica: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 6V3.8M9.8 3.8h4.4" />
      <path d="M12 13.5l2.9-2.9" />
      <path d="M18.7 7.3l1.3-1.3" />
    </>
  ),
  nfl: (
    <>
      <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(45 12 12)" />
      <path d="M9.5 9.5l5 5M10.5 8.5l1 1M13.5 11.5l1 1M8.5 10.5l1 1M11.5 13.5l1 1" />
    </>
  ),
  mlb: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9A10 10 0 0 1 12 5M20.5 9A10 10 0 0 0 12 5M3.5 15A10 10 0 0 0 12 19M20.5 15A10 10 0 0 1 12 19" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  game: (
    <>
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </>
  ),
  tech: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </>
  ),
  movie: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </>
  ),
  default: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  )
};

export function getIcon(name: string): ReactNode {
  return iconWrapper(ICONS[name] || ICONS.default);
}

export const CATEGORIES: Category[] = [
  {
    id: "calcio",
    label: "Calcio",
    query: "calcio Serie A gol highlights",
    tagline: "Gol, highlights e le grandi sfide del rettangolo verde",
    iconName: "calcio",
  },
  {
    id: "basket",
    label: "Basket",
    query: "basket NBA Eurolega highlights",
    tagline: "Schiacciate, buzzer beater e parquet che trema",
    iconName: "basket",
  },
  {
    id: "tennis",
    label: "Tennis",
    query: "tennis ATP WTA highlights",
    tagline: "Dritti lungolinea, tie-break e terra rossa",
    iconName: "tennis",
  },
  {
    id: "motori",
    label: "Motori & F1",
    query: "Formula 1 MotoGP highlights gara",
    tagline: "Semafori spenti, sorpassi e bandiere a scacchi",
    iconName: "motori",
  },
  {
    id: "ciclismo",
    label: "Ciclismo",
    query: "ciclismo Giro d'Italia Tour de France highlights",
    tagline: "Fughe, gran premi della montagna e volate di gruppo",
    iconName: "ciclismo",
  },
  {
    id: "volley",
    label: "Pallavolo",
    query: "pallavolo SuperLega volley highlights",
    tagline: "Muri, pipe e schiacciate sopra il nastro",
    iconName: "volley",
  },
  {
    id: "nuoto",
    label: "Nuoto",
    query: "nuoto swimming finals highlights",
    tagline: "Corsia libera, virate e record in vasca",
    iconName: "nuoto",
  },
  {
    id: "atletica",
    label: "Atletica",
    query: "atletica leggera sprint salto highlights",
    tagline: "Cronometri, corsie e centesimi che fanno la storia",
    iconName: "atletica",
  },
  {
    id: "usa-nfl",
    label: "USA NFL",
    query: "NFL football highlights",
    tagline: "Touchdown, sack e lo spettacolo del football americano",
    iconName: "nfl",
  },
  {
    id: "usa-nba",
    label: "USA NBA",
    query: "NBA highlights",
    tagline: "Il grande spettacolo del basket a stelle e strisce",
    iconName: "basket",
  },
  {
    id: "usa-mlb",
    label: "USA MLB",
    query: "MLB baseball highlights",
    tagline: "Fuoricampo, strikeout e la magia del diamante",
    iconName: "mlb",
  },
];
