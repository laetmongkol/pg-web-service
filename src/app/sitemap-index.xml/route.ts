import { getSiteUrl, isPreviewDeployment } from "@/lib/seo/metadata"
import { getSitemapShards } from "@/lib/seo/sitemap-data"

/**
 * The `<sitemapindex>` that lists every child sitemap from app/sitemap.ts. Served at
 * `/sitemap.xml` through a `beforeFiles` rewrite in next.config.ts: `app/sitemap.ts` already owns
 * the `/sitemap.xml` route name (Next refuses a second handler there), so the index lives at
 * `/sitemap-index.xml` and the rewrite puts it back on the canonical URL crawlers already have.
 *
 * Hand-written because Next's sitemap convention only writes `<urlset>`; there is no built-in
 * sitemap-index writer. Everything else (the URL lists, the hreflang alternates) still comes from
 * Next, and this file emits nothing but `<loc>`/`<lastmod>` pairs.
 *
 * `force-dynamic` is load-bearing, not decoration: the sitemap route this replaces was prerendered
 * into a static file at build time and `/sitemap.xml` then never changed until the next deploy.
 * Without this export the same freeze comes straight back.
 */
export const dynamic = "force-dynamic"

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export async function GET(): Promise<Response> {
  // Vercel Preview deployments: nothing to crawl (robots.ts blocks them wholesale).
  if (isPreviewDeployment()) {
    return new Response("Not Found", { status: 404 })
  }

  const siteUrl = getSiteUrl().replace(/\/+$/, "")
  const shards = await getSitemapShards()

  const children = shards
    .map((shard) =>
      [
        "  <sitemap>",
        `    <loc>${escapeXml(`${siteUrl}/sitemap/${shard.id}.xml`)}</loc>`,
        // Newest lastmod inside the child, so a crawler can skip a file that has not moved.
        ...(shard.lastModified ? [`    <lastmod>${shard.lastModified.toISOString()}</lastmod>`] : []),
        "  </sitemap>",
      ].join("\n"),
    )
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children}
</sitemapindex>
`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Mirrors what Next sets on the child sitemaps; the freshness guarantee is force-dynamic.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
