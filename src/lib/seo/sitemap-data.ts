"server-only";

import { getSiteUrl, isPreviewDeployment, localeUrl } from "@/lib/seo/metadata"
import authorAppService from "@/services/modules/app-service/author.app-service"
import blogSeoAppService from "@/services/modules/app-service/blog-seo.app-service"
import languageAppService from "@/services/modules/app-service/language.app-service"
import pageSeoAppService from "@/services/modules/app-service/page-seo.app-service"

import { routing } from "@/i18n/routing"
import {
  BLOG_BASE_PATH,
  PUBLIC_STATIC_ROUTES,
  SEO_X_DEFAULT_LOCALE,
  STATIC_ROUTE_PAGE_CODE,
} from "@/shared/constants/seo.constants"

/**
 * The URL list behind `/sitemap.xml` and the human-readable `/sitemap-view` page. One builder so
 * the page can never show a different set of URLs than the XML a crawler gets.
 *
 * Every read is `no-store`: the sitemap is the one surface where a cache hit is indistinguishable
 * from a bug (see the comment in app/sitemap.ts).
 */
const NO_STORE: RequestInit = { cache: "no-store" }

export type SitemapEntryType = "static" | "blogCategory" | "blog" | "author"

export type SitemapUrlEntry = {
  url: string
  /** Locale-less logical path, for grouping and display. */
  path: string
  locale: string
  type: SitemapEntryType
  lastModified?: Date
  /** hreflang -> absolute URL, including `x-default`. */
  languages: Record<string, string>
}

type ActiveLocale = { code: string }

/** Parse a CMS date; reject invalid values so `<lastmod>` is never an Invalid Date. */
function parseDate(value: string | Date | undefined | null): Date | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/**
 * Locales that are both active in the CMS `languages` table and routable in this app. Anything
 * else would advertise a URL that 404s.
 */
async function getActiveLocales(): Promise<ActiveLocale[]> {
  const languages = await languageAppService.getLanguages(undefined, false, NO_STORE)
  const routable = new Set<string>(routing.locales)
  const seen = new Set<string>()

  const active: ActiveLocale[] = []
  for (const row of languages) {
    const code = row.languageCode?.trim().toLowerCase()
    if (!code || seen.has(code) || !routable.has(code)) continue
    seen.add(code)
    active.push({ code })
  }

  if (!active.length) {
    // Throw rather than return []: a 500 tells the crawler to retry and keeps the sitemap it
    // already has, while an empty sitemap actively says "nothing here to index".
    throw new Error("[sitemap] no active routable locale")
  }
  return active
}

function languagesFor(path: string, locales: ActiveLocale[], xDefault: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) languages[locale.code] = localeUrl(locale.code, path)
  languages["x-default"] = localeUrl(xDefault, path)
  return languages
}

type PageSeoIndex = {
  /** `${pageCode}:${locale}` -> content updated date, for `<lastmod>`. */
  lastmod: Map<string, Date>
  /** `${pageCode}:${locale}` for rows the CMS marked noindex. */
  noindex: Set<string>
}

async function loadPageSeoIndex(): Promise<PageSeoIndex> {
  const rows = await pageSeoAppService.getPageSeoList(undefined, NO_STORE)
  const lastmod = new Map<string, Date>()
  const noindex = new Set<string>()

  for (const row of rows) {
    const key = `${row.pageCode}:${row.languageCode.toLowerCase()}`
    if (row.robotsIndex === false) noindex.add(key)
    const date = parseDate(row.updatedAt)
    if (date) lastmod.set(key, date)
  }
  return { lastmod, noindex }
}

