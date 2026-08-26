import { LANGUAGE } from "./common.constants";

// hreflang and sitemap locales both come from the languages table at runtime, intersected with
// routable locales (see lib/active-locales.ts). No compile-time locale list here on purpose —
// a third source would drift from the other two and advertise locales that 404.
export const SEO_DEFAULT_LOCALE = LANGUAGE.TH;
/**
 * Public blog base path. Single source: canonical, breadcrumbs, article hrefs and the sitemap
 * all derive from this, so renaming the route is one edit instead of nine.
 */
export const BLOG_BASE_PATH = "/blog-new";

// Locale advertised as hreflang x-default (the fallback for unmatched users/crawlers).
export const SEO_X_DEFAULT_LOCALE = LANGUAGE.TH;

// Logical, locale-less public routes. Single source for sitemap + nav.
// Add a route here once and it flows into the sitemap with hreflang automatically.
// "" = the locale homepage (/th, /en). Admin, auth, examples, and dynamic blog
// routes are intentionally excluded (handled separately or noindex).
export const PUBLIC_STATIC_ROUTES = [
  "",
  "/about-us-new",
  "/partners-new",
  "/contact-us",
  "/register-trading",
  "/promotion",
  "/promotion/point-mall",
  BLOG_BASE_PATH,
  "/services",
  "/services/forex-trading",
  "/services/forex-trading-platform",
  "/services/forex-broker-thailand",
  "/services/forex-course",
  "/services/forex-expert-advisor",
  "/services/open-forex-account",
  "/services/trading-demo-free",
  "/services/gold-trading",
] as const;

export type PublicStaticRoute = (typeof PUBLIC_STATIC_ROUTES)[number];

/**
 * Maps each static route to its `page_seo.page_code` (the exact PascalCase code each page.tsx
 * passes to buildPageMetadata, matching the DB). Sitemap `<lastmod>` comes only from
 * `page_seo.updatedAt` â routes with no matching row are omitted. Keep in sync with page.tsx codes.
 */
export const STATIC_ROUTE_PAGE_CODE: Record<PublicStaticRoute, string> = {
  "": "Home",
  "/about-us-new": "AboutUs",
  "/partners-new": "PartnersNew",
  "/contact-us": "ContactUs",
  "/register-trading": "RegisterTrading",
  "/promotion": "Promotions",
  "/promotion/point-mall": "PointMall",
  [BLOG_BASE_PATH]: "Blog",
  "/services": "Services",
  "/services/forex-trading": "ForexTrading",
  "/services/forex-trading-platform": "ForexTradingPlatform",
  "/services/forex-broker-thailand": "ForexBrokerThailand",
  "/services/forex-course": "ForexCourse",
  "/services/forex-expert-advisor": "ForexExpertAdvisor",
  "/services/open-forex-account": "OpenForexAccount",
  "/services/trading-demo-free": "TradingDemoFree",
  "/services/gold-trading": "GoldTrading",
};

// Organization identity for JSON-LD + OG.
export const ORGANIZATION = {
  name: "GOC Prime",
  alternateName: "GOC Prime Broker",
  legalName: "GOC Prime",
  description:
    "à¹à¸à¸£à¸à¹à¸à¸­à¸£à¹à¸£à¸°à¸à¸±à¸à¸à¸£à¸µà¹à¸¡à¸µà¸¢à¸¡ à¸¡à¸²à¸à¸£à¸à¸²à¸à¸ªà¸²à¸à¸¥ à¹à¸à¸¥à¸à¸à¸­à¸£à¹à¸¡à¹à¸à¸£à¸ Forex, Gold, Crypto à¹à¸¥à¸°à¸«à¸¸à¹à¸à¸à¸±à¹à¸§à¹à¸¥à¸ à¸à¹à¸²à¸à¸£à¸£à¸¡à¹à¸à¸µà¸¢à¸¡à¸à¹à¸³ à¸à¸²à¸à¸à¸­à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´ 24 à¸à¸¡.",
  logoPath: "/logo.png",
  // Social profiles only — the site's own URL is added from getSiteUrl() in json-ld.ts.
  sameAs: ["https://www.facebook.com/profile.php?id=61593048774179"] as string[],
  knowsAbout: [
    "Forex Trading",
    "Cryptocurrency Trading",
    "Gold Trading",
    "Stock Trading",
    "Financial Broker Services",
  ] as string[],
} as const;

// Primary service offered, for the JSON-LD Service node.
export const SERVICE = {
  name: "à¸à¸£à¸´à¸à¸²à¸£à¹à¸à¸¥à¸à¸à¸­à¸£à¹à¸¡à¹à¸à¸£à¸ Forex à¹à¸¥à¸°à¸ªà¸´à¸à¸à¸£à¸±à¸à¸¢à¹à¸à¸²à¸à¸à¸²à¸£à¹à¸à¸´à¸",
  serviceType: "Online Trading Broker",
  description:
    "à¸à¸£à¸´à¸à¸²à¸£à¹à¸à¸£à¸ Forex, à¸à¸­à¸à¸à¸³, à¸à¸£à¸´à¸à¹à¸ à¹à¸¥à¸°à¸«à¸¸à¹à¸à¸à¸±à¹à¸§à¹à¸¥à¸ à¸ªà¹à¸à¸£à¸à¸à¹à¸³ à¸ªà¹à¸à¸à¸³à¸ªà¸±à¹à¸à¸£à¸§à¸à¹à¸£à¹à¸§ à¸£à¸­à¸à¸£à¸±à¸à¸à¸²à¸£à¸à¸²à¸à¸à¸­à¸à¸­à¸±à¸à¹à¸à¸¡à¸±à¸à¸´ 24 à¸à¸±à¹à¸§à¹à¸¡à¸ à¸à¸£à¹à¸­à¸¡à¸à¸±à¸à¸à¸­à¸£à¹à¸à¸ à¸²à¸©à¸²à¹à¸à¸¢à¸à¸¥à¸­à¸ 24/7",
} as const;
