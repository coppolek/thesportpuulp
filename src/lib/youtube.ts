import { decodeHtml } from "./format";

const DEFAULT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyCKu0X2pU36YIy1tg234sibWLeClMvoldA";
const BASE = "https://www.googleapis.com/youtube/v3";

export function getApiKey(): string {
  return localStorage.getItem("YOUTUBE_API_KEY") || DEFAULT_API_KEY;
}

export function setApiKey(key: string) {
  if (key) {
    localStorage.setItem("YOUTUBE_API_KEY", key);
  } else {
    localStorage.removeItem("YOUTUBE_API_KEY");
  }
  cache.clear();
}

export type Order = "relevance" | "date" | "viewCount" | "rating";

export interface Video {
  id: string;
  title: string;
  description: string;
  channel: string;
  publishedAt: string;
  thumbnail: string;
  duration: string | null;
  views: number | null;
}

export interface FetchVideosResult {
  videos: Video[];
  nextPageToken?: string;
}

/** Cache in memoria: niente chiamate duplicate (la quota search costa cara). */
const cache = new Map<string, FetchVideosResult>();

async function readError(res: Response): Promise<string> {
  let msg = `Errore YouTube API (HTTP ${res.status})`;
  try {
    const j = await res.json();
    const detail: string | undefined = j?.error?.message;
    if (detail) msg = detail;
    if (res.status === 403 && /quota/i.test(detail ?? "")) {
      msg = "Quota giornaliera della YouTube API esaurita. Riprova più tardi.";
    }
  } catch {
    /* corpo non JSON */
  }
  return msg;
}

export async function fetchCategoryVideos(
  query: string,
  order: Order,
  useCache = true,
  pageToken?: string
): Promise<FetchVideosResult> {
  const key = `${query}::${order}::${pageToken || ''}`;
  if (useCache && cache.has(key)) return cache.get(key) as FetchVideosResult;

  const searchUrl = new URL(`${BASE}/search`);
  const params: Record<string, string> = {
    part: "snippet",
    type: "video",
    q: query,
    order,
    maxResults: "24",
    key: getApiKey(),
    relevanceLanguage: "it",
    regionCode: "IT",
    videoEmbeddable: "true",
    safeSearch: "none",
  };
  if (pageToken) {
    params.pageToken = pageToken;
  }
  searchUrl.search = new URLSearchParams(params).toString();

  const sRes = await fetch(searchUrl.toString());
  if (!sRes.ok) throw new Error(await readError(sRes));
  const sJson = await sRes.json();

  const items: any[] = (sJson.items ?? []).filter((i: any) => i?.id?.videoId);
  if (items.length === 0) return { videos: [], nextPageToken: undefined };

  // Secondo passaggio (costo 1 unità): durata + visualizzazioni reali.
  const ids = items.map((i) => i.id.videoId).join(",");
  const vUrl = new URL(`${BASE}/videos`);
  vUrl.search = new URLSearchParams({
    part: "contentDetails,statistics",
    id: ids,
    key: getApiKey(),
  }).toString();

  const details = new Map<string, { duration?: string; views?: string }>();
  try {
    const vRes = await fetch(vUrl.toString());
    if (vRes.ok) {
      const vJson = await vRes.json();
      for (const it of vJson.items ?? []) {
        details.set(it.id, {
          duration: it?.contentDetails?.duration,
          views: it?.statistics?.viewCount,
        });
      }
    }
  } catch {
    /* dettagli opzionali: si procede anche senza */
  }

  const videos: Video[] = items.map((i: any) => {
    const d = details.get(i.id.videoId);
    return {
      id: i.id.videoId,
      title: decodeHtml(i.snippet.title),
      description: decodeHtml(i.snippet.description),
      channel: decodeHtml(i.snippet.channelTitle),
      publishedAt: i.snippet.publishedAt,
      thumbnail:
        i.snippet.thumbnails?.medium?.url ??
        i.snippet.thumbnails?.default?.url ??
        `https://i.ytimg.com/vi/${i.id.videoId}/mqdefault.jpg`,
      duration: d?.duration ?? null,
      views: d?.views ? Number(d.views) : null,
    };
  });

  const result: FetchVideosResult = {
    videos,
    nextPageToken: sJson.nextPageToken,
  };
  cache.set(key, result);
  return result;
}

export async function fetchTrendingVideos(): Promise<Video[]> {
  const key = "trending::sports";
  if (cache.has(key)) return (cache.get(key) as FetchVideosResult).videos;

  const url = new URL(`${BASE}/videos`);
  url.search = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    regionCode: "IT",
    videoCategoryId: "17", // 17 is the Sports category in YouTube
    maxResults: "5",
    key: getApiKey(),
  }).toString();

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await readError(res));
  const json = await res.json();

  const videos: Video[] = (json.items ?? []).map((i: any) => ({
    id: i.id,
    title: decodeHtml(i.snippet?.title || ""),
    channel: decodeHtml(i.snippet?.channelTitle || ""),
    description: decodeHtml(i.snippet?.description || ""),
    thumbnail: i.snippet?.thumbnails?.medium?.url || i.snippet?.thumbnails?.default?.url || `https://i.ytimg.com/vi/${i.id}/mqdefault.jpg`,
    publishedAt: i.snippet?.publishedAt || "",
    duration: i.contentDetails?.duration || null,
    views: i.statistics?.viewCount ? Number(i.statistics.viewCount) : null,
  }));

  cache.set(key, { videos });
  return videos;
}

export async function fetchVideoById(id: string): Promise<Video | null> {
  const vUrl = new URL(`${BASE}/videos`);
  vUrl.search = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    id,
    key: getApiKey(),
  }).toString();

  const vRes = await fetch(vUrl.toString());
  if (!vRes.ok) return null;
  const vJson = await vRes.json();
  const item = vJson.items?.[0];
  if (!item) return null;

  return {
    id: item.id,
    title: decodeHtml(item.snippet.title),
    description: decodeHtml(item.snippet.description),
    channel: decodeHtml(item.snippet.channelTitle),
    publishedAt: item.snippet.publishedAt,
    thumbnail:
      item.snippet.thumbnails?.medium?.url ??
      item.snippet.thumbnails?.default?.url ??
      `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`,
    duration: item.contentDetails?.duration ?? null,
    views: item.statistics?.viewCount ? Number(item.statistics.viewCount) : null,
  };
}
