import { resolveMediaDisplayUrl } from "@/lib/media/media-display-url";
import {
    BlogsApi,
    InitOverrideFunction,
    ResponseError,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const blogsApi = new BlogsApi(apiConfiguration);

/** Stable contract for SEO surfaces (sitemap, metadata, JSON-LD). */
export interface BlogSitemapEntry {
    category: string;
    slug: string;
    /** Published detail language — drives per-locale sitemap URL + lastmod. */
    languageCode: string;
    /** ISO date string of last content update — drives sitemap lastModified. */
    updatedAt: string;
    /** Author slug, if the blog has one — used to derive author-page lastmod. */
    authorSlug: string | null;
}

/** Stable contract for the public article page. */
export interface BlogArticle {
    category: string;
    slug: string;
    title: string;
    titleColor?: string;
    description: string;
    content: string;
    excerpt: string;
    coverImageUrl?: string;
    authorName?: string;
    authorSlug?: string;
    publishedAt: string;
    updatedAt: string;
    tags: string[];
    languageCode: string;
    /** Lags behind reality by the backend flush interval + this page's ISR window. */
    viewCount: number;
}

export const blogKeys = {
    all: ["blogAppService"] as const,
    list: (locale: string, categoryCode?: string, searchKeyword?: string) =>
        [...blogKeys.all, "list", locale, categoryCode ?? "", searchKeyword ?? ""] as const,
};

const toIsoString = (value: Date | string): string => {
    if (value instanceof Date) return value.toISOString();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const isNotFound = (error: unknown): boolean =>
    error instanceof ResponseError && error.response.status === 404;

/**
 * Public published sitemap entries — one backend call (all languages).
 * Signature stays stable for SEO plumbing; swap regenerates via generate-cli.
 */
const getSitemapEntries = async (
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogSitemapEntry[]> => {
    const response = await blogsApi.getBlogSitemap(initOverrides);
    return (response.entries ?? []).map((entry) => ({
        category: entry.category,
        slug: entry.slug,
        languageCode: String(entry.languageCode ?? "").toLowerCase(),
        updatedAt: toIsoString(entry.updatedAt),
        authorSlug: entry.authorSlug ?? null,
    }));
};

/**
 * Public published article by category + slug — one backend call.
 * Returns null on 404 so public pages can `notFound()` cleanly.
 */
const getArticle = async (
    locale: string,
    category: string,
    slug: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogArticle | null> => {
    try {
        const article = await blogsApi.getPublicBlogArticle(category, slug, locale, initOverrides);
        return {
            category: article.category,
            slug: article.slug,
            title: article.title,
            titleColor: article.titleColor,
            description: article.description,
            content: article.content ?? "",
            excerpt: article.excerpt ?? "",
            coverImageUrl: article.coverImageStorageKey
                ? resolveMediaDisplayUrl(undefined, article.coverImageStorageKey)
                : undefined,
            authorName: article.authorName,
            authorSlug: article.authorSlug,
            publishedAt: toIsoString(article.publishedAt),
            updatedAt: toIsoString(article.updatedAt),
            tags: article.tags ?? [],
            languageCode: article.languageCode,
            viewCount: article.viewCount ?? 0,
        };
    } catch (error) {
        if (isNotFound(error)) return null;
        throw error;
    }
};

/**
 * Fire-and-forget view ping from the browser. Backend buffers it in memory (no DB round trip),
 * filters bots, dedupes per visitor and rate-limits per IP.
 *
 * `keepalive` so the request survives the reader navigating away mid-flight. Errors are
 * swallowed on purpose — a view counter must never surface an error on an article page.
 */
const recordArticleView = async (slug: string, locale: string): Promise<void> => {
    try {
        await blogsApi.recordBlogArticleView(slug, locale, { keepalive: true });
    } catch {
        // ignored
    }
};

const blogSeoAppService = {
    getSitemapEntries,
    getArticle,
    recordArticleView,
};

export default blogSeoAppService;
