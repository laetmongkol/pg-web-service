import { getSiteUrl, isPreviewDeployment } from "@/lib/seo/metadata"

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  // Vercel Preview deployments: block crawling entirely, no sitemap.
  if (isPreviewDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep auth/admin surfaces out of the index.
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
