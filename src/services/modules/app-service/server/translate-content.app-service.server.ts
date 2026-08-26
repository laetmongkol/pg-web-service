"server-only";

import { cache } from "react";

import type { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import translateContentAppService, { translateContentKeys } from "../translate-content.app-service";
import { CONTENT_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const getTranslateContentsCached = cache(async (languageCode: string, pageCode: string): Promise<{ [key: string]: { [key: string]: TranslateContentResponseDto } }> => {
    return translateContentAppService.getTranslateContents(
        languageCode,
        pageCode,
        createRevalidateInit([
            ...translateContentKeys.all,
            translateContentKeys.list(languageCode, pageCode).join(":"),
        ], CONTENT_REVALIDATE_SECONDS),
    );
});

const translateContentAppServiceServer = {
    getTranslateContentsCached,
};

export default translateContentAppServiceServer;