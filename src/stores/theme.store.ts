"use client";

import { create } from "zustand";

import { THEME_COOKIE_KEY, THEME_STORAGE_KEY } from "@/proxies/theme.proxy";
import { THEME } from "@/shared/constants/common.constants";

interface ThemeStore {
  selectedTheme: THEME;
  changeTheme: (theme?: THEME | string) => void;
}

const themeStore = create<ThemeStore>((set) => ({
  selectedTheme: THEME.LIGHT,

  changeTheme: (theme) => {
    const t = (theme as THEME) ?? THEME.LIGHT;
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, t);
      document.cookie = `${THEME_COOKIE_KEY}=${t}; path=/; max-age=31536000`;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(t);
    }
    set({ selectedTheme: t });
  },
}));

export const useThemeStore = themeStore;
