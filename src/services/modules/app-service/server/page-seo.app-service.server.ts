"server-only";

import { cache } from "react";

import type { PageSeoResponseDto } from "@/services/generated-cli/api-app-service";

import pageSeoAppService, { pageSeoKeys } from "../page-seo.app-service";
import { CONTENT_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const PAGE_SEO_REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS;
const PAGE_SEO_SITEMAP_REVALIDATE_SECONDS = 3600;

const getPageSeoCached = cache(
    async (pageCode: string, languageCode: string): Promise<PageSeoResponseDto | null> => {
        return pageSeoAppService.getPageSeo(
            pageCode,
            languageCode,
            createRevalidateInit(
                [...pageSeoKeys.all, pageSeoKeys.detail(pageCode, languageCode).join(":")],
                PAGE_SEO_REVALIDATE_SECONDS,
            ),
        );
    },
);

/**
 * All active page_seo rows for the domain (every locale, one call) — drives the sitemap's
 * per-page <lastmod>. Tagged `page-seo` so an admin touch/edit (which revalidates that tag)
 * drops it immediately.
 */
const getPageSeoListCached = cache(async (): Promise<PageSeoResponseDto[]> => {
    return pageSeoAppService.getPageSeoList(
        undefined,
        createRevalidateInit([...pageSeoKeys.all, pageSeoKeys.list().join(":")], PAGE_SEO_SITEMAP_REVALIDATE_SECONDS),
    );
});

const pageSeoAppServiceServer = {
    getPageSeoCached,
    getPageSeoListCached,
};

export default pageSeoAppServiceServer;
