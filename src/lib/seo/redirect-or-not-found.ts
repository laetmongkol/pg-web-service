"server-only";

import { notFound, permanentRedirect, redirect } from "next/navigation"

import { urlRedirectAppServiceServer } from "@/services/modules/app-service/server"

import { HTTP_STATUS } from "@/shared/constants/common.constants"

/** "" | "/" -> "/"; "/th/blogs/" -> "/th/blogs". Matches how `url_redirects.source_path` is stored. */
function normalizePathname(pathname: string): string {
  if (!pathname) return "/"
  const withLeading = pathname.startsWith("/") ? pathname : `/${pathname}`
  return withLeading.length > 1 ? withLeading.replace(/\/+$/, "") : withLeading
}

/**
 * Use INSTEAD of `notFound()` when a page's content is missing: checks the CMS `url_redirects`
 * table first, so a renamed slug answers with a real 3xx rather than a 404.
 *
 * MUST be called from the page function body BEFORE any JSX is returned. Next.js only emits an
 * HTTP redirect while nothing has been flushed — called inside a streaming boundary it degrades
 * to a client-side meta refresh on a 200 response, which Google reads as a soft 404.
 *
 * `redirectType` maps to the closest method-preserving equivalent: 301 -> 308, 302 -> 307.
 * Google treats those pairs identically; a page component cannot emit a raw 301/302.
 *
 * Only reachable on the 404 path, so the happy path never pays for the lookup.
 */
export async function redirectOrNotFound(sourcePath: string): Promise<never> {
  const source = normalizePathname(sourcePath)
  const match = await urlRedirectAppServiceServer.resolveUrlRedirectCached(source)
  const target = match?.targetPath?.trim()

  // Reject protocol-relative targets ("//evil.com") — those leave the site.
  if (target && target.startsWith("/") && !target.startsWith("//")) {
    const destination = normalizePathname(target)
    if (destination !== source) {
      if (match?.redirectType === HTTP_STATUS.FOUND) redirect(destination)
      permanentRedirect(destination)
    }
  }

  notFound()
}
