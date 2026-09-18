"server-only";

import { cache } from "react";

import type {
    BlogCategoriesResponseDto,
    BlogCategoryMenuResponseDto,
} from "@/services/generated-cli/api-app-service";

import blogAppService, {
    type BlogArticle,
    type BlogSitemapEntry,
} from "../blog-seo.app-service";
import blogsAppService, { BLOG_PAGE_LIMIT } from "../blogs.app-service";
import { BLOG_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const SITEMAP_REVALIDATE_SECONDS = BLOG_REVALIDATE_SECONDS;

const blogTags = (locale: string, category?: string, slug?: string) => {
    const tags = ["blogs", `blogs:${locale}`];
    if (category) tags.push(`blogs:${locale}:${category}`);
    if (slug) tags.push(`blogs:${locale}:${category}:${slug}`);
    return tags;
};

const getSitemapEntriesCached = cache(async (): Promise<BlogSitemapEntry[]> => {
    return blogAppService.getSitemapEntries(
        createRevalidateInit(["blogs", "blogs:sitemap"], SITEMAP_REVALIDATE_SECONDS),
    );
});

const getArticleCached = cache(async (locale: string, category: string, slug: string): Promise<BlogArticle | null> => {
    return blogAppService.getArticle(
        locale,
        category,
        slug,
        createRevalidateInit(blogTags(locale, category, slug), BLOG_REVALIDATE_SECONDS),
    );
});

const getHeroBlogsCached = cache(async (locale: string, categoryCode?: string): Promise<BlogCategoriesResponseDto> => {
    return blogsAppService.getHeroBlogs(
        { languageCode: locale, categoryCode },
        createRevalidateInit(blogTags(locale, categoryCode), BLOG_REVALIDATE_SECONDS),
    );
});

const getBlogListGroupedCached = cache(async (
    locale: string,
    categoryCode?: string,
    searchKeyword?: string,
    offset = 0,
    limit = BLOG_PAGE_LIMIT,
    authorSlug?: string,
): Promise<BlogCategoriesResponseDto> => {
    return blogsAppService.getBlogListGroupedByCategory(
        { languageCode: locale, categoryCode, searchKeyword, authorSlug, offset, limit },
        createRevalidateInit(
            [...blogTags(locale, categoryCode), ...(authorSlug ? [`authors:${authorSlug}`] : [])],
            BLOG_REVALIDATE_SECONDS,
        ),
    );
});

/** Active categories for the filter bar (languageCode only). */
const getBlogCategoriesCached = cache(async (locale: string): Promise<BlogCategoryMenuResponseDto> => {
    return blogsAppService.getActiveBlogCategories(
        locale,
        createRevalidateInit(blogTags(locale), BLOG_REVALIDATE_SECONDS),
    );
});

/** Index page: limit=4 per category via parallel categoryCode fetches, then merge. */
const getBlogListIndexCached = cache(async (
    locale: string,
    searchKeyword?: string,
): Promise<BlogCategoriesResponseDto> => {
    const menu = await getBlogCategoriesCached(locale);
    const init = createRevalidateInit(blogTags(locale), BLOG_REVALIDATE_SECONDS);
    const pages = await Promise.all(
        menu.categories.map((category) =>
            blogsAppService.getBlogListGroupedByCategory(
                {
                    languageCode: locale,
                    categoryCode: category.categoryCode,
                    searchKeyword,
                    offset: 0,
                    limit: BLOG_PAGE_LIMIT,
                },
                init,
            ),
        ),
    );
    const categories = pages.flatMap((page) => page.categories);
    return {
        languageCode: locale.toLowerCase(),
        categoryLength: categories.length,
        categories,
    };
});

const blogAppServiceServer = {
    getSitemapEntriesCached,
    getArticleCached,
    getHeroBlogsCached,
    getBlogListGroupedCached,
    getBlogCategoriesCached,
    getBlogListIndexCached,
};

export default blogAppServiceServer;
