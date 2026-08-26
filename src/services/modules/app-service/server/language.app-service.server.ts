"server-only";

import { cache } from "react";

import type { LanguageResponseDto } from "@/services/generated-cli/api-app-service";

import languageAppService, { languageKeys } from "../language.app-service";
import { CONTENT_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const LAYOUT_REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS;
const SUPPORTED_LANGUAGES_REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS;

const getLanguagesCached = cache(async (languageCode?: string, revalidateSeconds = LAYOUT_REVALIDATE_SECONDS): Promise<LanguageResponseDto[]> => {
    return languageAppService.getLanguages(
        languageCode,
        false,
        createRevalidateInit(
            [...languageKeys.all, languageKeys.list(languageCode, false).join(":")],
            revalidateSeconds,
        ),
    );
});

const getSupportedLanguagesCached = cache(async (): Promise<LanguageResponseDto[]> => {
    return getLanguagesCached(undefined, SUPPORTED_LANGUAGES_REVALIDATE_SECONDS);
});

const languageAppServiceServer = {
    getLanguagesCached,
    getSupportedLanguagesCached,
};

export default languageAppServiceServer;
