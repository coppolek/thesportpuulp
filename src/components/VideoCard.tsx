import { useState } from "react";
import type { Video } from "../lib/youtube";
import { formatDate, formatDuration, formatViews } from "../lib/format";
import { PlayIcon, ShareIcon, CheckIcon } from "./icons";
import Reveal from "./Reveal";

interface VideoCardProps {
  video: Video;
  index: number;
  active: boolean;
  onSelect: (v: Video) => void;
}

export default function VideoCard({ video, index, active, onSelect }: VideoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.href.split('?')[0]}?v=${video.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Reveal delay={(index % 4) * 70}>
      <article
        onClick={() => onSelect(video)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(video);
          }
        }}
        className={`group relative cursor-pointer border bg-pitch-900 transition-all duration-300 hover:-translate-y-1 hover:border-lime/60 hover:shadow-[0_16px_36px_-14px_rgba(0,0,0,0.75)] ${
          active ? "border-lime/60" : "border-line"
        }`}
      >
        <span className="absolute left-0 top-0 z-20 h-[3px] w-full origin-left scale-x-0 bg-lime transition-transform duration-300 group-hover:scale-x-100" />

        <div className="relative aspect-video overflow-hidden bg-pitch-800">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pitch-950/80 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-12 w-12 scale-75 place-items-center rounded-full bg-lime text-pitch-950 opacity-0 shadow-[0_0_0_6px_rgba(216,243,74,0.18)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <PlayIcon className="h-5 w-5 translate-x-[1px]" />
            </span>
          </span>

          {video.duration && (
            <span className="absolute bottom-2 right-2 z-10 bg-pitch-950/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-lime">
              {formatDuration(video.duration)}
            </span>
          )}

          {active && (
            <span className="absolute left-2 top-2 z-10 flex items-center gap-1.5 bg-blaze px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-chalk">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-chalk" />
              In onda
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] font-bold leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-lime">
              {video.title}
            </h3>
            <button
              onClick={handleShare}
              className="relative shrink-0 p-1.5 text-chalk-dim hover:text-lime transition-colors"
              title="Condividi"
            >
              {copied ? <CheckIcon className="h-4 w-4 text-lime" /> : <ShareIcon className="h-4 w-4" />}
              {copied && (
                <span className="absolute -top-8 right-0 rounded bg-lime px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
                  Copiato!
                </span>
              )}
            </button>
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-chalk-dim font-bold">
            <span className="max-w-[44%] truncate">{video.channel}</span>
            <span className="text-lime-deep">·</span>
            <span>{formatViews(video.views)} views</span>
            <span className="text-lime-deep">·</span>
            <span className="shrink-0">{formatDate(video.publishedAt)}</span>
          </p>
        </div>
      </article>
    </Reveal>
  );
}
