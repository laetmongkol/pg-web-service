import { getSitemapShards, SITEMAP_SHARD_IDS } from "@/lib/seo/sitemap-data"

import type { MetadataRoute } from "next"

/**
 * Child sitemaps, one per group (`pages`, `blog-categories`, `blog-articles`, `authors`), split
 * again every `SITEMAP_MAX_URLS`. Next's own sitemap convention writes each `<urlset>` — including
 * the `xhtml:link` hreflang alternates — and serves them at `/sitemap/{id}.xml`.
 *
 * `/sitemap.xml` is the index that lists them (app/sitemap.xml/route.ts); Next has no built-in
 * `<sitemapindex>` writer, which is the one piece it cannot do for us. `robots.txt` points at the
 * index only, so a crawler discovers every child from there.
 *
 * Why split at all: the protocol rejects a file over 50,000 URLs (or 50MB) outright — not
 * partially — and Next neither splits nor warns, it serializes whatever the array holds. Per-group
 * files also mean a crawler can re-read the articles file without re-reading everything else.
 *
 * `force-dynamic` on purpose: the previous hand-built sitemap route was prerendered into a static
 * file at build time, so `/sitemap.xml` never changed until the next deploy while `<lastmod>` kept
 * pointing at a stale date. Every read inside `getSitemapShards()` is `no-store` for the same
 * reason — an ISR window or a Data Cache hit would put the exact same staleness back one layer
 * down. Cost: one API round trip per crawl of each file.
 */
export const dynamic = "force-dynamic"

/**
 * Runs at BUILD time, so it must not call the API: a build-time fetch carries no request origin
 * for app-service to resolve the domain from, and the 400 fails the whole build. The id list is a
 * fixed constant instead; the index only advertises the ids that actually hold URLs today.
 */
export function generateSitemaps(): { id: string }[] {
  return SITEMAP_SHARD_IDS.map((id) => ({ id }))
}

// Next 16 passes the `generateSitemaps` id as a promise that resolves to a string (see
// node_modules/next/dist/docs/.../generate-sitemaps.md — it was a plain value before v16).
export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  const shards = await getSitemapShards()
  // An id that no longer exists (a shard that shrank away between requests) yields an empty
  // urlset rather than a 500 — the index will have stopped listing it in the same breath.
  const shard = shards.find((candidate) => candidate.id === id)

  return (shard?.entries ?? []).map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    alternates: { languages: entry.languages },
  }))
}
