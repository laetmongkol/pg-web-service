import { getActiveLocales } from "@/lib/seo/active-locales"
import pageSeoAppServiceServer from "@/services/modules/app-service/server/page-seo.app-service.server"

import type { PageSeoResponseDto } from "@/services/generated-cli/api-app-service"
import type { Metadata } from "next"

import { ORGANIZATION, SEO_X_DEFAULT_LOCALE } from "@/shared/constants/seo.constants"

export const SITE_METADATA = {
  name: "",
  defaultTitle: "",
  description:
    "",
  titleTemplate: "%s",
  keywords: [
    "",
  ],
  ogImage: "/og-default.png",
} as const

/** Indexable public marketing pages — sitemap + canonical routes. */
export const PUBLIC_INDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-image-preview": "large" },
}

/** Admin, auth, and other non-marketing surfaces. */
export const NOINDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
}

/** Vercel Preview deployments (branch/PR previews) must never be indexed or listed in a sitemap. */
export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview"
}

/**
 * Single source of truth for the canonical absolute origin.
 * Fail-loud in production so a missing env var can never ship localhost
 * URLs into sitemap/robots/canonical tags (the previous latent bug).
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "")
  if (url) return url
  if (process.env.NODE_ENV === "production") {
    throw new Error("[seo] NEXT_PUBLIC_APP_URL must be set in production")
  }
  return "http://localhost:3004"
}

/** Backward-compatible alias. Prefer getSiteUrl(). */
export function getAppUrl(): string {
  return getSiteUrl()
}

// "" | "/" -> "" (homepage); "/about/" -> "/about". Always leading slash, never trailing.
function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "")
  if (!trimmed || trimmed === "/") return ""
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

export function localeUrl(locale: string, pathname: string): string {
  return `${getSiteUrl()}/${locale}${normalizePath(pathname)}`
}

/**
 * Self-canonical per locale + reciprocal hreflang alternates + x-default.
 * Drop the result straight into a page's `alternates`.
 */
export type PageAlternates = {
  canonical: string
  /** Absent when the locale set is unknown — better no hreflang than a wrong one. */
  languages?: Record<string, string>
}

export async function buildAlternates(
  locale: string,
  pathname: string,
): Promise<PageAlternates> {
  const path = normalizePath(pathname)
  const canonical = localeUrl(locale, path)

  let activeLocales: Awaited<ReturnType<typeof getActiveLocales>>
  try {
    activeLocales = await getActiveLocales()
  } catch (error: unknown) {
    console.warn("[seo] language lookup failed, emitting canonical without hreflang", { path, error })
    return { canonical }
  }
  if (!activeLocales.length) return { canonical }

  const languages: Record<string, string> = {}
  for (const active of activeLocales) {
    languages[active.code] = localeUrl(active.code, path)
  }
  const xDefault = activeLocales.some((active) => active.code === SEO_X_DEFAULT_LOCALE)
    ? SEO_X_DEFAULT_LOCALE
    : activeLocales[0]!.code
  languages["x-default"] = localeUrl(xDefault, path)

  return { canonical, languages }
}

/**
 * CMS canonical override, validated. Canonical is a directive that consolidates ranking signal,
 * so a typo in `page_seo.canonical_url` would hand the page's signal to whatever was typed.
 * Anything that does not resolve to our own origin is treated as absent (self-canonical), never
 * as an error — a bad CMS value must not take the page down.
 *
 * Relative values ("/th/about") resolve against the site origin, which is what CMS editors type.
 */
function resolveCanonicalOverride(raw: string | null | undefined): string | undefined {
  const value = raw?.trim()
  if (!value) return undefined

  const siteUrl = getSiteUrl()
  let parsed: URL
  try {
    parsed = new URL(value, siteUrl)
  } catch {
    console.warn("[seo] canonicalUrl is not a valid URL — using self-canonical", { value })
    return undefined
  }

  if (parsed.origin !== new URL(siteUrl).origin) {
    console.warn("[seo] canonicalUrl points off-origin — using self-canonical", { value })
    return undefined
  }

  return `${parsed.origin}${normalizePath(parsed.pathname)}${parsed.search}`
}

/**
 * `buildAlternates` plus a validated CMS canonical override. When the override wins, this
 * locale's hreflang self-reference follows it — canonical and hreflang disagreeing makes Google
 * drop the whole language cluster, so they move together or not at all.
 */
async function buildPageAlternates(
  locale: string,
  pathname: string,
  canonicalOverride: string | undefined,
): Promise<PageAlternates> {
  const { canonical, languages } = await buildAlternates(locale, pathname)
  if (!canonicalOverride) return { canonical, languages }
  if (!languages) return { canonical: canonicalOverride }

  const selfHref = languages[locale]
  const synced: Record<string, string> = { ...languages, [locale]: canonicalOverride }
  // x-default points at one of the locale URLs; if it pointed at the one we just moved, it moves too.
  if (selfHref && synced["x-default"] === selfHref) {
    synced["x-default"] = canonicalOverride
  }

  return { canonical: canonicalOverride, languages: synced }
}

