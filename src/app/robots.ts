import type { MetadataRoute } from "next"

// Generated once at build time for the static export.
export const dynamic = "force-static"

import { SITE } from "@/shared/constants/site.constants"

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
