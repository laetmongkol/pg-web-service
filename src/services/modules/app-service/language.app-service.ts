import {
    InitOverrideFunction,
    LanguageResponseDto,
    LanguagesApi,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const languageApi = new LanguagesApi(apiConfiguration);

export const languageKeys = {
    all: ["languages"] as const,
    list: (languageCode?: string, includeInactive?: boolean) =>
        [...languageKeys.all, "list", languageCode ?? "all", includeInactive ? "with-inactive" : "active"] as const,
};

const getLanguages = async (
    languageCode?: string,
    includeInactive = false,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<LanguageResponseDto[]> => {
    return await languageApi.getLanguages(languageCode, includeInactive, initOverrides);
};

const languageAppService = {
    getLanguages,
};

export default languageAppService;
