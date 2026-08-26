"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    CreateRegisterTradingEmailLeadRequestDto,
    CreateRegisterTradingRequestDto,
} from "@/services/generated-cli/api-app-service";

import registerTradingAppService, { registerTradingKeys } from "../register-trading.app-service";

export const useRegisterTradingAppService = () => {
    const queryClient = useQueryClient();

    const invalidateCampaigns = () => {
        void queryClient.invalidateQueries({ queryKey: registerTradingKeys.campaigns() });
    };

    return {
        useCreateRegisterTrading: function useCreateRegisterTrading() {
            return useMutation({
                mutationFn: (request: CreateRegisterTradingRequestDto) =>
                    registerTradingAppService.createRegisterTrading(request),
            });
        },
        useCreateRegisterTradingEmailLead: function useCreateRegisterTradingEmailLead() {
            return useMutation({
                mutationFn: (request: CreateRegisterTradingEmailLeadRequestDto) =>
                    registerTradingAppService.createRegisterTradingEmailLead(request),
            });
        },
    };
};

export default useRegisterTradingAppService;
