import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { CATEGORIES as DEFAULT_CATEGORIES, type Category } from "../data/categories";

export type BannerPosition = "header" | "in-feed" | "sidebar" | "footer";

export interface Banner {
  id: string;
  position: BannerPosition;
  type: "adsense" | "image";
  active: boolean;
  code?: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
}

export interface SiteSettings {
  themeColor?: string;
  niche: string;
  tagline: string;
  categories: Category[];
  banners?: Banner[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  niche: "ARENA SPORT",
  tagline: "Il portale dei video sportivi con i migliori highlights da YouTube.",
  categories: DEFAULT_CATEGORIES,
  banners: [],
};

export async function fetchSettings(): Promise<SiteSettings> {
  const docRef = doc(db, "settings", "config");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      themeColor: data.themeColor || "#D4FF00",
      niche: data.niche || DEFAULT_SETTINGS.niche,
      tagline: data.tagline || DEFAULT_SETTINGS.tagline,
      categories: data.categories || DEFAULT_SETTINGS.categories,
      banners: data.banners || [],
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
        themeColor: data.themeColor || "#D4FF00",
        niche: data.niche || DEFAULT_SETTINGS.niche,
        tagline: data.tagline || DEFAULT_SETTINGS.tagline,
        categories: data.categories || DEFAULT_SETTINGS.categories,
        banners: data.banners || [],
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
