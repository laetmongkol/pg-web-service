import {
    AuthorResponseDto,
    AuthorsApi,
    InitOverrideFunction,
} from "@/services/generated-cli/api-app-service";
import { ResponseError } from "@/services/generated-cli/api-app-service/runtime";

import apiConfiguration from "./api-configuration";

const authorApi = new AuthorsApi(apiConfiguration);

export const authorKeys = {
    all: ["authorAppService"] as const,
    list: () => [...authorKeys.all, "list"] as const,
    me: () => [...authorKeys.all, "me"] as const,
    detail: (authorSlug: string) => [...authorKeys.all, "detail", authorSlug] as const,
};

const getAuthors = async (initOverrides?: RequestInit | InitOverrideFunction): Promise<AuthorResponseDto[]> => {
    return await authorApi.getAuthors(initOverrides);
};

const getAuthor = async (
    authorSlug: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<AuthorResponseDto> => {
    return await authorApi.getAuthor(authorSlug, initOverrides);
};

const authorAppService = {
    getAuthors,
    getAuthor,
};

export default authorAppService;
