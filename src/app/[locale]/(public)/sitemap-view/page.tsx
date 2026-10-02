import { NOINDEX_ROBOTS } from "@/lib/seo/metadata"
import {
  getSitemapShards,
  SITEMAP_MAX_URLS,
  type SitemapEntryType,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-data"

import type { Metadata } from "next"

/**
 * Human-readable view of exactly what the sitemap publishes, one section per child sitemap file.
 * Next's sitemap convention writes the XML itself and gives no hook for an `<?xml-stylesheet?>`,
 * so the old XSL prettifier cannot be attached to it — this page replaces it, reading the same
 * `getSitemapShards()` as the XML so the two can never disagree.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sitemap view",
  // An internal inspection page: never index it, and never let it into the sitemap itself.
  robots: NOINDEX_ROBOTS,
}

const GROUP_META: Record<SitemapEntryType, { label: string; hint: string }> = {
  static: { label: "Static pages", hint: "PUBLIC_STATIC_ROUTES × active locale, minus CMS noindex" },
  blogCategory: { label: "Blog categories", hint: "lastmod = newest article in that category" },
  blog: { label: "Blog articles", hint: "lastmod = blog_details.updated_date" },
  author: { label: "Author pages", hint: "lastmod = that author's newest article" },
}

function formatDate(date: Date | undefined): string {
  if (!date) return "—"
  // Fixed locale + UTC: this page is for comparing against the CMS, not for reading in local time.
  return date.toISOString().replace("T", " ").replace(".000Z", "Z")
}

function Row({ entry }: { entry: SitemapUrlEntry }) {
  const hreflangs = Object.keys(entry.languages)

  return (
    <tr className="border-t border-(--border-default) align-top">
      <td className="px-3 py-2 font-mono text-xs text-(--text-primary)">
        <a className="hover:text-(--color-primary) hover:underline" href={entry.url} rel="noreferrer" target="_blank">
          {entry.path}
        </a>
      </td>
      <td className="px-3 py-2 text-xs uppercase text-(--text-secondary)">{entry.locale}</td>
      <td className="px-3 py-2 font-mono text-xs whitespace-nowrap text-(--text-secondary)">
        {formatDate(entry.lastModified)}
      </td>
      <td className="px-3 py-2">
        <span className="flex flex-wrap gap-1">
          {hreflangs.map((code) => (
            <span
              key={code}
              className="rounded border border-(--border-default) px-1.5 py-0.5 font-mono text-[10px] text-(--text-muted)"
              title={entry.languages[code]}
            >
              {code}
            </span>
          ))}
        </span>
      </td>
    </tr>
  )
}

interface SitemapViewPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SitemapViewPage({ searchParams }: SitemapViewPageProps) {
  const { q } = await searchParams
  const keyword = q?.trim().toLowerCase() ?? ""

  const shards = await getSitemapShards()
  const totalUrls = shards.reduce((sum, shard) => sum + shard.entries.length, 0)

  // Server-side filter on purpose: the page is already `force-dynamic`, so a plain GET form needs
  // no client bundle and no JS to work.
  const matches = (entry: SitemapUrlEntry): boolean =>
    !keyword || `${entry.path} ${entry.url} ${entry.locale}`.toLowerCase().includes(keyword)

  const visible = shards.map((shard) => ({ ...shard, rows: shard.entries.filter(matches) }))
  const matchedUrls = visible.reduce((sum, shard) => sum + shard.rows.length, 0)
  const missingLastmod = visible.reduce(
    (sum, shard) => sum + shard.rows.filter((entry) => !entry.lastModified).length,
    0,
  )

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-(--text-primary)">Sitemap view</h1>
        <p className="mt-2 text-sm text-(--text-secondary)">
          The same URLs as{" "}
          <a className="text-(--color-primary) hover:underline" href="/sitemap.xml" rel="noreferrer" target="_blank">
            /sitemap.xml
          </a>{" "}
          — the index — and its {shards.length} child sitemaps, rendered for humans. Built per
          request, no cache, so this always shows the CMS as it is right now. Each file is capped at{" "}
          {SITEMAP_MAX_URLS.toLocaleString()} URLs, well under the protocol&apos;s 50,000 limit.
        </p>

        <form className="mt-6 flex flex-wrap items-center gap-2" method="get">
          <input
            aria-label="Search sitemap URLs"
            className="w-full max-w-md rounded border border-(--border-default) bg-(--surface-default) px-3 py-2 text-sm text-(--text-primary) placeholder:text-(--text-muted)"
            defaultValue={q ?? ""}
            name="q"
            placeholder="Search path, URL or locale — e.g. forex, /author/, th"
            type="search"
          />
          <button className="rounded bg-(--color-primary) px-4 py-2 text-sm font-medium text-white" type="submit">
            Search
          </button>
          {keyword ? (
            <a className="px-2 py-2 text-sm text-(--color-primary) hover:underline" href="?">
              Clear
            </a>
          ) : null}
        </form>

        {keyword ? (
          <p className="mt-3 text-sm text-(--text-secondary)">
            {matchedUrls} of {totalUrls} URLs match{" "}
            <span className="font-mono text-(--text-primary)">{keyword}</span>
          </p>
        ) : null}

        <dl className="mt-6 flex flex-wrap gap-3">
          <Stat label={keyword ? "Matching URLs" : "Total URLs"} value={String(matchedUrls)} />
          {visible.map((shard) => (
            <Stat key={shard.id} label={`sitemap/${shard.id}.xml`} value={String(shard.rows.length)} />
          ))}
          <Stat label="Missing lastmod" value={String(missingLastmod)} />
        </dl>
      </header>

      {visible.map((shard) => {
        const meta = GROUP_META[shard.type]
        const rows = [...shard.rows].sort(
          (a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0),
        )

        return (
          <section key={shard.id} className="mb-10">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              {meta.label}
              {shard.part > 1 ? <span className="text-(--text-muted)"> part {shard.part}</span> : null}{" "}
              <span className="text-sm font-normal text-(--text-muted)">({rows.length})</span>
            </h2>
            <p className="mt-1 mb-3 text-xs text-(--text-muted)">
              <a
                className="font-mono text-(--color-primary) hover:underline"
                href={`/sitemap/${shard.id}.xml`}
                rel="noreferrer"
                target="_blank"
              >
                /sitemap/{shard.id}.xml
              </a>
              {" — "}
              {meta.hint}
            </p>

            {rows.length === 0 ? (
              <p className="rounded border border-(--border-default) px-3 py-4 text-sm text-(--text-muted)">
                No URLs in this file{keyword ? " match the search" : ""}.
              </p>
            ) : (
              <div className="overflow-x-auto rounded border border-(--border-default)">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-(--surface-elevated)">
                    <tr className="text-xs uppercase tracking-wide text-(--text-muted)">
                      <th className="px-3 py-2 font-medium">Path</th>
                      <th className="px-3 py-2 font-medium">Locale</th>
                      <th className="px-3 py-2 font-medium">Lastmod (UTC)</th>
                      <th className="px-3 py-2 font-medium">hreflang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((entry) => (
                      <Row key={`${entry.locale}:${entry.path}`} entry={entry} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )
      })}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-(--border-default) bg-(--surface-elevated) px-4 py-2">
      <dt className="text-xs text-(--text-muted)">{label}</dt>
      <dd className="text-lg font-semibold text-(--text-primary)">{value}</dd>
    </div>
  )
}
