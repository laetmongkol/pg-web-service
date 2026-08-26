import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { BLOG_BASE_PATH } from "@/shared/constants/seo.constants";


export type PublishStatus = "Y" | "N" | "D";

/**
 * Manual on/off switch for static (public) pages, keyed by logical path
 * (locale + route-group prefixes stripped, e.g. "/promotion/point-mall").
 *
 * - "Y" published (default for any path not listed here)
 * - "N" disabled — 404 for everyone
 * - "D" draft — 404 for guests, visible to logged-in admins for preview
 *
 * TODO: replace ROUTE_REGISTRY lookup with a cached `web_config.publish_status`
 * read once that table exists. Keep `getRouteStatus`'s signature so callers
 * (proxy.ts) don't need to change.
 */
const ROUTE_REGISTRY: Record<string, PublishStatus> = {
  "/about-us-new": "Y",
  "/contact-us": "Y",
  "/partners-new": "Y",
  "/register-trading": "Y",
  "/promotion": "Y",
  "/promotion/point-mall": "Y",
  [BLOG_BASE_PATH]: "Y",
  "/services": "Y",
  "/services/forex-broker-thailand": "Y",
  "/services/forex-course": "Y",
  "/services/forex-expert-advisor": "Y",
  "/services/forex-trading": "Y",
  "/services/forex-trading-platform": "Y",
  "/services/gold-trading": "Y",
  "/services/open-forex-account": "Y",
  "/services/trading-demo-free": "Y",
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
