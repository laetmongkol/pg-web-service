"server-only";

import { languageAppServiceServer } from "@/services/modules/app-service/server"

import type { LANGUAGE } from "@/shared/constants/common.constants"

import { routing } from "@/i18n/routing"
import { getLanguageName } from "@/shared/constants/language.constants"

export type ActiveLocale = {
  code: LANGUAGE
  label: string
}

/**
 * Locales that are BOTH routable (a prerendered `[locale]` segment exists) and active in the
 * languages table. Single source for hreflang and sitemap alternates — never a hardcoded list,
 * so flipping a row in the languages table is enough to advertise a new locale.
 *
 * Throws whatever the Language API throws. Callers decide what "unknown" means: page metadata
 * omits hreflang (a missing one is harmless, a wrong one is not), the sitemap lets it propagate
 * so ISR keeps serving the last good XML.
 */
export async function getActiveLocales(): Promise<ActiveLocale[]> {
  const languages = await languageAppServiceServer.getSupportedLanguagesCached()
  const routable = new Set<string>(routing.locales)
  const seen = new Set<string>()
  const active: ActiveLocale[] = []

  for (const row of languages) {
    const code = row.languageCode?.trim().toLowerCase()
    if (!code || seen.has(code) || !routable.has(code)) continue
    seen.add(code)

    const name = row.languageLabel?.trim() || row.languageName?.trim() || getLanguageName(code)
    active.push({
      code: code as LANGUAGE,
      label: name.includes(":") ? name : `${code}: ${name}`,
    })
  }

  return active
}
