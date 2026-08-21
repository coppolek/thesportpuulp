import { useEffect, useState } from "react";
import { fetchTrendingVideos, type Video } from "../lib/youtube";
import VideoCard from "./VideoCard";

interface TrendingSectionProps {
  activeId: string | null;
  onSelect: (v: Video) => void;
}

export default function TrendingSection({ activeId, onSelect }: TrendingSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTrendingVideos()
      .then((data) => {
        if (mounted) setVideos(data);
      })
      .catch((err) => console.error("Trending error:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-line bg-pitch-900 overflow-hidden pt-6 pb-2">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-lime font-bold">
            Trending Now
          </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {videos.map((v, i) => (
            <div key={`trending-${v.id}`} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
              <VideoCard
                video={v}
                index={i}
                active={activeId === v.id}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
