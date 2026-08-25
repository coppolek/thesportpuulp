import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { SiteSettings, fetchSettings, saveSettings, DEFAULT_SETTINGS } from "../lib/settings";
import { ICONS, getIcon, Category } from "../data/categories";

export default function AdminPanel() {
  const [user, setUser] = useState(auth.currentUser);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-line">
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
                <div className="sm:col-span-2 lg:col-span-1 flex justify-end">
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
