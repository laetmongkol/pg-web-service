import {
    InitOverrideFunction,
    ResolveUrlRedirectResponseDto,
    UrlRedirectsApi,
} from "@/services/generated-cli/api-app-service";
import { ResponseError } from "@/services/generated-cli/api-app-service/runtime";

import apiConfiguration from "./api-configuration";

const urlRedirectsApi = new UrlRedirectsApi(apiConfiguration);

export const urlRedirectKeys = {
    all: ["url-redirects"] as const,
    resolve: (sourcePath: string) => [...urlRedirectKeys.all, "resolve", sourcePath] as const,
};

/** `null` means "no redirect configured" — the common case, and not an error. */
const resolveUrlRedirect = async (
    sourcePath: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<ResolveUrlRedirectResponseDto | null> => {
    try {
        return await urlRedirectsApi.resolveUrlRedirect(sourcePath, initOverrides);
    } catch (error) {
        if (error instanceof ResponseError && error.response.status === 404) {
            return null;
        }
        return null;
    }
};

const urlRedirectAppService = {
    resolveUrlRedirect,
};

export default urlRedirectAppService;
