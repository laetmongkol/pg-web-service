import { LanguageResponseDto } from "@/services/generated-cli/api-app-service";
import { languageAppServiceServer } from "@/services/modules/app-service/server";

import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { LANGUAGE } from "@/shared/constants/common.constants";

export const LANGUAGE_COOKIE_KEY = "x-language";

const STATIC_LOCALES = new Set<string>(routing.locales);

export const setLanguageRequestHeader = (
  language: LANGUAGE,
  requestHeaders: Headers,
) => {
  requestHeaders.set(LANGUAGE_COOKIE_KEY, language);
};

export const getLanguageFromSlug = (request: NextRequest) => {
  return request.nextUrl.pathname.split("/")[1];
};

export const getLanguageFromPath = async (pathname: string): Promise<LANGUAGE> => {
  const language = pathname.split("/")[1];
  return await isSupportedLanguage(language) ? (language as LANGUAGE) : LANGUAGE.TH;
};

const DEBUG = process.env.NODE_ENV === "development";

// language codes go stale otherwise: DB status changes never applied until process restart.
function logSupportCheck(language: string, result: boolean, reason: string): boolean {
  if (DEBUG) console.log(`[language.proxy][isSupportedLanguage] "${language}" -> ${result} (${reason})`);
  return result;
}

export const isSupportedLanguage = async (language?: string | null): Promise<boolean> => {
  if (!language) return false;

  // [locale]/layout.tsx only pre-renders routing.locales (dynamicParams: false) — a
  // languages-table row for anything else can never actually render, so treating it as
  // "supported" here just makes next-intl's own middleware mis-redirect it (it doesn't
  // know that locale either). Reject up front instead of hitting app-service. To add a
  // new URL locale, add it to the LANGUAGE enum in common.constants.ts first.
  if (!STATIC_LOCALES.has(language)) {
    return logSupportCheck(language, false, `not in routing.locales [${routing.locales.join(", ")}]`);
  }

  // Default locale must still work if app-service is cold/down — a dead API must not
  // lock every page out. Non-default static locales (e.g. "en", "af") DO depend on this
  // check, so disabling one in the languages table actually disables it here.
  if (language === routing.defaultLocale) {
    return logSupportCheck(language, true, "default locale, always allowed");
  }

  try {
    // No extra caching here on top of getSupportedLanguagesCached() on purpose — an
    // additional module-level cache previously never expired for the life of the process,
    // so a languages-table status flip only took effect after a restart.
    const languages: LanguageResponseDto[] = await languageAppServiceServer.getSupportedLanguagesCached();
    const codes = languages.map((item) => item.languageCode);
    return logSupportCheck(language, codes.includes(language), `languages table returned [${codes.join(", ")}]`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return logSupportCheck(language, false, `app-service lookup failed: ${message}`);
  }
};

export const getPreferredLanguage = async (
  request: NextRequest,
  languageFromSlug = getLanguageFromSlug(request),
): Promise<LANGUAGE> => {
  if (languageFromSlug && await isSupportedLanguage(languageFromSlug)) {
    return languageFromSlug as LANGUAGE;
  }

  const languageFromCookie = request.cookies.get(LANGUAGE_COOKIE_KEY)?.value;
  if (languageFromCookie && await isSupportedLanguage(languageFromCookie)) {
    return languageFromCookie as LANGUAGE;
  }

  return LANGUAGE.TH;
};
