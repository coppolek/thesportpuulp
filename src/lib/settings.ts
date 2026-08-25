import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { CATEGORIES as DEFAULT_CATEGORIES, type Category } from "../data/categories";

export interface SiteSettings {
  niche: string;
  tagline: string;
  categories: Category[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  niche: "ARENA SPORT",
  tagline: "Il portale dei video sportivi con i migliori highlights da YouTube.",
  categories: DEFAULT_CATEGORIES,
};

export async function fetchSettings(): Promise<SiteSettings> {
  const docRef = doc(db, "settings", "config");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      niche: data.niche || DEFAULT_SETTINGS.niche,
      tagline: data.tagline || DEFAULT_SETTINGS.tagline,
      categories: data.categories || DEFAULT_SETTINGS.categories,
    };
  }
  return DEFAULT_SETTINGS;
}

export function subscribeToSettings(callback: (settings: SiteSettings) => void) {
  const docRef = doc(db, "settings", "config");
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        niche: data.niche || DEFAULT_SETTINGS.niche,
        tagline: data.tagline || DEFAULT_SETTINGS.tagline,
        categories: data.categories || DEFAULT_SETTINGS.categories,
      });
    } else {
      callback(DEFAULT_SETTINGS);
    }
  });
}

export async function saveSettings(settings: SiteSettings) {
  const docRef = doc(db, "settings", "config");
  await setDoc(docRef, settings);
}
