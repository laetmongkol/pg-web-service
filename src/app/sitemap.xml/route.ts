import { getSiteUrl, isPreviewDeployment } from "@/lib/seo/metadata"
import { getSitemapEntries, type SitemapEntry } from "@/lib/seo/sitemap-entries"

import { getLanguageLabel } from "@/shared/constants/language.constants"

export const revalidate = 3600

const GOC_NS = "https://gocprime.net/sitemap"

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function toSitemapXml(entries: SitemapEntry[], generatedAt: string, siteUrl: string): string {
  const urls = entries
    .map((entry, index) => {
      const alternates = Object.entries(entry.languages)
        .map(([lang, href]) => {
          const label = entry.languageLabels[lang] || getLanguageLabel(lang)
          return `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" goc:label="${escapeXml(label)}" />`
        })
        .join("\n")

      return [
        `  <url goc:index="${index + 1}" goc:type="${escapeXml(entry.type)}" goc:locale="${escapeXml(entry.locale)}" goc:localeLabel="${escapeXml(entry.localeLabel)}" goc:path="${escapeXml(entry.path)}">`,
        `    <loc>${escapeXml(entry.url)}</loc>`,
        // `<lastmod>` is optional — omitted rather than invented when the CMS has no date.
        ...(entry.lastModified ? [`    <lastmod>${entry.lastModified.toISOString()}</lastmod>`] : []),
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        alternates,
        "  </url>",
      ].join("\n")
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:goc="${GOC_NS}"
        goc:generatedAt="${escapeXml(generatedAt)}"
        goc:siteUrl="${escapeXml(siteUrl)}"
        goc:total="${entries.length}">
${urls}
</urlset>
`
}

export async function GET(): Promise<Response> {
  // Vercel Preview deployments: no sitemap to crawl.
  if (isPreviewDeployment()) {
    return new Response("Not Found", { status: 404 })
  }

  // Built inline, never inside `unstable_cache`: a Data Cache read hides the tagged fetches from
  // the route's own prerender, so `revalidateTag` never reached this route and the XML stayed
  // frozen at whatever the last deploy built. sitemap.csv fetches inline and did revalidate.
  const body = toSitemapXml(await getSitemapEntries(), new Date().toISOString(), getSiteUrl())

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
