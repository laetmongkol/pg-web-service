"server-only";

import { cache } from "react";

import { ResponseError } from "@/services/generated-cli/api-app-service/runtime";

import type { AuthorResponseDto } from "@/services/generated-cli/api-app-service";

import authorAppService from "../author.app-service";
import { BLOG_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const AUTHOR_REVALIDATE_SECONDS = BLOG_REVALIDATE_SECONDS;

const getAuthorCached = cache(async (authorSlug: string): Promise<AuthorResponseDto | null> => {
    try {
        return await authorAppService.getAuthor(
            authorSlug,
            createRevalidateInit([`authors`, `authors:${authorSlug}`], AUTHOR_REVALIDATE_SECONDS),
        );
    } catch (error) {
        if (error instanceof ResponseError && error.response.status === 404) {
            return null;
        }
        throw error;
    }
});

/** All active authors — drives the sitemap's /author/{slug} entries. Tagged `authors`. */
const getAuthorsCached = cache(async (): Promise<AuthorResponseDto[]> => {
    try {
        return await authorAppService.getAuthors(createRevalidateInit(["authors"], AUTHOR_REVALIDATE_SECONDS));
    } catch {
        return [];
    }
});

const authorAppServiceServer = {
    getAuthorCached,
    getAuthorsCached,
};

export default authorAppServiceServer;
