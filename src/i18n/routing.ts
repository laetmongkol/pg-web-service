import { defineRouting } from "next-intl/routing";

import { LANGUAGE } from "@/shared/constants/common.constants";

// Canonical locale list — must match the [language] URL segment values.
// next-intl middleware reads the first path segment and compares against this list.
export const routing = defineRouting({
  locales: Object.values(LANGUAGE) as [LANGUAGE, ...LANGUAGE[]],
  defaultLocale: LANGUAGE.TH,
  // Keep locale prefix in every URL (/en/... /th/...).
  // This preserves the existing URL structure and makes locale explicit for SEO.
  localePrefix: "always",
  // No `Link: rel="alternate"` header. It is built from `locales` — which is a superset of what
  // the languages table has switched on — so it advertised hreflang for locales that 404, and
  // its `x-default` drops the locale prefix, which 404s under `localePrefix: "always"`. hreflang
  // is rendered by `buildAlternates` from the languages table instead (lib/active-locales.ts).
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
