import {
    InitOverrideFunction,
    TranslateApi,
} from "@/services/generated-cli/api-app-service";

import type { AbstractIntlMessages } from "next-intl";

import apiConfiguration from "./api-configuration";

const translateApi = new TranslateApi(apiConfiguration);

export type TranslateCatalog = Record<string, AbstractIntlMessages>;

export const translateKeys = {
    all: ["translates"] as const,
    list: (languageCode: string) => [...translateKeys.all, "list", languageCode] as const,
};

const getTranslates = async (languageCode: string, initOverrides?: RequestInit | InitOverrideFunction): Promise<TranslateCatalog> => {
    return await translateApi.getTranslates(languageCode, initOverrides) as TranslateCatalog;
};

const translateAppService = {
    getTranslates,
};

export default translateAppService;
