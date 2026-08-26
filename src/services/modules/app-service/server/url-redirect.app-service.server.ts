"server-only";

import { cache } from "react";

import type { ResolveUrlRedirectResponseDto } from "@/services/generated-cli/api-app-service";

import urlRedirectAppService, { urlRedirectKeys } from "../url-redirect.app-service";
import { CONTENT_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const URL_REDIRECT_REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS;

/**
 * Looked up only when a page is about to 404, so the happy path costs nothing. The "no redirect"
 * answer is cached too — a 404 that misses here would otherwise hit the API on every bot request.
 *
 * Tagged so saving a redirect in the console drops the cached miss immediately; this is why the
 * lookup lives in the render path and not in `proxy.ts`, where the Data Cache does not reach.
 */
const resolveUrlRedirectCached = cache(
    async (sourcePath: string): Promise<ResolveUrlRedirectResponseDto | null> => {
        return urlRedirectAppService.resolveUrlRedirect(
            sourcePath,
            createRevalidateInit(
                [...urlRedirectKeys.all, urlRedirectKeys.resolve(sourcePath).join(":")],
                URL_REDIRECT_REVALIDATE_SECONDS,
            ),
        );
    },
);

const urlRedirectAppServiceServer = {
    resolveUrlRedirectCached,
};

export default urlRedirectAppServiceServer;
