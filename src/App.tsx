import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { fetchCategoryVideos, fetchVideoById, type Order, type Video } from "./lib/youtube";
import { formatClock } from "./lib/format";
import Ticker from "./components/Ticker";
import Masthead from "./components/Masthead";
import CategoryNav from "./components/CategoryNav";
import TrendingSection from "./components/TrendingSection";
import RecentlyWatchedSection from "./components/RecentlyWatchedSection";
import Featured from "./components/Featured";
import VideoCard from "./components/VideoCard";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import { EmptyPanel, ErrorPanel, FeaturedSkeleton, SkeletonCard } from "./components/Panels";
import SettingsModal from "./components/SettingsModal";
import { BellIcon, CloseIcon } from "./components/icons";
import { subscribeToSettings, SiteSettings, DEFAULT_SETTINGS } from "./lib/settings";

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activeId, setActiveId] = useState(settings.categories[0]?.id || "");
  const [order, setOrder] = useState<Order>("date");
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newVideoToast, setNewVideoToast] = useState<{ video: Video, message: string } | null>(null);
  const [featuredId, setFeaturedId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("v");
    }
    return null;
  });
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const seq = useRef(0);

  useEffect(() => {
    return subscribeToSettings((newSettings) => {
      setSettings(newSettings);
      setActiveId((currentId) => {
        // If current category was deleted, fallback to the first one
        if (!newSettings.categories.some(c => c.id === currentId)) {
          return newSettings.categories[0]?.id || "";
        }
        return currentId;
      });
    });
  }, []);

  const [recentlyWatched, setRecentlyWatched] = useState<Video[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("arena_sport_recent");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const activeCat = useMemo(
    () => settings.categories.find((c) => c.id === activeId) ?? settings.categories[0],
    [activeId]
  );

  const load = useCallback(
    async (bypassCache = false) => {
      const cat = settings.categories.find((c) => c.id === activeId) ?? settings.categories[0];
      const q = searchQuery || cat.query;
      const ticket = ++seq.current;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCategoryVideos(q, order, !bypassCache);
        if (seq.current !== ticket) return;
        
        let list = res.videos;
        setNextPageToken(res.nextPageToken);

        let currentFeatured: string | null = null;
        setFeaturedId(current => {
          currentFeatured = current;
          return current;
        });

        if (currentFeatured && !list.some(v => v.id === currentFeatured)) {
          const customVid = await fetchVideoById(currentFeatured);
          if (customVid) {
            list = [customVid, ...list];
          }
        }
        
        if (seq.current !== ticket) return;

        setVideos(list);
        setFeaturedId(current => {
          if (current && list.some(v => v.id === current)) return current;
          return list[0]?.id ?? null;
        });
        setUpdatedAt(new Date());
      } catch (e) {
        if (seq.current !== ticket) return;
        setError(e instanceof Error ? e.message : "Errore sconosciuto durante la chiamata API.");
      } finally {
        if (seq.current === ticket) setLoading(false);
      }
    },
    [activeId, order, searchQuery]
  );

  const loadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    const cat = settings.categories.find((c) => c.id === activeId) ?? settings.categories[0];
    const q = searchQuery || cat.query;
    
    setLoadingMore(true);
    try {
      const res = await fetchCategoryVideos(q, order, true, nextPageToken);
      setVideos(prev => {
        const newVids = res.videos.filter(v => !prev.some(p => p.id === v.id));
        return [...prev, ...newVids];
      });
      setNextPageToken(res.nextPageToken);
    } catch (e) {
      console.error("Failed to load more:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void load();
  }, [load]);

  // Controlla nuovi highlights in background
  useEffect(() => {
    if (searchQuery) return; // Non facciamo polling durante le ricerche manuali

    const cat = settings.categories.find((c) => c.id === activeId) ?? settings.categories[0];
    const isHighlights = cat.query.toLowerCase().includes("highlights");
    
    if (isHighlights && !loading && !error && videos.length > 0) {
      const topVideoId = videos[0].id;

      const timer = setInterval(async () => {
        try {
          // bypassCache = true per cercare dati freschi su YouTube
          const res = await fetchCategoryVideos(cat.query, order, false);
          if (res.videos.length > 0) {
            const latestVideo = res.videos[0];
            // Se l'id del video più recente non corrisponde a quello che abbiamo, è nuovo!
            if (latestVideo.id !== topVideoId) {
              setNewVideoToast({
                video: latestVideo,
                message: "Nuovo video highlights disponibile!"
              });
            }
          }
        } catch (e) {
          // silenzioso in background
        }
      }, 60000); // 1 minuto

      return () => clearInterval(timer);
    }
  }, [activeId, order, searchQuery, loading, error, videos]);

  const scrollToPlayer = () => {
    document.getElementById("player")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategory = (id: string) => {
    setSearchQuery("");
    if (id === activeId) {
      scrollToPlayer();
      return;
    }
    setActiveId(id);
    requestAnimationFrame(scrollToPlayer);
  };

  const handleSelect = (v: Video) => {
    setFeaturedId(v.id);
    window.history.pushState({}, "", `?v=${v.id}`);
    scrollToPlayer();

    setRecentlyWatched(prev => {
      const filtered = prev.filter(item => item.id !== v.id);
      const updated = [v, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("arena_sport_recent", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save recently watched:", err);
      }
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentlyWatched([]);
    try {
      localStorage.removeItem("arena_sport_recent");
    } catch (err) {
      console.error("Failed to clear recently watched:", err);
    }
  };

  const featured = videos.find((v) => v.id === featuredId) ?? videos[0] ?? null;
  const queue = useMemo(
    () => (featured ? videos.filter((v) => v.id !== featured.id) : []),
    [videos, featured]
  );

  const tickerItems = useMemo(
    () => [
      "Highlights e clip in tempo reale",
      ...settings.categories.map((c) => c.label.toUpperCase()),
      "Aggiornato in diretta da YouTube",
      "8 discipline · un solo fischio d'inizio",
    ],
    []
  );

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip font-body text-chalk">
      {featured && (
        <Helmet>
          <title>{featured.title.replace(/"/g, '&quot;')} - ARENA SPORT</title>
          <meta property="og:type" content="video.other" />
          <meta property="og:title" content={featured.title.replace(/"/g, '&quot;')} />
          <meta property="og:description" content={`Guarda ${featured.title.replace(/"/g, '&quot;')} di ${featured.channel.replace(/"/g, '&quot;')} su ARENA SPORT`} />
          <meta property="og:image" content={featured.thumbnail} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={featured.title.replace(/"/g, '&quot;')} />
          <meta name="twitter:image" content={featured.thumbnail} />
        </Helmet>
      )}
      {/* strati ambientali */}
      <div aria-hidden="true" className="pitch-lines pointer-events-none fixed inset-0 opacity-40" />
      <div aria-hidden="true" className="noise-layer pointer-events-none fixed inset-0 z-[1]" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(216,243,74,0.07),transparent_70%)]"
      />

      <div className="relative z-10">
        <Ticker items={tickerItems} />
        <Masthead settings={settings}
          categoryLabel={searchQuery ? "Ricerca" : activeCat.label}
          videoCount={videos.length}
          categoryCount={settings.categories.length}
          searchQuery={searchQuery}
          onSearch={(q) => {
            setSearchQuery(q);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
        <CategoryNav categories={settings.categories}
          activeId={activeId}
          onSelect={handleCategory}
          order={order}
          onOrder={setOrder}
          onRefresh={() => void load(true)}
          onSettings={() => setShowSettings(true)}
          loading={loading}
        />

        <main>
          {/* sezione in onda */}
          <div id="player" className="scroll-mt-[68px]">
            {loading ? (
              <FeaturedSkeleton />
            ) : error ? (
              <section className="border-b border-line bg-pitch-900/50">
                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
                  <ErrorPanel message={error} onRetry={() => void load(true)} />
                </div>
              </section>
            ) : featured ? (
              <Featured
                video={featured}
                queue={queue}
                categoryName={searchQuery ? "Ricerca" : activeCat.label}
                onSelect={handleSelect}
              />
            ) : (
              <section className="border-b border-line bg-pitch-900/50">
                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
                  <EmptyPanel />
                </div>
              </section>
            )}
          </div>

          <TrendingSection activeId={featuredId} onSelect={handleSelect} />
          <RecentlyWatchedSection activeId={featuredId} videos={recentlyWatched} onSelect={handleSelect} onClear={handleClearRecent} />

          {/* griglia del reparto */}
          <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <Reveal>
                <p className="text-[10px] uppercase tracking-[0.4em] text-lime font-bold">
                  /// Reparto video
                </p>
                <h2 className="mt-2.5 font-display text-5xl font-black italic tracking-tighter skew-item uppercase leading-[0.85] sm:text-6xl lg:text-7xl">
                  {searchQuery ? `Ricerca: "${searchQuery}"` : activeCat.label}
                </h2>
                <p className="mt-3.5 max-w-md text-sm leading-relaxed text-chalk-dim">
                  {searchQuery ? `Risultati personalizzati per "${searchQuery}"` : activeCat.tagline} —{" "}
                  {order === "date" ? "ordinati dal fischio più recente." : order === "viewCount" ? "ordinati per numero di visualizzazioni." : order === "rating" ? "ordinati per gradimento degli utenti." : "i più rilevanti del momento."}
                </p>
              </Reveal>

              <Reveal delay={120} className="text-left sm:text-right">
                <div className="font-display text-6xl font-black italic tracking-tighter skew-item leading-none text-lime tabular-nums sm:text-7xl">
                  {loading ? "–" : String(videos.length).padStart(2, "0")}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-chalk-dim font-bold">
                  Video in campo
                  {updatedAt && !loading && <span> · agg. {formatClock(updatedAt)}</span>}
                </div>
              </Reveal>
            </div>

            <div className="mt-9">
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <p className="border border-line bg-white/[0.02] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-chalk-dim">
                  /// Griglia non disponibile finché il reparto non torna in gioco
                </p>
              ) : videos.length === 0 ? (
                <EmptyPanel />
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {videos.map((v, i) => (
                      <VideoCard
                        key={`${activeId}-${order}-${v.id}`}
                        video={v}
                        index={i}
                        active={featured?.id === v.id}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                  {nextPageToken && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="bg-pitch-950 text-lime px-8 py-3 text-[11px] font-black uppercase tracking-[0.25em] border border-lime hover:bg-lime hover:text-pitch-950 transition-colors disabled:opacity-50"
                      >
                        {loadingMore ? "Caricamento in corso..." : "Carica altri video"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer categories={settings.categories} settings={settings} onSelect={handleCategory} />
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={() => void load(true)}
        />

        {/* Toast Notifica Nuovi Video */}
        {newVideoToast && (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm border border-lime bg-pitch-950 p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 rounded-full bg-lime/20 p-1.5 text-lime">
                <BellIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-lime">
                  {newVideoToast.message}
                </h4>
                <p className="mt-1 line-clamp-2 text-[13px] font-semibold text-chalk group-hover:text-lime">
                  {newVideoToast.video.title}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setNewVideoToast(null);
                      handleSelect(newVideoToast.video);
                    }}
                    className="bg-lime px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-pitch-950 transition-colors hover:bg-white"
                  >
                    Guarda Ora
                  </button>
                  <button
                    onClick={() => setNewVideoToast(null)}
                    className="text-[10px] font-bold uppercase tracking-wider text-chalk-dim transition-colors hover:text-white"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
              <button
                onClick={() => setNewVideoToast(null)}
                className="shrink-0 p-1 text-chalk-dim transition-colors hover:text-white"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
