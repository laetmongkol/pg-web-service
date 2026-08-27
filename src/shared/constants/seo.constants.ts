import { LANGUAGE } from "./common.constants";

// hreflang and sitemap locales both come from the languages table at runtime, intersected with
// routable locales (see lib/active-locales.ts). No compile-time locale list here on purpose —
// a third source would drift from the other two and advertise locales that 404.
export const SEO_DEFAULT_LOCALE = LANGUAGE.TH;
/**
 * Public blog base path. Single source: canonical, breadcrumbs, article hrefs and the sitemap
 * all derive from this, so renaming the route is one edit instead of nine.
 */
export const BLOG_BASE_PATH = "";

// Locale advertised as hreflang x-default (the fallback for unmatched users/crawlers).
export const SEO_X_DEFAULT_LOCALE = LANGUAGE.TH;

// Logical, locale-less public routes. Single source for sitemap + nav.
// Add a route here once and it flows into the sitemap with hreflang automatically.
// "" = the locale homepage (/th, /en). Admin, auth, examples, and dynamic blog
// routes are intentionally excluded (handled separately or noindex).
export const PUBLIC_STATIC_ROUTES = [] as const;

export type PublicStaticRoute = (typeof PUBLIC_STATIC_ROUTES)[number];

/**
 * Maps each static route to its `page_seo.page_code` (the exact PascalCase code each page.tsx
 * passes to buildPageMetadata, matching the DB). Sitemap `<lastmod>` comes only from
 * `page_seo.updatedAt` â routes with no matching row are omitted. Keep in sync with page.tsx codes.
 */
export const STATIC_ROUTE_PAGE_CODE: Record<PublicStaticRoute, string> = {};

// Organization identity for JSON-LD + OG.
export const ORGANIZATION = {
  name: "",
  alternateName: "",
  legalName: "",
  description: "",
  logoPath: "/logo.png",
  sameAs: [] as string[],
  knowsAbout: [] as string[],
} as const;

export const SERVICE = {
  name: "",
  serviceType: "",
  description: "",
} as const;
