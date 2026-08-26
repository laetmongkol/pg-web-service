"use client";

import { useQuery } from "@tanstack/react-query";

import countriesAppService, { countriesKeys } from "../countries.app-service";

/** Cache country list for 7 days (CSR). */
const COUNTRIES_STALE_TIME_MS = 7 * 24 * 60 * 60 * 1000;

export const useCountriesAppService = () => {
    return {
        useGetCountries: function useGetCountries() {
            return useQuery({
                queryKey: countriesKeys.list(),
                queryFn: () => countriesAppService.getCountries(),
                staleTime: COUNTRIES_STALE_TIME_MS,
                gcTime: COUNTRIES_STALE_TIME_MS,
            });
        },
    };
};

export default useCountriesAppService;
