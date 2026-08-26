import { getRequestConfig } from "next-intl/server";

import type { IntlError } from "next-intl";

import { getMessages } from "./fetch-translations";
import { routing } from "./routing";

// Called on every SSR request by the next-intl plugin.
// Determines the active locale and loads messages from app-service.
export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is set by next-intl middleware from the URL segment.
  let locale = await requestLocale;

  // Fall back to default if the locale is missing or invalid.
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = await getMessages(locale);

  return {
    locale,
    messages,
    // next-intl will use the key itself as fallback when a translation is missing,
    // which prevents blank text in the rare case a key isn't in the database yet.
    onError(error: IntlError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[i18n] Missing translation:", error.message);
      }
    },
    getMessageFallback({ namespace, key }: { namespace?: string; key: string }) {
      return [namespace, key].filter(Boolean).join(".");
    },
  };
});
