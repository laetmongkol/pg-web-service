import type { MetadataRoute } from "next"

// Generated once at build time for the static export.
export const dynamic = "force-static"

import { routing } from "@/i18n/routing"
import { SITE } from "@/shared/constants/site.constants"

// One page per locale — the whole site is a single scroll story.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE.url}/${locale}`]))
  return routing.locales.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    alternates: { languages },
  }))
}
