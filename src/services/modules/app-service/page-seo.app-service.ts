import {
    AdminPageSeoListResponseDto,
    AdminPageSeoResponseDto,
    InitOverrideFunction,
    PageSeoApi,
    PageSeoResponseDto,
} from "@/services/generated-cli/api-app-service";
import { ResponseError } from "@/services/generated-cli/api-app-service/runtime";

import apiConfiguration from "./api-configuration";

const pageSeoApi = new PageSeoApi(apiConfiguration);

export const pageSeoKeys = {
    all: ["page-seo"] as const,
    list: (languageCode?: string) => [...pageSeoKeys.all, "list", languageCode ?? "all"] as const,
    detail: (pageCode: string, languageCode: string) =>
        [...pageSeoKeys.all, "detail", pageCode, languageCode] as const,
    admin: (params: {
        page?: number;
        limit?: number;
        languageCode?: string;
        pageCode?: string;
        q?: string;
    }) => [...pageSeoKeys.all, "admin", params] as const,
};

const getPageSeo = async (
    pageCode: string,
    languageCode: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<PageSeoResponseDto | null> => {
    try {
        return await pageSeoApi.getPageSeo(pageCode, languageCode, initOverrides);
    } catch (error) {
        if (error instanceof ResponseError && error.response.status === 404) {
            return null;
        }
        return null;
    }
};

const getPageSeoList = async (
    languageCode?: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<PageSeoResponseDto[]> => {
    return await pageSeoApi.getPageSeoList(languageCode, initOverrides);
};

const pageSeoAppService = {
    getPageSeo,
    getPageSeoList,
};

export default pageSeoAppService;
