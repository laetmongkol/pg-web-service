import { getRequestConfig } from "next-intl/server"

import { routing } from "./routing"

// Copy lives in src/messages/{locale}.json — taken from the PG Solution corporate website brief.
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
