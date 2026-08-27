import { type ActiveLocale, getActiveLocales } from "@/lib/seo/active-locales"
import { getSiteUrl, localeUrl } from "@/lib/seo/metadata"
import {
  authorAppServiceServer,
  blogAppServiceServer,
  pageSeoAppServiceServer,
} from "@/services/modules/app-service/server"

import type { AuthorResponseDto } from "@/services/generated-cli/api-app-service"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { getLanguageLabel } from "@/shared/constants/language.constants"
import {
  BLOG_BASE_PATH,
  PUBLIC_STATIC_ROUTES,
  type PublicStaticRoute,
  SEO_X_DEFAULT_LOCALE,
  STATIC_ROUTE_PAGE_CODE,
} from "@/shared/constants/seo.constants"

export type SitemapEntryType = "static" | "blog" | "blogCategory" | "author"

export type SitemapEntry = {
  url: string
  path: string
  locale: string
  localeLabel: string
  type: SitemapEntryType
  /** Omitted when the CMS has no updated date — `<lastmod>` is optional, the URL is not. */
  lastModified: Date | null
  changeFrequency: "daily" | "weekly"
  languages: Record<string, string>
  languageLabels: Record<string, string>
}

type ActiveSitemapLocale = ActiveLocale

/** Parse CMS date (ISO string or Date); reject invalid values so we never emit Invalid Date. */
function parseLastModified(value: string | Date | undefined | null): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (!value?.trim()) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Static-route lastmod from CMS `page_seo.updatedAt` only. No hardcoded fallback. */
function getStaticLastModified(
  path: PublicStaticRoute,
  locale: string,
  pageSeoLastmod: Map<string, Date>,
): Date | null {
  const pageCode = STATIC_ROUTE_PAGE_CODE[path]
  if (!pageCode) return null
  return pageSeoLastmod.get(`${pageCode}:${locale.toLowerCase()}`) ?? null
}

type PageSeoIndex = {
  /** `${pageCode}:${locale}` -> content updated date. */
  lastmod: Map<string, Date>
  /** `${pageCode}:${locale}` for rows the CMS marked noindex. */
  noindex: Set<string>
}

/**
 * One pass over `page_seo` for both the lastmod dates and the noindex flags. A page the CMS
 * marked noindex must not appear in the sitemap — listing it says "come index this" while the
 * page itself says the opposite.
 *
 * Errors propagate: an empty index would silently drop every `<lastmod>` and un-hide every
 * noindex page, which is worse than letting ISR serve the previous XML.
 */
async function loadPageSeoIndex(): Promise<PageSeoIndex> {
  const lastmod = new Map<string, Date>()
  const noindex = new Set<string>()

  const rows = await pageSeoAppServiceServer.getPageSeoListCached()
  for (const row of rows) {
    const key = `${row.pageCode}:${row.languageCode.toLowerCase()}`
    if (row.robotsIndex === false) noindex.add(key)
    const date = parseLastModified(row.updatedAt)
    if (date) lastmod.set(key, date)
  }

  return { lastmod, noindex }
}

/** Author profile pages — one per active locale; lastmod = that author's latest published blog. */
async function buildAuthorEntries(
  activeLocales: ActiveSitemapLocale[],
  xDefault: LANGUAGE,
  labels: Record<string, string>,
  authorLastmodBySlug: Map<string, Date>,
): Promise<SitemapEntry[]> {
  let authors: AuthorResponseDto[] = []
  try {
    authors = await authorAppServiceServer.getAuthorsCached()
  } catch {
    authors = []
  }

  const entries: SitemapEntry[] = []
  for (const author of authors) {
    const slug = author.authorSlug?.trim()
    if (!slug) continue
    const lastModified = authorLastmodBySlug.get(slug)
    // Skip rather than invent a date — bad lastmod is worse than no URL.
    if (!lastModified) continue
    const path = `/author/${slug}`
    for (const locale of activeLocales) {
      entries.push({
        url: localeUrl(locale.code, path),
        path,
        locale: locale.code,
        localeLabel: locale.label || getLanguageLabel(locale.code),
        type: "author",
        lastModified,
        changeFrequency: "weekly",
        languages: languagesFor(path, activeLocales, xDefault),
        languageLabels: labels,
      })
    }
  }
  return entries
}

/**
 * Active, routable locales — see `lib/active-locales.ts`. No fallback constant on purpose.
 *
 * The old fallback swallowed the error and returned a hardcoded locale list, which produced a
 * *successful* render that overwrote the cached XML. Letting the failure through means the route
 * throws and ISR keeps serving the last good sitemap until the API recovers — which is the
 * behaviour the fallback was trying to imitate, done correctly.
 */
async function resolveActiveSitemapLocales(): Promise<ActiveSitemapLocale[]> {
  const active = await getActiveLocales()
  if (!active.length) {
    throw new Error("[sitemap] no active routable locale — refusing to build an empty sitemap")
  }
  return active
}

function languagesFor(path: string, locales: ActiveSitemapLocale[], xDefault: LANGUAGE): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale.code] = localeUrl(locale.code, path)
  }
  languages["x-default"] = localeUrl(xDefault, path)
  return languages
}

