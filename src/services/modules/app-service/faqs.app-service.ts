import {
    CreateFaqMapPageRequestDto,
    CreateFaqRequestDto,
    CreateFaqTranslateRequestDto,
    FaqMapPageAdminResponseDto,
    FaqMapPageListResponseDto,
    FaqMapPageResponseDto,
    FaqMasterResponseDto,
    FaqsApi,
    FaqTranslateListResponseDto,
    FaqTranslateResponseDto,
    InitOverrideFunction,
    UpdateFaqMapPageRequestDto,
    UpdateFaqRequestDto,
    UpdateFaqTranslateRequestDto,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const faqsApi = new FaqsApi(apiConfiguration);

export const faqKeys = {
    all: ["faqsAppService"] as const,
    translates: (languageCode: string, faqCode?: string, keyword?: string) =>
        [...faqKeys.all, "translates", languageCode, faqCode ?? "", keyword ?? ""] as const,
    mapPages: (languageCode: string, pageCode?: string) =>
        [...faqKeys.all, "map-pages", languageCode, pageCode ?? ""] as const,
    mapPagesAdmin: (languageCode: string, pageCode?: string) =>
        [...faqKeys.all, "map-pages-admin", languageCode, pageCode ?? ""] as const,
};

const getFaqMapPages = async (
    languageCode: string,
    pageCode?: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<FaqMapPageListResponseDto[]> => {
    return await faqsApi.getFaqMapPages(languageCode, pageCode, initOverrides);
};

const faqsAppService = {
    getFaqMapPages,
};

export default faqsAppService;
