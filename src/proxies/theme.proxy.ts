import type { NextRequest } from "next/server";

import { THEME } from "@/shared/constants/common.constants";

export const THEME_COOKIE_KEY = "theme";
export const THEME_STORAGE_KEY = "preferred-theme";

export const isSupportedTheme = (theme?: string | null): boolean => {
  return !!(theme && Object.values(THEME).includes(theme as THEME));
};

export const getPreferredTheme = (request: NextRequest): THEME => {
  const themeFromCookie = request.cookies.get(THEME_COOKIE_KEY)?.value;
  if (isSupportedTheme(themeFromCookie)) return themeFromCookie as THEME;
  return THEME.LIGHT;
};

export const setThemeRequestHeader = (
  theme: THEME,
  requestHeaders: Headers,
) => {
  requestHeaders.set("x-theme", theme);
};
