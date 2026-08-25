import { useEffect, useState, useRef } from "react";
import { fetchVideoComments, type Comment, type Video } from "../lib/youtube";
import { formatDate, formatDuration, formatViews } from "../lib/format";
import { CalendarIcon, ExternalIcon, EyeIcon, PlayIcon, MessageSquareIcon } from "./icons";
import ShareButton from "./ShareButton";

interface FeaturedProps {
  video: Video;
  queue: Video[];
  categoryName: string;
  onSelect: (v: Video) => void;
}

function VideoComments({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchVideoComments(videoId).then((res) => {
      if (active) {
        setComments(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [videoId]);

  if (loading) {
    return (
      <div className="mt-8 border-t border-line pt-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-chalk-dim font-bold animate-pulse">
          /// Caricamento commenti...
        </p>
      </div>
    );
  }

  if (comments.length === 0) return null;

  return (
    <div className="mt-8 border-t border-line pt-6">
      <div className="flex items-center gap-2 mb-6 text-lime">
        <MessageSquareIcon className="h-5 w-5" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-chalk">Commenti ({comments.length})</h3>
      </div>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 items-start">
            <img 
              src={comment.authorAvatar} 
              alt={comment.author}
              className="w-10 h-10 rounded-full border border-line bg-pitch-900 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-chalk">{comment.author}</span>
                <span className="text-[10px] text-chalk-dim">{formatDate(comment.publishedAt)}</span>
              </div>
              <p className="text-sm text-chalk-dim leading-relaxed break-words line-clamp-4">
                {comment.text}
              </p>
              {comment.likeCount > 0 && (
                <div className="mt-2 text-[10px] uppercase tracking-wider text-chalk-dim flex items-center gap-1 font-bold">
                  👍 {comment.likeCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function Featured({ video, queue, categoryName, onSelect }: FeaturedProps) {
  const initial = video.channel.trim().charAt(0).toUpperCase() || "Y";
  const [showAd, setShowAd] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const adPushed = useRef(false);

  useEffect(() => {
    setShowAd(true);
    setCountdown(5);
    adPushed.current = false;
  }, [video.id]);

  useEffect(() => {
    if (showAd && !adPushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushed.current = true;
      } catch (e) {
        console.error("AdSense non caricato:", e);
      }
    }
  }, [showAd]);

  useEffect(() => {
    let timer: number;
    if (showAd && countdown > 0) {
      timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showAd, countdown]);

  return (
    <section className="border-b border-line bg-pitch-900/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em]">
            <span className="bg-lime px-2 py-1 text-pitch-950">In onda</span>
            <span className="text-chalk-dim">Reparto {categoryName}</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-chalk-dim font-bold">
            {queue.length + 1} video in distinta
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* lettore + scheda */}
          <div className="min-w-0">
            <div key={video.id} className="swap-in border border-line bg-pitch-950 p-1.5">
              <div className={`relative w-full overflow-hidden bg-pitch-900 ${showAd ? "aspect-[4/3] sm:aspect-video min-h-[250px] sm:min-h-0" : "aspect-video"}`}>
                {showAd ? (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-pitch-950 p-2 sm:p-4">
                    <div className="flex-1 w-full bg-pitch-900 flex items-center justify-center border border-line overflow-hidden">
                      <ins className="adsbygoogle"
                           style={{ display: "block", width: "100%" }}
                           data-ad-client="ca-pub-5738943819550045"
                           data-ad-slot="8217548700"
                           data-ad-format="auto"
                           data-full-width-responsive="true"></ins>
                    </div>
                    <div className="mt-2 sm:mt-4 shrink-0 text-center">
                      {countdown > 0 ? (
                        <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-chalk-dim">
                          Il video inizierà in {countdown}...
                        </p>
                      ) : (
                        <button 
                          onClick={() => setShowAd(false)}
                          className="bg-lime text-pitch-950 px-3 py-1.5 sm:px-6 sm:py-2.5 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors hover:bg-white"
                        >
                          Chiudi annuncio
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <iframe
                    key={`video-${video.id}`}
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&color=white&autoplay=1`}
                    title={video.title}
                    className="absolute inset-0 h-full w-full swap-in"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-5">
              <h2 className="max-w-3xl font-display text-xl font-black italic tracking-tighter skew-item uppercase leading-tight sm:text-[32px] sm:leading-[1.05]">
                {video.title}
              </h2>

              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-3">
                <span className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center bg-lime font-display text-base text-pitch-950 skew-item">
                    <span className="skew-item">{initial}</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-chalk">
                    {video.channel}
                  </span>
                </span>

                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-chalk-dim font-bold">
                  <EyeIcon /> {formatViews(video.views)} views
                </span>
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-chalk-dim font-bold">
                  <CalendarIcon /> {formatDate(video.publishedAt)}
                </span>
                {video.duration && (
                  <span className="border border-lime/50 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-lime">
                    {formatDuration(video.duration)}
                  </span>
                )}
                <ShareButton 
                  videoId={video.id}
                  withText={true}
                  className="ml-auto flex items-center gap-1.5 border border-line bg-pitch-900/80 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-chalk hover:border-lime/60 hover:text-lime sm:px-3 sm:py-2"
                />
              </div>

              {video.description && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-chalk-dim line-clamp-3">
                  {video.description}
                </p>
              )}
              <VideoComments videoId={video.id} />


            </div>
          </div>

          {/* coda successivi */}
          <aside className="hidden min-h-0 border border-line bg-pitch-950/70 lg:flex lg:flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-chalk-dim">
                /// Successivi
              </span>
              <span className="text-[10px] font-bold text-lime tabular-nums">
                {String(queue.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="max-h-[560px] flex-1 divide-y divide-line/60 overflow-y-auto">
              {queue.map((v, i) => (
                <li key={v.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect(v)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(v);
                      }
                    }}
                    className="group flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-pitch-800 cursor-pointer"
                  >
                    <span className="mt-0.5 text-[11px] font-bold text-lime-deep tabular-nums group-hover:text-lime">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span className="relative block w-24 shrink-0 overflow-hidden border border-line">
                      <img
                        src={v.thumbnail}
                        alt=""
                        loading="lazy"
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {v.duration && (
                        <span className="absolute bottom-1 right-1 bg-pitch-950/90 px-1 text-[9px] font-bold text-lime">
                          {formatDuration(v.duration)}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-lime">
                        {v.title}
                      </span>
                      <span className="mt-1 block truncate text-[9.5px] uppercase tracking-wider text-chalk-dim font-bold">
                        {v.channel} · {formatViews(v.views)} views
                      </span>
                    </span>
                    <ShareButton 
                      videoId={v.id} 
                      className="ml-auto opacity-0 group-hover:opacity-100 text-chalk-dim hover:text-lime" 
                    />
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
