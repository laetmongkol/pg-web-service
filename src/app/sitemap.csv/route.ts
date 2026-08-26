import { getSitemapEntries, toSitemapCsv } from "@/lib/seo/sitemap-entries"

export const revalidate = 3600

export async function GET(): Promise<Response> {
  const entries = await getSitemapEntries()
  const body = toSitemapCsv(entries)
  const stamp = new Date().toISOString().slice(0, 10)

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sitemap-${stamp}.csv"`,
    },
  })
}
