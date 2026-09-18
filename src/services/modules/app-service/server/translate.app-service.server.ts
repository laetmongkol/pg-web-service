"server-only";

import { cache } from "react";

import translateAppService, { type TranslateCatalog, translateKeys } from "../translate.app-service";
import { CONTENT_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";


const TRANSLATE_REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS;

const getTranslatesCached = cache(async (languageCode: string): Promise<TranslateCatalog> => {
    return translateAppService.getTranslates(
        languageCode,
        createRevalidateInit([...translateKeys.all, translateKeys.list(languageCode).join(":")], TRANSLATE_REVALIDATE_SECONDS),
    );
});

const translateAppServiceServer = {
    getTranslatesCached,
};

export default translateAppServiceServer;