export async function getSitemapUrls(): Promise<SitemapUrlEntry[]> {
  // Preview deployments must never be crawled; robots.ts blocks them, this keeps the URL list out
  // of reach too.
  if (isPreviewDeployment()) return []

  // Fail loud before any URL is built if the site origin env is missing.
  getSiteUrl()

  const locales = await getActiveLocales()
  const xDefault = locales.some((locale) => locale.code === SEO_X_DEFAULT_LOCALE)
    ? SEO_X_DEFAULT_LOCALE
    : locales[0]!.code

  // Errors propagate on purpose: without a cache there is no last-good sitemap to fall back on,
  // and publishing a sitemap that silently lost every blog URL is worse than answering 500.
  const [pageSeo, blogRows, authors] = await Promise.all([
    loadPageSeoIndex(),
    blogSeoAppService.getSitemapEntries(NO_STORE),
    authorAppService.getAuthors(NO_STORE),
  ])

  const staticEntries: SitemapUrlEntry[] = PUBLIC_STATIC_ROUTES.flatMap((path) =>
    locales.flatMap((locale) => {
      const pageCode = STATIC_ROUTE_PAGE_CODE[path]
      const key = `${pageCode}:${locale.code.toLowerCase()}`
      // The CMS said noindex — listing it here would contradict the page's own robots meta.
      if (pageCode && pageSeo.noindex.has(key)) return []

      return [
        {
          url: localeUrl(locale.code, path),
          path: path || "/",
          locale: locale.code,
          type: "static" as const,
          lastModified: pageSeo.lastmod.get(key),
          languages: languagesFor(path, locales, xDefault),
        },
      ]
    }),
  )

  const localeCodes = new Set(locales.map((locale) => locale.code))
  const blogEntries: SitemapUrlEntry[] = []
  /** Newest blog date per `${locale}:::${category}` — drives the category listing `<lastmod>`. */
  const categoryLastmod = new Map<string, { locale: string; category: string; lastmod: Date }>()
  /** Newest blog date per author slug, across locales — drives the author page `<lastmod>`. */
  const authorLastmod = new Map<string, Date>()

  for (const entry of blogRows) {
    if (!localeCodes.has(entry.languageCode)) continue
    const lastModified = parseDate(entry.updatedAt)
    // Skip rather than invent a date — a wrong `<lastmod>` is worse than no URL.
    if (!lastModified) continue

    const path = `${BLOG_BASE_PATH}/${entry.category}/${entry.slug}`
    blogEntries.push({
      url: localeUrl(entry.languageCode, path),
      path,
      locale: entry.languageCode,
      type: "blog",
      lastModified,
      languages: languagesFor(path, locales, xDefault),
    })

    const categoryKey = `${entry.languageCode}:::${entry.category}`
    const category = categoryLastmod.get(categoryKey)
    if (!category || lastModified > category.lastmod) {
      categoryLastmod.set(categoryKey, { locale: entry.languageCode, category: entry.category, lastmod: lastModified })
    }

    if (entry.authorSlug) {
      const previous = authorLastmod.get(entry.authorSlug)
      if (!previous || lastModified > previous) authorLastmod.set(entry.authorSlug, lastModified)
    }
  }

  const categoryEntries: SitemapUrlEntry[] = Array.from(categoryLastmod.values()).map(
    ({ locale, category, lastmod }) => {
      const path = `${BLOG_BASE_PATH}/${category}`
      return {
        url: localeUrl(locale, path),
        path,
        locale,
        type: "blogCategory",
        lastModified: lastmod,
        languages: languagesFor(path, locales, xDefault),
      }
    },
  )

  const authorEntries: SitemapUrlEntry[] = authors.flatMap((author) => {
    const slug = author.authorSlug?.trim()
    if (!slug) return []
    const lastModified = authorLastmod.get(slug)
    // An author with no published blog has nothing dated to point at, and an author page with no
    // articles is not worth a crawl.
    if (!lastModified) return []

    const path = `/author/${slug}`
    return locales.map((locale) => ({
      url: localeUrl(locale.code, path),
      path,
      locale: locale.code,
      type: "author" as const,
      lastModified,
      languages: languagesFor(path, locales, xDefault),
    }))
  })

  return [...staticEntries, ...categoryEntries, ...blogEntries, ...authorEntries]
}

