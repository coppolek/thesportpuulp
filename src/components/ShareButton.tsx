import { useState } from "react";
import { ShareIcon, CheckIcon } from "./icons";

interface ShareButtonProps {
  videoId: string;
  className?: string;
  withText?: boolean;
}

export default function ShareButton({ videoId, className = "", withText = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?v=${videoId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`relative shrink-0 p-1.5 transition-colors ${className}`}
      title="Condividi video"
    >
      {copied ? <CheckIcon className="h-4 w-4 text-lime" /> : <ShareIcon className="h-4 w-4" />}
      {withText && <span className="hidden sm:inline ml-1.5">{copied ? "Link Copiato!" : "Condividi"}</span>}
      {copied && !withText && (
        <span className="absolute -top-8 right-0 rounded bg-lime px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
          Copiato!
        </span>
      )}
    </button>
  );
}
