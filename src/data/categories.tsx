import type { ReactNode } from "react";

export interface Category {
  id: string;
  label: string;
  query: string;
  tagline: string;
  icon: ReactNode;
}

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icon = (children: ReactNode): ReactNode => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" {...S} aria-hidden="true">
    {children}
  </svg>
);

export const CATEGORIES: Category[] = [
  {
    id: "calcio",
    label: "Calcio",
    query: "calcio Serie A gol highlights",
    tagline: "Gol, highlights e le grandi sfide del rettangolo verde",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5l4.3 3.1-1.6 5H9.3l-1.6-5z" />
        <path d="M12 3v4.5M20.6 9.2l-4.3 1.4M17.4 20.3l-2.7-4.7M6.6 20.3l2.7-4.7M3.4 9.2l4.3 1.4" />
      </>
    ),
  },
  {
    id: "basket",
    label: "Basket",
    query: "basket NBA Eurolega highlights",
    tagline: "Schiacciate, buzzer beater e parquet che trema",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
        <path d="M5.6 5.6c3.6 3.6 3.6 9.2 0 12.8M18.4 5.6c-3.6 3.6-3.6 9.2 0 12.8" />
      </>
    ),
  },
  {
    id: "tennis",
    label: "Tennis",
    query: "tennis ATP WTA highlights",
    tagline: "Dritti lungolinea, tie-break e terra rossa",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M5.5 4.8c3.2 2.2 5.2 5.1 5.2 7.2s-2 5-5.2 7.2" />
        <path d="M18.5 4.8c-3.2 2.2-5.2 5.1-5.2 7.2s2 5 5.2 7.2" />
      </>
    ),
  },
  {
    id: "motori",
    label: "Motori & F1",
    query: "Formula 1 MotoGP highlights gara",
    tagline: "Semafori spenti, sorpassi e bandiere a scacchi",
    icon: icon(
      <>
        <path d="M5 21V4" />
        <path d="M5 4.5h13.5l-3 4.25 3 4.25H5" />
        <path d="M8.5 4.5v8.5M12.5 4.5l-1.4 8.5" />
      </>
    ),
  },
  {
    id: "ciclismo",
    label: "Ciclismo",
    query: "ciclismo Giro d'Italia Tour de France highlights",
    tagline: "Fughe, gran premi della montagna e volate di gruppo",
    icon: icon(
      <>
        <circle cx="5.5" cy="17" r="3.4" />
        <circle cx="18.5" cy="17" r="3.4" />
        <path d="M5.5 17l4-8h5l4 8M9.5 9h6" />
        <path d="M9.5 9 8 5h-2M12.5 9l-1.8-4h2.6" />
      </>
    ),
  },
  {
    id: "volley",
    label: "Pallavolo",
    query: "pallavolo SuperLega volley highlights",
    tagline: "Muri, pipe e schiacciate sopra il nastro",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3c.5 3.4-.3 6.9-2.5 9.7-1.9 2.5-4.5 4.2-7.2 4.9" />
        <path d="M20.9 14.7c-3.3-.6-6.3-2.4-8.4-5.2-1.3-1.7-2.1-3.7-2.4-5.9" />
        <path d="M6.5 20.4c2-2.6 4.9-4.3 8.1-4.8 2.7-.4 5.4 0 7.7 1.2" />
      </>
    ),
  },
  {
    id: "nuoto",
    label: "Nuoto",
    query: "nuoto swimming finals highlights",
    tagline: "Corsia libera, virate e record in vasca",
    icon: icon(
      <>
        <circle cx="17" cy="6.6" r="2.1" />
        <path d="M2.5 13.5 9 10l4.4 2.4 4.1-2.4" />
        <path d="M2 18.4c2.4 1.6 5 1.6 7.4 0s5-1.6 7.4 0 3.4 1.1 5.2.6" />
      </>
    ),
  },
  {
    id: "atletica",
    label: "Atletica",
    query: "atletica leggera sprint salto highlights",
    tagline: "Cronometri, corsie e centesimi che fanno la storia",
    icon: icon(
      <>
        <circle cx="12" cy="13.5" r="7.5" />
        <path d="M12 6V3.8M9.8 3.8h4.4" />
        <path d="M12 13.5l2.9-2.9" />
        <path d="M18.7 7.3l1.3-1.3" />
      </>
    ),
  },
  {
    id: "usa-nfl",
    label: "USA NFL",
    query: "NFL football highlights",
    tagline: "Touchdown, sack e lo spettacolo del football americano",
    icon: icon(
      <>
        <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(45 12 12)" />
        <path d="M9.5 9.5l5 5M10.5 8.5l1 1M13.5 11.5l1 1M8.5 10.5l1 1M11.5 13.5l1 1" />
      </>
    ),
  },
  {
    id: "usa-nba",
    label: "USA NBA",
    query: "NBA highlights",
    tagline: "Il grande spettacolo del basket a stelle e strisce",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
        <path d="M5.6 5.6c3.6 3.6 3.6 9.2 0 12.8M18.4 5.6c-3.6 3.6-3.6 9.2 0 12.8" />
      </>
    ),
  },
  {
    id: "usa-mlb",
    label: "USA MLB",
    query: "MLB baseball highlights",
    tagline: "Fuoricampo, strikeout e la magia del diamante",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.5 9A10 10 0 0 1 12 5M20.5 9A10 10 0 0 0 12 5M3.5 15A10 10 0 0 0 12 19M20.5 15A10 10 0 0 1 12 19" />
      </>
    ),
  },
];