/**
 * URLs per child sitemap. The protocol's hard ceiling is 50,000 URLs (or 50MB) per file; 10,000
 * keeps every file about a fifth of that, so one growing group can never quietly cross the line
 * and get the whole file rejected.
 */
export const SITEMAP_MAX_URLS = 10_000

/** Group order in the index. Static first: it is the part a human reads. */
const SHARD_ORDER: SitemapEntryType[] = ["static", "blogCategory", "blog", "author"]

/** Stable, human-readable slug per group — becomes `/sitemap/{id}.xml`. */
const SHARD_SLUG: Record<SitemapEntryType, string> = {
  static: "pages",
  blogCategory: "blog-categories",
  blog: "blog-articles",
  author: "authors",
}

/**
 * Parts reserved per group, so `generateSitemaps()` can return its id list without touching the
 * API: Next collects those ids at BUILD time, and a build-time fetch has no request origin for
 * app-service to resolve the domain from — it 400s and fails the build. Fixed ids keep the build
 * data-free while every child still renders per request.
 *
 * Capacity per group = SITEMAP_MAX_PARTS × SITEMAP_MAX_URLS. Unused parts are never linked: the
 * index lists only shards that actually hold URLs.
 */
export const SITEMAP_MAX_PARTS = 10

/** Every routable child id, in index order. `generateSitemaps()` returns exactly this. */
export const SITEMAP_SHARD_IDS: string[] = SHARD_ORDER.flatMap((type) =>
  Array.from({ length: SITEMAP_MAX_PARTS }, (_, index) =>
    index === 0 ? SHARD_SLUG[type] : `${SHARD_SLUG[type]}-${index + 1}`,
  ),
)

export type SitemapShard = {
  /** `pages`, `blog-articles`, `blog-articles-2`, … — the `{id}` in `/sitemap/{id}.xml`. */
  id: string
  type: SitemapEntryType
  /** 1-based part number within the group. */
  part: number
  entries: SitemapUrlEntry[]
  /** Newest `lastModified` in this shard, for the index's own `<lastmod>`. */
  lastModified?: Date
}

/**
 * One child sitemap per group, split again every `SITEMAP_MAX_URLS` URLs. An empty group produces
 * no shard: a `<loc>` in the index pointing at an empty `<urlset>` is only noise for a crawler.
 */
export function buildSitemapShards(entries: SitemapUrlEntry[]): SitemapShard[] {
  const shards: SitemapShard[] = []

  for (const type of SHARD_ORDER) {
    const group = entries.filter((entry) => entry.type === type)
    const capacity = SITEMAP_MAX_PARTS * SITEMAP_MAX_URLS
    if (group.length > capacity) {
      // Loud rather than silent: past this point URLs would fall off the end with no routable id
      // to live in. Raising SITEMAP_MAX_PARTS is the fix, and it needs a deploy.
      console.error("[sitemap] group exceeds reserved parts — URLs dropped", {
        type,
        urls: group.length,
        capacity,
        dropped: group.length - capacity,
      })
    }

    for (let index = 0; index < Math.min(group.length, capacity); index += SITEMAP_MAX_URLS) {
      const chunk = group.slice(index, index + SITEMAP_MAX_URLS)
      const part = index / SITEMAP_MAX_URLS + 1
      const times = chunk
        .map((entry) => entry.lastModified?.getTime())
        .filter((time): time is number => typeof time === "number")

      shards.push({
        id: part === 1 ? SHARD_SLUG[type] : `${SHARD_SLUG[type]}-${part}`,
        type,
        part,
        entries: chunk,
        lastModified: times.length ? new Date(Math.max(...times)) : undefined,
      })
    }
  }

  return shards
}

export async function getSitemapShards(): Promise<SitemapShard[]> {
  return buildSitemapShards(await getSitemapUrls())
}
