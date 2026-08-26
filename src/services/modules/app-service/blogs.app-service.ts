import {
    BlogCategoriesResponseDto,
    BlogCategoryMenuResponseDto,
    BlogListResponseDto,
    BlogsApi,
    InitOverrideFunction,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const blogsApi = new BlogsApi(apiConfiguration);

export const BLOG_PAGE_LIMIT = 4;

export type BlogListStatusFilter = "D" | "P" | "H" | "X";

export interface GetBlogsParams {
    page?: number;
    limit?: number;
    blogStatus?: BlogListStatusFilter;
    authorUuid?: string;
    authorSlug?: string;
    search?: string;
}

export interface GetBlogCategoriesParams {
    languageCode: string;
    categoryCode?: string;
    searchKeyword?: string;
    authorSlug?: string;
    offset?: number;
    limit?: number;
    sortOrder?: "asc" | "desc";
}

export interface GetLatestBlogsParams {
    languageCode: string;
    categoryCode?: string;
}

export const blogsKeys = {
    all: ["blogsAppService"] as const,
    lists: () => [...blogsKeys.all, "list"] as const,
    list: (params: GetBlogsParams) => [...blogsKeys.lists(), params] as const,
    statusCounts: () => [...blogsKeys.all, "statusCounts"] as const,
    detail: (slug: string) => [...blogsKeys.all, "detail", slug] as const,
    detailLanguage: (slug: string, languageCode: string) =>
        [...blogsKeys.detail(slug), languageCode] as const,
    categories: (params: GetBlogCategoriesParams) => [...blogsKeys.all, "categories", params] as const,
    latest: (params: GetLatestBlogsParams) => [...blogsKeys.all, "latest", params] as const,
};

const getBlogs = async (
    params: GetBlogsParams = {},
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogListResponseDto> => {
    const page = String(params.page ?? 1);
    const limit = String(params.limit ?? 20);
    return await blogsApi.getBlogs(
        page,
        limit,
        params.blogStatus,
        params.authorUuid,
        params.authorSlug,
        params.search,
        initOverrides,
    );
};

/** Soft-delete: moves blog to trash (status X). Cron purges after retention. */
/** Remove a non-default language detail from the blog. */
/** Published blogs grouped by primary category; categoryCode/searchKeyword/offset/limit optional. */
const getBlogCategories = async (
    params: GetBlogCategoriesParams,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogCategoriesResponseDto> => {
    const offset = params.offset !== undefined ? String(params.offset) : undefined;
    const limit = params.limit !== undefined ? String(params.limit) : undefined;
    return await blogsApi.getBlogCategories(
        params.languageCode,
        params.categoryCode,
        params.searchKeyword,
        params.authorSlug,
        offset,
        limit,
        params.sortOrder,
        initOverrides,
    );
};

/** Active primary categories with at least one published blog (category menu). */
const getActiveBlogCategories = async (
    languageCode: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogCategoryMenuResponseDto> => {
    return await blogsApi.getActiveBlogCategories(languageCode, initOverrides);
};

/** Latest published blogs grouped by primary category; categoryCode optional filter. */
const getLatestBlogs = async (
    params: GetLatestBlogsParams,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogCategoriesResponseDto> => {
    return await blogsApi.getLatestBlogs(params.languageCode, params.categoryCode, initOverrides);
};

/** Latest published blogs for the hero slider; pass categoryCode to scope to a category page. */
const getHeroBlogs = async (
    params: GetLatestBlogsParams,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogCategoriesResponseDto> => {
    return await blogsApi.getLatestBlogs(params.languageCode, params.categoryCode, initOverrides);
};

/** Published blogs grouped by category; categoryCode/searchKeyword/offset/limit optional. */
const getBlogListGroupedByCategory = async (
    params: GetBlogCategoriesParams,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<BlogCategoriesResponseDto> => {
    return await getBlogCategories(params, initOverrides);
};

const blogsAppService = {
    getBlogs,
    getBlogCategories,
    getActiveBlogCategories,
    getLatestBlogs,
    getHeroBlogs,
    getBlogListGroupedByCategory,
};

export default blogsAppService;
