/** Decodifica le entità HTML presenti nei titoli/descrizioni dell'API YouTube. */
export function decodeHtml(input: string): string {
  if (!input) return "";
  try {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent ?? input;
  } catch {
    return input;
  }
}

/** "PT1H2M3S" -> "1:02:03" · "PT4M33S" -> "4:33" */
export function formatDuration(iso: string | null): string {
  if (!iso) return "";
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const s = Number(m[3] ?? 0);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${min}:${String(s).padStart(2, "0")}`;
}

/** 1234567 -> "1,2 mln" (notazione compatta it-IT) */
export function formatViews(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("it-IT", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** ISO -> "12 gen 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatClock(d: Date): string {
  return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
