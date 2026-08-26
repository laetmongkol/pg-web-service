import {
    CountriesApi,
    CountryResponseDto,
    InitOverrideFunction,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const countriesApi = new CountriesApi(apiConfiguration);

export const countriesKeys = {
    all: ["countriesAppService"] as const,
    list: () => [...countriesKeys.all, "list"] as const,
};

const getCountries = async (
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<CountryResponseDto[]> => {
    return await countriesApi.getCountries(initOverrides);
};

const countriesAppService = {
    getCountries,
};

export default countriesAppService;
