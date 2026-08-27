import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import {
    getPreferredLanguage,
    isSupportedLanguage,
    LANGUAGE_COOKIE_KEY,
} from "@/proxies/language.proxy";
import { HTTP_STATUS } from "@/shared/constants/common.constants";

/** `/` only → `/{preferredLocale}` (MOVED_PERMANENTLY). `/{locale}` is the homepage. */
export const resolveHomeRedirect = async (request: NextRequest): Promise<NextResponse | null> => {
    const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
    if (pathSegments.length !== 0) {
        return null;
    }

    const preferredLanguage = await getPreferredLanguage(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${preferredLanguage}`;

    const response = NextResponse.redirect(redirectUrl, HTTP_STATUS.MOVED_PERMANENTLY);
    response.cookies.set(LANGUAGE_COOKIE_KEY, preferredLanguage);
    return response;
};

/** Invalid locale segment (e.g. `/fr/...`, `/random-slug`) → 404 instead of auto-redirecting to a locale. */
export const setPathnameRequestHeader = async (
    request: NextRequest,
    requestHeaders: Headers,
): Promise<NextResponse | void> => {
    const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
    const pathLocale = pathSegments[0];

    if (!(await isSupportedLanguage(pathLocale))) {
        const notFoundUrl = request.nextUrl.clone();
        notFoundUrl.pathname = `/${pathLocale}/__not-found`;
        return NextResponse.rewrite(notFoundUrl);
    }

    requestHeaders.set("x-pathname", request.nextUrl.pathname);
};
