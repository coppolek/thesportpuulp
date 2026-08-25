import { useEffect, useRef } from "react";
import type { Banner } from "../lib/settings";

interface BannerDisplayProps {
  banners: Banner[];
  position: Banner["position"];
  className?: string;
}

function HtmlBanner({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a new context to inject the HTML and run scripts
    const slot = containerRef.current;
    slot.innerHTML = html;
    
    // Find all script tags and re-create them to force execution
    const scripts = slot.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return <div ref={containerRef} className="w-full flex items-center justify-center overflow-hidden" />;
}

export function BannerDisplay({ banners, position, className = "" }: BannerDisplayProps) {
  const activeBanners = banners.filter(b => b.active && b.position === position);

  if (activeBanners.length === 0) return null;

  return (
    <div className={`w-full flex flex-col gap-4 items-center justify-center my-6 ${className}`}>
      {activeBanners.map((banner) => (
        <div key={banner.id} className="w-full max-w-4xl mx-auto overflow-hidden">
          {banner.type === "image" ? (
            <a 
              href={banner.linkUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
            >
              <img 
                src={banner.imageUrl} 
                alt={banner.altText || "Advertisement"} 
                className="w-full h-auto object-cover border border-line"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </a>
          ) : (
            <div className="w-full min-h-[90px] bg-pitch-900 border border-line flex items-center justify-center p-2">
              <HtmlBanner html={banner.code || ""} />
            </div>
          )}
          <div className="text-[9px] uppercase tracking-widest text-chalk-dim text-center mt-1">Advertisement</div>
        </div>
      ))}
    </div>
  );
}