export function createRootMetadata(): Metadata {
  const appUrl = getSiteUrl()

  return {
    verification: {
      // google: "ePYcPPQt7fimenaUD9AmAuBTBjdpQHSjHCez0XDp3wI",
    },
    metadataBase: new URL(appUrl),
    title: {
      default: SITE_METADATA.defaultTitle,
      template: SITE_METADATA.titleTemplate,
    },
    description: SITE_METADATA.description,
    keywords: [...SITE_METADATA.keywords],
    authors: [{ name: SITE_METADATA.name, url: appUrl }],
    publisher: SITE_METADATA.name,
    category: "business",
    robots: PUBLIC_INDEX_ROBOTS,
    // Icons come from the file-convention API (app/favicon.ico, app/icon.png,
    // app/apple-icon.png) — no explicit `icons` config to keep in sync.
    // No `alternates` here on purpose: canonical/hreflang are per-page values, and Next merges
    // metadata shallowly — a root-level canonical is inherited by every segment that doesn't set
    // its own, which made 404s and not-found metadata declare themselves the homepage.
    openGraph: {
      type: "website",
      siteName: SITE_METADATA.name,
      title: SITE_METADATA.defaultTitle,
      description: SITE_METADATA.description,
      url: appUrl,
      images: [{ url: SITE_METADATA.ogImage, width: 1200, height: 630, alt: ORGANIZATION.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_METADATA.defaultTitle,
      description: SITE_METADATA.description,
      images: [SITE_METADATA.ogImage],
    },
  }
}

type BuildPageMetadataInput = {
  locale: string
  /** Locale-less logical path, e.g. "/about" or "" for the homepage. */
  pathname: string
  /** Optional override OG image (absolute or root-relative). */
  ogImage?: string
  /** page_seo.content_page_code — the content_pages.page_code this page maps to, e.g. "ForexTradingPlatform", "Home". */
  pageCode: string
}

function robotsFromPageSeo(row: PageSeoResponseDto | null): NonNullable<Metadata["robots"]> {
  if (!row) return PUBLIC_INDEX_ROBOTS
  return {
    index: row.robotsIndex,
    follow: row.robotsFollow,
    googleBot: {
      index: row.robotsIndex,
      follow: row.robotsFollow,
      "max-image-preview": "large",
    },
  }
}

function optionalText(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

/**
 * Localized, canonical-correct metadata for a single page.
 * Prefers `page_seo` (API). Falls back to next-intl `seo.*` namespace when missing.
 */
export async function buildPageMetadata({
  locale,
  pathname,
  ogImage,
  pageCode,
}: BuildPageMetadataInput): Promise<Metadata> {
  const row = await pageSeoAppServiceServer.getPageSeoCached(pageCode, locale)

  let title: string
  let description: string
  let resolvedOgImage = ogImage ?? SITE_METADATA.ogImage

  if (row?.metaTitle || row?.metaDescription) {
    const baseTitle = optionalText(row.metaTitle, SITE_METADATA.defaultTitle)
    const subTitle = row.metaSubTitle?.trim()
    title = subTitle ? `${baseTitle} | ${subTitle}` : baseTitle
    description = optionalText(row.metaDescription, SITE_METADATA.description)
    if (row.ogImageUrl) resolvedOgImage = row.ogImageUrl
  } else {
    // No i18n fallback: page_seo is the single source. Empty row → static defaults.
    title = SITE_METADATA.defaultTitle
    description = SITE_METADATA.description
  }

  const keywords = [row?.primaryKeyword, ...(row?.secondaryKeywords ?? [])]
    .map((keyword) => keyword?.trim())
    .filter((keyword): keyword is string => !!keyword)

  const canonicalOverride = resolveCanonicalOverride(row?.canonicalUrl)
  const url = canonicalOverride || localeUrl(locale, pathname)
  const ogTitle = optionalText(row?.ogTitle, title)
  const ogDescription = optionalText(row?.ogDescription, description)

  return {
    title,
    description,
    // No keywords → inherit the root layout defaults instead of emitting an empty tag.
    ...(keywords.length ? { keywords } : {}),
    robots: robotsFromPageSeo(row),
    alternates: await buildPageAlternates(locale, pathname, canonicalOverride),
    openGraph: {
      type: "website",
      siteName: SITE_METADATA.name,
      title: ogTitle,
      description: ogDescription,
      url,
      locale,
      images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [resolvedOgImage],
    },
  }
}