function languageLabelsFor(locales: ActiveSitemapLocale[]): Record<string, string> {
  const labels: Record<string, string> = { "x-default": getLanguageLabel("x-default") }
  for (const locale of locales) {
    labels[locale.code] = locale.label || getLanguageLabel(locale.code)
  }
  return labels
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const activeLocales = await resolveActiveSitemapLocales()

  const xDefault = activeLocales.some((locale) => locale.code === SEO_X_DEFAULT_LOCALE)
    ? SEO_X_DEFAULT_LOCALE
    : activeLocales[0]!.code
  const labels = languageLabelsFor(activeLocales)

  const pageSeo = await loadPageSeoIndex()

  const staticEntries: SitemapEntry[] = PUBLIC_STATIC_ROUTES.flatMap((path) =>
    activeLocales.flatMap((locale) => {
      const pageCode = STATIC_ROUTE_PAGE_CODE[path]
      // The CMS said noindex — listing it here would contradict the page's own robots meta.
      if (pageCode && pageSeo.noindex.has(`${pageCode}:${locale.code.toLowerCase()}`)) return []

      const lastModified = getStaticLastModified(path, locale.code, pageSeo.lastmod)
      // `<lastmod>` is optional in the sitemap protocol; the URL is not. Emit it either way and
      // log so the missing page_seo row gets filled in rather than silently hiding the page.
      if (!lastModified) {
        console.warn("[sitemap] no page_seo row — emitting URL without lastmod", {
          path: path || "/",
          locale: locale.code,
          pageCode: pageCode ?? "(unmapped)",
        })
      }
      return [
        {
          url: localeUrl(locale.code, path),
          path: path || "/",
          locale: locale.code,
          localeLabel: locale.label || getLanguageLabel(locale.code),
          type: "static" as const,
          lastModified,
          changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
          languages: languagesFor(path, activeLocales, xDefault),
          languageLabels: labels,
        },
      ]
    }),
  )

  // One API call for all languages; lastmod = that language's CMS updated_date.
  let blogRows: Awaited<ReturnType<typeof blogAppServiceServer.getSitemapEntriesCached>> = []
  try {
    blogRows = await blogAppServiceServer.getSitemapEntriesCached()
  } catch {
    blogRows = []
  }

  const activeLocaleByCode = new Map<string, ActiveSitemapLocale>(
    activeLocales.map((locale) => [locale.code, locale]),
  )
  const blogEntries: SitemapEntry[] = []
  // Per (locale, category-slug) newest blog date → drives the category listing lastmod.
  const categoryLastmod = new Map<string, { locale: ActiveSitemapLocale; category: string; lastmod: Date }>()
  // Per author-slug newest blog date across all locales → drives the author page lastmod.
  const authorLastmodBySlug = new Map<string, Date>()

  for (const entry of blogRows) {
    const locale = activeLocaleByCode.get(entry.languageCode)
    if (!locale) continue

    const path = `${BLOG_BASE_PATH}/${entry.category}/${entry.slug}`
    const lastModified = parseLastModified(entry.updatedAt)
    // Skip rather than invent a date — bad lastmod is worse than no lastmod signal.
    if (!lastModified) continue

    blogEntries.push({
      url: localeUrl(locale.code, path),
      path,
      locale: locale.code,
      localeLabel: locale.label || getLanguageLabel(locale.code),
      type: "blog",
      lastModified,
      changeFrequency: "weekly",
      languages: languagesFor(path, activeLocales, xDefault),
      languageLabels: labels,
    })

    const categoryKey = `${locale.code}:::${entry.category}`
    const prevCategory = categoryLastmod.get(categoryKey)
    if (!prevCategory || lastModified > prevCategory.lastmod) {
      categoryLastmod.set(categoryKey, { locale, category: entry.category, lastmod: lastModified })
    }

    if (entry.authorSlug) {
      const prevAuthor = authorLastmodBySlug.get(entry.authorSlug)
      if (!prevAuthor || lastModified > prevAuthor) {
        authorLastmodBySlug.set(entry.authorSlug, lastModified)
      }
    }
  }

  // Blog category listing pages — one per (locale, category) that has published blogs.
  const categoryEntries: SitemapEntry[] = Array.from(categoryLastmod.values()).map(
    ({ locale, category, lastmod }) => {
      const path = `${BLOG_BASE_PATH}/${category}`
      return {
        url: localeUrl(locale.code, path),
        path,
        locale: locale.code,
        localeLabel: locale.label || getLanguageLabel(locale.code),
        type: "blogCategory",
        lastModified: lastmod,
        changeFrequency: "weekly",
        languages: languagesFor(path, activeLocales, xDefault),
        languageLabels: labels,
      }
    },
  )

  const authorEntries = await buildAuthorEntries(activeLocales, xDefault, labels, authorLastmodBySlug)

  // Fail loud if prod site URL env is missing.
  getSiteUrl()

  return [...staticEntries, ...categoryEntries, ...blogEntries, ...authorEntries]
}

export function toSitemapCsv(entries: SitemapEntry[]): string {
  const hreflangKeys = Array.from(
    new Set(entries.flatMap((entry) => Object.keys(entry.languages))),
  ).sort((a, b) => {
    if (a === "x-default") return 1
    if (b === "x-default") return -1
    return a.localeCompare(b)
  })

  const headers = [
    "index",
    "type",
    "locale",
    "locale_label",
    "path",
    "url",
    "last_modified",
    "change_frequency",
    ...hreflangKeys.map((key) => `hreflang_${key}`),
  ]

  const rows = entries.map((entry, index) => {
    const cells = [
      String(index + 1),
      entry.type,
      entry.locale,
      entry.localeLabel,
      entry.path,
      entry.url,
      entry.lastModified?.toISOString() ?? "",
      entry.changeFrequency,
      ...hreflangKeys.map((key) => entry.languages[key] ?? ""),
    ]
    return cells.map(csvCell).join(",")
  })

  return `\uFEFF${[headers.join(","), ...rows].join("\n")}\n`
}

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}
