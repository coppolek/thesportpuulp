import { useState, useEffect } from "react";
import { setApiKey } from "../lib/youtube";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: Props) {
  const [key, setKey] = useState("");

  useEffect(() => {
    if (isOpen) {
      setKey(localStorage.getItem("YOUTUBE_API_KEY") || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(key.trim());
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pitch-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border border-line bg-[#0a0a0a] p-8">
        <h2 className="font-display text-3xl font-black italic tracking-tighter skew-item uppercase text-chalk mb-6">
          Impostazioni API
        </h2>
        
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-chalk-dim">
            YouTube API Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Inserisci la tua chiave API..."
            className="w-full border border-line bg-[#111111] px-4 py-3 text-sm text-chalk focus:border-lime focus:outline-none placeholder-chalk-dim/50"
          />
          <p className="text-[10px] text-chalk-dim mt-2">
            Lascia vuoto per usare la chiave di default. Utile se la quota giornaliera è stata raggiunta.
          </p>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-chalk-dim hover:text-chalk transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="bg-white text-black px-8 py-3 text-xs font-black uppercase tracking-[0.2em] border border-white hover:bg-lime hover:border-lime transition-colors"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
