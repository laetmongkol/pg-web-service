import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { applyTrustedSourceHeader } from "@/lib/api/trusted-source";
import { isPreviewDeployment } from "@/lib/seo/metadata";

import type { NextRequest } from "next/server";

import {
  getPreferredLanguage,
  isSupportedLanguage,
  LANGUAGE_COOKIE_KEY,
  setLanguageRequestHeader,
} from "@/proxies/language.proxy";
import {
  resolveHomeRedirect,
  setPathnameRequestHeader,
} from "@/proxies/pathname.proxy";
import { resolveRoutingGuardResponse } from "@/proxies/routing-guard.proxy";
import {
  getPreferredTheme,
  setThemeRequestHeader,
  THEME_COOKIE_KEY,
} from "@/proxies/theme.proxy";
import { HTTP_STATUS } from "@/shared/constants/common.constants";

import { routing } from "./i18n/routing";

function logProxyError(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const trace = error instanceof Error ? error.stack : undefined;
  console.log(`[proxy][error][${scope}] ${message}`);
  if (trace) console.log(trace);
}

const handleI18nRouting = createMiddleware(routing);

/**
 * Browser cache for public pages. Verified to survive into the production response — Next sets
 * its own Cache-Control for pages, and this overrides it.
 *
 * `private` on purpose: the response carries Set-Cookie for language/theme, so it must never land
 * in a shared cache where one visitor's cookies could be served to another. The shared layer is
 * Next's own data cache (see server-cache.ts), which manual invalidation can actually purge — a
 * browser cache cannot be, which is why the window is a short 5 minutes.
 *
 * Tradeoff: middleware runs before the page renders, so it cannot see the final status. A page
 * that 500s is sent with this header too, and that browser will hold the error for up to 5
 * minutes. Kept because the window is short and Next offers no post-render hook for page
 * Cache-Control; if error caching ever bites, drop the window rather than the header.
 */
const browserSeconds = (name: string, fallback: number): number => {
    const raw = process.env[name]?.trim();
    const parsed = Number(raw);
    return raw && Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const PUBLIC_CACHE_CONTROL = `private, max-age=${browserSeconds("NEXT_BROWSER_CACHE_SECONDS", 300)}, stale-while-revalidate=${browserSeconds("NEXT_BROWSER_STALE_SECONDS", 3600)}`;


export async function proxy(request: NextRequest) {
  try {
    // [crash-test] simulate middleware proxy failure
    // throw new Error("[crash-test] proxy");

    // Browser calls hit /api/app/* same-origin and next.config.ts rewrites them to the
    // app-service origin, whose staging and preview deployments keep Deployment Protection on.
    // The rewrite runs after this middleware and cannot add headers itself, and the browser has no
    // token to send, so the Trusted Sources token has to be stamped on the request here. No i18n,
    // theme or routing work belongs on an API call, hence the early return.
    if (request.nextUrl.pathname.startsWith("/api/app/")) {
      const apiHeaders = new Headers(request.headers);
      await applyTrustedSourceHeader(apiHeaders);
      return NextResponse.next({ request: { headers: apiHeaders } });
    }

    const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
    const languageFromSlug = pathSegments[0];
    const preferredLanguage = await getPreferredLanguage(request, languageFromSlug);

    const requestHeaders = new Headers(request.headers);

    const homeRedirect = await resolveHomeRedirect(request);
    if (homeRedirect) return homeRedirect;

    // `url_redirects` is resolved in the page components that 404 (blog article, blog category,
    // author) via lib/redirect-or-not-found.ts. Doing it here cost an uncacheable API call on
    // every request — the Data Cache does not reach proxy code — and the gate that kept the cost
    // down matched on a hardcoded route name, so a rename silently disabled the whole feature.
    const redirectResponse = await setPathnameRequestHeader(request, requestHeaders);
    if (redirectResponse) return redirectResponse;

    const preferredTheme = getPreferredTheme(request);

    const languageForHeader: typeof preferredLanguage =
      languageFromSlug && await isSupportedLanguage(languageFromSlug)
        ? (languageFromSlug as typeof preferredLanguage)
        : preferredLanguage;
    setLanguageRequestHeader(languageForHeader, requestHeaders);
    setThemeRequestHeader(preferredTheme, requestHeaders);

    requestHeaders.set("x-next-intl-locale", languageForHeader);

    const logicalPath = `/${pathSegments.slice(1).join("/")}`;
    const guardResponse = resolveRoutingGuardResponse(request, languageForHeader, logicalPath);
    if (guardResponse) return guardResponse;

    const intlResponse = handleI18nRouting(request);
    if (
      intlResponse.status >= HTTP_STATUS.MULTIPLE_CHOICES &&
      intlResponse.status < HTTP_STATUS.BAD_REQUEST
    ) {
      return intlResponse;
    }

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    const intlRewrite = intlResponse.headers.get("x-middleware-rewrite");
    if (intlRewrite) {
      response.headers.set("x-middleware-rewrite", intlRewrite);
    }

    response.cookies.set(LANGUAGE_COOKIE_KEY, preferredLanguage);
    response.cookies.set(THEME_COOKIE_KEY, preferredTheme);
    // Vercel Preview deployments must never be indexed, even if a preview URL is crawled directly.
    if (isPreviewDeployment()) {
      response.headers.set("x-robots-tag", "noindex, nofollow");
    }
    // Every page here is public now — the /console exclusion this used to carry is gone with the
    // console itself, so there is no longer any per-user response to keep out of a browser cache.
    response.headers.set("cache-control", PUBLIC_CACHE_CONTROL);
    return response;
  } catch (error) {
    logProxyError("proxy", error);
    return NextResponse.next();
  }
}

export const config = {
  // Pages: everything except _next internals, _vercel and static files (extensions).
  // /api/app/* is matched for one reason only — stamping the Trusted Sources token before the
  // rewrite to app-service runs. The branch at the top of `proxy` returns immediately, so no
  // i18n, theme or routing work happens on an API call. There is no auth on this site to refresh.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/api/app/:path*"],
};
