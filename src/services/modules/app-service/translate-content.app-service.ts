import {
    AdminTranslateTreeContentDto,
    AdminTranslateTreePageDto,
    AdminTranslateTreeSectionDto,
    ContentPageResponseDto,
    InitOverrideFunction,
    TranslateContentAdminResponseDto,
    TranslateContentApi,
    TranslateContentResponseDto,
} from "@/services/generated-cli/api-app-service";

import type { SortBy } from "@/shared/types/sort.type";

import { serializeSortBy } from "@/shared/types/sort.type";

import apiConfiguration from "./api-configuration";

const translateContentApi = new TranslateContentApi(apiConfiguration);

export const translateContentKeys = {
    all: ["translate-contents"] as const,
    pages: () => [...translateContentKeys.all, "pages"] as const,
    tree: (pageCode?: string) =>
        [...translateContentKeys.all, "tree", pageCode ?? "all"] as const,
    adminValues: (languageCode?: string, pageCode?: string, sortBy?: SortBy) =>
        [
            ...translateContentKeys.all,
            "admin-values",
            languageCode ?? "all",
            pageCode ?? "all",
            serializeSortBy(sortBy ?? []).join("|") || "default",
        ] as const,
    list: (languageCode: string, pageCode: string) =>
        [...translateContentKeys.all, "list", languageCode, pageCode] as const,
};

const getTranslateContents = async (
    languageCode: string,
    pageCode: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<{ [key: string]: { [key: string]: TranslateContentResponseDto } }> => {
    return await translateContentApi.getTranslateContents(languageCode, pageCode, initOverrides);
};

const translateContentAppService = {
    getTranslateContents,
};

export default translateContentAppService;
