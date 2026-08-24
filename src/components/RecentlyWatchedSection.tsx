import type { Video } from "../lib/youtube";
import VideoCard from "./VideoCard";

interface RecentlyWatchedSectionProps {
  activeId: string | null;
  videos: Video[];
  onSelect: (v: Video) => void;
  onClear: () => void;
}

export default function RecentlyWatchedSection({
  activeId,
  videos,
  onSelect,
  onClear,
}: RecentlyWatchedSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section className="border-b border-line bg-pitch-950 overflow-hidden pt-6 pb-2">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-chalk-dim font-bold">
              Di recente
            </span>
          </div>
          <button
            onClick={onClear}
            className="text-[10px] uppercase tracking-wider text-chalk-dim hover:text-blaze transition-colors"
          >
            Cancella
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {videos.map((v, i) => (
            <div
              key={`recent-${v.id}`}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start"
            >
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
