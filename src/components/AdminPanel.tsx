import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { SiteSettings, fetchSettings, saveSettings, DEFAULT_SETTINGS, Banner } from "../lib/settings";
import { ICONS, getIcon, Category } from "../data/categories";

export default function AdminPanel() {
  const [user, setUser] = useState(auth.currentUser);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "categories" | "banners">("general");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        fetchSettings().then(setSettings).catch((err) => {
          console.error(err);
          setError("Errore nel caricamento delle impostazioni");
        });
      }
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await saveSettings(settings);
      setMessage("Impostazioni salvate con successo!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = (index: number, field: keyof Category, value: string) => {
    if (!settings) return;
    const newCat = [...settings.categories];
    newCat[index] = { ...newCat[index], [field]: value };
    setSettings({ ...settings, categories: newCat });
  };

  const addCategory = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      categories: [
        ...settings.categories,
        { id: `cat-${Date.now()}`, label: "Nuova Categoria", query: "", tagline: "", iconName: "default" }
      ]
    });
  };

  const removeCategory = (index: number) => {
    if (!settings) return;
    const newCat = settings.categories.filter((_, i) => i !== index);
    setSettings({ ...settings, categories: newCat });
  };

  const updateBanner = (index: number, field: keyof Banner, value: any) => {
    if (!settings) return;
    const newBanners = [...(settings.banners || [])];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setSettings({ ...settings, banners: newBanners });
  };

  const addBanner = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      banners: [
        ...(settings.banners || []),
        { id: `banner-${Date.now()}`, position: "header", type: "image", active: true, code: "", imageUrl: "", linkUrl: "", altText: "" }
      ]
    });
  };

  const removeBanner = (index: number) => {
    if (!settings) return;
    const newBanners = (settings.banners || []).filter((_, i) => i !== index);
    setSettings({ ...settings, banners: newBanners });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-pitch-950 flex flex-col items-center justify-center p-4">
        <div className="border border-line bg-pitch-900 p-8 max-w-md w-full">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-chalk mb-6">Accesso Admin</h1>
          {error && <p className="text-blaze text-sm mb-4">{error}</p>}
          <button 
            onClick={handleLogin}
            className="w-full bg-lime text-pitch-950 px-4 py-3 font-bold uppercase tracking-wider hover:bg-white transition-colors"
          >
            Accedi con Google
          </button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-pitch-950 flex flex-col items-center justify-center">
        <p className="text-lime uppercase font-bold tracking-widest animate-pulse">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pitch-950 text-chalk p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-line pb-6">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Pannello Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-chalk-dim">{user.email}</span>
            <button onClick={() => signOut(auth)} className="text-sm font-bold uppercase text-blaze hover:text-white transition-colors">
              Esci
            </button>
          </div>
        </div>

        {error && <div className="bg-blaze/20 border border-blaze p-4 text-blaze text-sm">{error}</div>}
        {message && <div className="bg-lime/20 border border-lime p-4 text-lime text-sm">{message}</div>}

        <div className="flex gap-4 border-b border-line">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "general" ? "border-lime text-lime" : "border-transparent text-chalk-dim hover:text-white"}`}
          >
            Generali
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "categories" ? "border-lime text-lime" : "border-transparent text-chalk-dim hover:text-white"}`}
          >
            Categorie
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "banners" ? "border-lime text-lime" : "border-transparent text-chalk-dim hover:text-white"}`}
          >
            Banner / Ads
          </button>
        </div>

        {activeTab === "general" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-lime">Impostazioni Generali</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Nicchia (Titolo Sito)</label>
                <input 
                  type="text" 
                  value={settings.niche} 
                  onChange={(e) => setSettings({ ...settings, niche: e.target.value })}
                  className="w-full bg-pitch-900 border border-line px-3 py-2 text-chalk focus:border-lime outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Tagline</label>
                <input 
                  type="text" 
                  value={settings.tagline} 
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-pitch-900 border border-line px-3 py-2 text-chalk focus:border-lime outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Grafica (Colore Principale)</label>
                <div className="flex gap-3 mt-2">
                  {[
                    { name: 'Lime (Default)', value: '#D4FF00' },
                    { name: 'Cyan', value: '#00E5FF' },
                    { name: 'Orange', value: '#FF6D00' },
                    { name: 'Magenta', value: '#FF00FF' },
                    { name: 'Gold', value: '#FFD700' },
                    { name: 'Red', value: '#FF3333' }
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSettings({ ...settings, themeColor: color.value })}
                      title={color.name}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        (settings.themeColor || '#D4FF00') === color.value 
                          ? 'border-chalk scale-110' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-widest text-lime">Categorie</h2>
              <button 
                onClick={addCategory}
                className="bg-pitch-800 border border-line px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:border-lime transition-colors"
              >
                + Aggiungi
              </button>
            </div>
            
            <div className="space-y-4">
              {settings.categories.map((cat, i) => (
                <div key={i} className="border border-line bg-pitch-900 p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-start">
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">ID (URL)</label>
                    <input 
                      type="text" 
                      value={cat.id} 
                      onChange={(e) => updateCategory(i, 'id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Etichetta</label>
                    <input 
                      type="text" 
                      value={cat.label} 
                      onChange={(e) => updateCategory(i, 'label', e.target.value)}
                      className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Icona</label>
                    <div className="flex items-center gap-2">
                      <select 
                        value={cat.iconName} 
                        onChange={(e) => updateCategory(i, 'iconName', e.target.value)}
                        className="flex-1 bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                      >
                        {Object.keys(ICONS).map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                      <div className="w-8 h-8 flex items-center justify-center border border-line bg-pitch-800 shrink-0 text-lime">
                        {getIcon(cat.iconName)}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Query YouTube</label>
                    <input 
                      type="text" 
                      value={cat.query} 
                      onChange={(e) => updateCategory(i, 'query', e.target.value)}
                      className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                      placeholder="es: musica rock live"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Tagline</label>
                    <input 
                      type="text" 
                      value={cat.tagline} 
                      onChange={(e) => updateCategory(i, 'tagline', e.target.value)}
                      className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-5 grid gap-4 sm:grid-cols-3 mt-2 border-t border-line/50 pt-4">
                    <div className="sm:col-span-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime">SEO & Social</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">SEO Title</label>
                      <input 
                        type="text" 
                        value={cat.seoTitle || ""} 
                        onChange={(e) => updateCategory(i, 'seoTitle', e.target.value)}
                        placeholder="Opzionale"
                        className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">SEO Description</label>
                      <input 
                        type="text" 
                        value={cat.seoDescription || ""} 
                        onChange={(e) => updateCategory(i, 'seoDescription', e.target.value)}
                        placeholder="Opzionale"
                        className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">OG Image URL</label>
                      <input 
                        type="text" 
                        value={cat.seoImage || ""} 
                        onChange={(e) => updateCategory(i, 'seoImage', e.target.value)}
                        placeholder="Opzionale"
                        className="w-full bg-pitch-950 border border-line px-2 py-1.5 text-sm focus:border-lime outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
                    <button 
                      onClick={() => removeCategory(i)}
                      className="text-blaze text-xs font-bold uppercase tracking-wider hover:text-white mt-6"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "banners" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-widest text-lime">Banner Pubblicitari</h2>
              <button 
                onClick={addBanner}
                className="bg-pitch-800 border border-line px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:border-lime transition-colors"
              >
                + Aggiungi Banner
              </button>
            </div>
            
            <div className="space-y-6">
              {(settings.banners || []).length === 0 && (
                <p className="text-chalk-dim text-sm italic">Nessun banner configurato. Aggiungine uno per iniziare a monetizzare.</p>
              )}
              {(settings.banners || []).map((banner, i) => (
                <div key={banner.id} className="border border-line bg-pitch-900 p-5 space-y-4">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={banner.active} 
                          onChange={(e) => updateBanner(i, 'active', e.target.checked)}
                          className="w-4 h-4 accent-lime"
                        />
                        <span className="text-sm font-bold uppercase tracking-wider">Attivo</span>
                      </label>
                      <span className="text-chalk-dim font-mono text-xs opacity-50">{banner.id}</span>
                    </div>
                    <button 
                      onClick={() => removeBanner(i)}
                      className="text-blaze text-xs font-bold uppercase tracking-wider hover:text-white"
                    >
                      Rimuovi Banner
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Posizione</label>
                      <select 
                        value={banner.position} 
                        onChange={(e) => updateBanner(i, 'position', e.target.value)}
                        className="w-full bg-pitch-950 border border-line px-3 py-2 text-sm focus:border-lime outline-none"
                      >
                        <option value="header">Header (Sotto Masthead)</option>
                        <option value="in-feed">In-Feed (Tra i video)</option>
                        <option value="sidebar">Sidebar (Area tendenze)</option>
                        <option value="footer">Footer (Sopra il footer)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Tipo Banner</label>
                      <select 
                        value={banner.type} 
                        onChange={(e) => updateBanner(i, 'type', e.target.value)}
                        className="w-full bg-pitch-950 border border-line px-3 py-2 text-sm focus:border-lime outline-none"
                      >
                        <option value="image">Immagine + Link</option>
                        <option value="adsense">Codice AdSense / HTML</option>
                      </select>
                    </div>
                  </div>

                  {banner.type === "adsense" ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Codice AdSense o Script HTML</label>
                      <textarea 
                        value={banner.code || ""} 
                        onChange={(e) => updateBanner(i, 'code', e.target.value)}
                        rows={4}
                        className="w-full bg-pitch-950 border border-line px-3 py-2 text-sm font-mono focus:border-lime outline-none text-chalk-dim"
                        placeholder="<!-- Inserisci qui il codice -->"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">URL Immagine</label>
                        <input 
                          type="text" 
                          value={banner.imageUrl || ""} 
                          onChange={(e) => updateBanner(i, 'imageUrl', e.target.value)}
                          className="w-full bg-pitch-950 border border-line px-3 py-2 text-sm focus:border-lime outline-none"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Link Destinazione</label>
                        <input 
                          type="text" 
                          value={banner.linkUrl || ""} 
                          onChange={(e) => updateBanner(i, 'linkUrl', e.target.value)}
                          className="w-full bg-pitch-950 border border-line px-3 py-2 text-sm focus:border-lime outline-none"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-chalk-dim mb-1">Testo Alternativo (Alt)</label>
                        <input 
                          type="text" 
                          value={banner.altText || ""} 
                          onChange={(e) => updateBanner(i, 'altText', e.target.value)}
                          className="w-full bg-pitch-950 border border-line px-3 py-2 text-sm focus:border-lime outline-none"
                          placeholder="Descrizione banner"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-line flex items-center justify-between sticky bottom-0 bg-pitch-950 py-4 shadow-[0_-20px_20px_-15px_rgba(0,0,0,0.5)] z-10">
          <a href="/" className="text-chalk-dim text-sm hover:text-white uppercase font-bold tracking-widest">
            &larr; Torna al sito
          </a>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-lime text-pitch-950 px-8 py-3 font-black uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}
