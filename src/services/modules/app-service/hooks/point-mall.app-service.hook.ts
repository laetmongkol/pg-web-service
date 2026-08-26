"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import pointMallAppService, { pointMallKeys } from "../point-mall.app-service";

/**
 * Client cache for the public point mall, matching the 5 minute browser window the proxy sets on
 * public pages (see proxy.ts). This page filters client-side, so a server-cached variant would
 * only ever cover the unfiltered first paint — the cache has to live where the query keys do.
 *
 * gcTime is deliberately longer than staleTime: at the React Query default of 5 minutes the entry
 * would be evicted exactly as it goes stale, so returning to the page would always refetch and the
 * staleTime would buy nothing.
 *
 * Admin edits are not affected — every point mall mutation invalidates `pointMallKeys.all`, which
 * drops these entries regardless of staleness.
 */
const PUBLIC_STALE_TIME_MS = 5 * 60 * 1000;
const PUBLIC_GC_TIME_MS = 30 * 60 * 1000;

export const usePointMallAppService = () => {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        void queryClient.invalidateQueries({ queryKey: pointMallKeys.all });
    };

    return {
        useGetPointMallCategories: function useGetPointMallCategories(languageCode: string, enabled = true) {
            return useQuery({
                queryKey: pointMallKeys.categories(languageCode),
                queryFn: () => pointMallAppService.getPointMallCategories(languageCode),
                enabled: Boolean(languageCode) && enabled,
                staleTime: PUBLIC_STALE_TIME_MS,
                gcTime: PUBLIC_GC_TIME_MS,
            });
        },
        useGetPointMallScoreRanges: function useGetPointMallScoreRanges(languageCode: string, enabled = true) {
            return useQuery({
                queryKey: pointMallKeys.scoreRanges(languageCode),
                queryFn: () => pointMallAppService.getPointMallScoreRanges(languageCode),
                enabled: Boolean(languageCode) && enabled,
                staleTime: PUBLIC_STALE_TIME_MS,
                gcTime: PUBLIC_GC_TIME_MS,
            });
        },
        useGetPointMall: function useGetPointMall(
            languageCode: string,
            keyword?: string,
            category?: string,
            rangeFrom?: number,
            rangeTo?: number,
            availablePoint?: number,
            enabled = true,
        ) {
            return useQuery({
                queryKey: pointMallKeys.list(languageCode, keyword, category, rangeFrom, rangeTo, availablePoint),
                queryFn: () =>
                    pointMallAppService.getPointMall(languageCode, keyword, category, rangeFrom, rangeTo, availablePoint),
                enabled: Boolean(languageCode) && enabled,
                staleTime: PUBLIC_STALE_TIME_MS,
                gcTime: PUBLIC_GC_TIME_MS,
            });
        },
    };
};

export default usePointMallAppService;
