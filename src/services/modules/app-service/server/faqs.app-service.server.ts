"server-only";

import { cache } from "react";

import type { FaqMapPageListResponseDto } from "@/services/generated-cli/api-app-service";

import faqsAppService, { faqKeys } from "../faqs.app-service";
import { CONTENT_REVALIDATE_SECONDS, createRevalidateInit } from "./server-cache";

const getFaqMapPagesCached = cache(
    async (languageCode: string, pageCode: string): Promise<FaqMapPageListResponseDto[]> => {
        return faqsAppService.getFaqMapPages(
            languageCode,
            pageCode,
            createRevalidateInit([...faqKeys.all, faqKeys.mapPages(languageCode, pageCode).join(":")], CONTENT_REVALIDATE_SECONDS),
        );
    },
);

const faqsAppServiceServer = {
    getFaqMapPagesCached,
};

export default faqsAppServiceServer;
