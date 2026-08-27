import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { BLOG_BASE_PATH } from "@/shared/constants/seo.constants";


export type PublishStatus = "Y" | "N" | "D";

/**
 * Manual on/off switch for static (public) pages, keyed by logical path
 * (locale stripped, e.g. "/about-us").
 *
 * - "Y" published (default for any path not listed here)
 * - "N" disabled — 404 for everyone
 * - "D" draft — 404 (this site has no admin preview)
 */
const ROUTE_REGISTRY: Record<string, PublishStatus> = {
  "/about-us": "Y",
  "/contact-us": "Y",
  "/our-businesses": "Y",
  [BLOG_BASE_PATH]: "Y",
};

export function getRouteStatus(logicalPath: string): PublishStatus {
  return ROUTE_REGISTRY[logicalPath] ?? "Y";
}

/**
 * Returns a 404-rewrite response if the route is blocked for this request,
 * or `null` to continue normal handling.
 */
export function resolveRoutingGuardResponse(
  request: NextRequest,
  locale: string,
  logicalPath: string,
): NextResponse | null {
  const status = getRouteStatus(logicalPath);

  if (status === "Y") return null;
  // "D" (draft) used to be previewable by a logged-in admin. This site no longer has any auth —
  // the console moved to console-web-service — so a draft is a 404 for everyone, same as "N".
  // No behaviour change today: every ROUTE_REGISTRY entry above is "Y". Draft preview lives in
  // the console (blog-draft-preview), which reads unpublished content through the API directly.

  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = `/${locale}/routing-guard-not-found`;
  return NextResponse.rewrite(notFoundUrl);
}
