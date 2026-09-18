import {
    CreateRegisterTradingEmailLeadRequestDto,
    CreateRegisterTradingRequestDto,
    InitOverrideFunction,
    RegisterTradingApi,
    RegisterTradingResponseDto,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const registerTradingApi = new RegisterTradingApi(apiConfiguration);

export const registerTradingKeys = {
    all: ["registerTradingAppService"] as const,
    campaigns: () => [...registerTradingKeys.all, "campaigns"] as const,
};

const createRegisterTrading = async (
    request: CreateRegisterTradingRequestDto,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<RegisterTradingResponseDto> => {
    return await registerTradingApi.createRegisterTradingGoc(request, initOverrides);
};

const createRegisterTradingEmailLead = async (
    request: CreateRegisterTradingEmailLeadRequestDto,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<RegisterTradingResponseDto> => {
    return await registerTradingApi.createRegisterTradingEmailLead(request, initOverrides);
};

const registerTradingAppService = {
    createRegisterTrading,
    createRegisterTradingEmailLead,
};

export default registerTradingAppService;
