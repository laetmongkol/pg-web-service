import {
    InitOverrideFunction,
    PointMallApi,
    PointMallCategoryResponseDto,
    PointMallDetailResponseDto,
    PointMallMasterResponseDto,
    PointMallResponseDto,
    ScoreRangeResponseDto,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const pointMallApi = new PointMallApi(apiConfiguration);

export const pointMallKeys = {
    all: ["pointMallAppService"] as const,
    categories: (languageCode: string) => [...pointMallKeys.all, "categories", languageCode] as const,
    scoreRanges: (languageCode: string) => [...pointMallKeys.all, "score-ranges", languageCode] as const,
    list: (
        languageCode: string,
        keyword?: string,
        category?: string,
        rangeFrom?: number,
        rangeTo?: number,
        availablePoint?: number,
    ) =>
        [
            ...pointMallKeys.all,
            "list",
            languageCode,
            keyword ?? "",
            category ?? "",
            rangeFrom ?? "",
            rangeTo ?? "",
            availablePoint ?? "",
        ] as const,
    adminList: (languageCode: string, keyword?: string, category?: string, rangeFrom?: number, rangeTo?: number) =>
        [
            ...pointMallKeys.all,
            "admin-list",
            languageCode,
            keyword ?? "",
            category ?? "",
            rangeFrom ?? "",
            rangeTo ?? "",
        ] as const,
};

const getPointMallCategories = async (
    languageCode: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<PointMallCategoryResponseDto[]> => {
    return await pointMallApi.getPointMallCategories(languageCode, initOverrides);
};

const getPointMallScoreRanges = async (
    languageCode: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<ScoreRangeResponseDto[]> => {
    return await pointMallApi.getPointMallScoreRanges(languageCode, initOverrides);
};

const getPointMall = async (
    languageCode: string,
    keyword?: string,
    category?: string,
    rangeFrom?: number,
    rangeTo?: number,
    availablePoint?: number,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<PointMallResponseDto[]> => {
    return await pointMallApi.getPointMall(languageCode, keyword, category, rangeFrom, rangeTo, availablePoint, initOverrides);
};

const pointMallAppService = {
    getPointMallCategories,
    getPointMallScoreRanges,
    getPointMall,
};

export default pointMallAppService;
