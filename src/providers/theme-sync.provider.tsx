"use client";

import { useEffect } from "react";

import { isSupportedTheme, THEME_STORAGE_KEY } from "@/proxies/theme.proxy";
import { THEME } from "@/shared/constants/common.constants";
import { useThemeStore } from "@/stores/theme.store";

function logThemeSyncError(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const trace = error instanceof Error ? error.stack : undefined;
  console.warn(`[theme-sync.provider][error][${scope}] ${message}`);
  if (trace) console.error(trace);
}

// Syncs the Zustand theme store with the user's saved preference on mount.
// The <html> class is already correct from the inline script in layout.tsx,
// so we only need to align the store state — no DOM manipulation here.
const ThemeSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const changeTheme = useThemeStore((s) => s.changeTheme);

  useEffect(() => {
    try {
      // [crash-test] simulate localStorage theme read failure
      // throw new Error("[crash-test] ThemeSyncProvider");

      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      changeTheme(isSupportedTheme(stored) ? (stored as THEME) : THEME.LIGHT);
    } catch (error) {
      logThemeSyncError("mount", error);
      changeTheme(THEME.LIGHT);
    }
  }, [changeTheme]);

  return <>{children}</>;
};

export default ThemeSyncProvider;
