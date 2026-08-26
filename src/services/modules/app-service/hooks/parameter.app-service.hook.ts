"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import parameterAppService, {
    BLOG_CATEGORY_GROUP_CODE,
    BLOG_TAG_GROUP_CODE,
    parameterKeys,
} from "../parameter.app-service";

export const useParameterAppService = () => {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        void queryClient.invalidateQueries({ queryKey: parameterKeys.all });
    };

    return {
        useGetParameterValues: function useGetParameterValues(groupCode: string, languageCode?: string) {
            return useQuery({
                queryKey: parameterKeys.list(groupCode, languageCode),
                queryFn: () => parameterAppService.getParameterValues(groupCode, languageCode),
                enabled: Boolean(groupCode),
            });
        },
        useGetBlogCategories: function useGetBlogCategories(languageCode?: string) {
            return useQuery({
                queryKey: parameterKeys.list(BLOG_CATEGORY_GROUP_CODE, languageCode),
                queryFn: () =>
                    parameterAppService.getParameterValues(BLOG_CATEGORY_GROUP_CODE, languageCode),
            });
        },
        useGetBlogTags: function useGetBlogTags(enabled = true) {
            return useQuery({
                queryKey: parameterKeys.list(BLOG_TAG_GROUP_CODE),
                queryFn: () => parameterAppService.getParameterValues(BLOG_TAG_GROUP_CODE),
                enabled,
            });
        },
    };
};

export default useParameterAppService;
