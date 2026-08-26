"use client";

import { useMutation } from "@tanstack/react-query";

import { CreateContactMessageRequestDto } from "@/services/generated-cli/api-app-service";

import contactAppService, { ContactBotTrap } from "../contact.app-service";

export type CreateContactMessageVariables = {
    request: CreateContactMessageRequestDto;
    botTrap: ContactBotTrap;
};

export const useContactAppService = () => {
    return {
        useCreateContactMessage: function useCreateContactMessage() {
            return useMutation({
                mutationFn: ({ request, botTrap }: CreateContactMessageVariables) =>
                    contactAppService.createContactMessage(request, botTrap),
            });
        },
    };
};

export default useContactAppService;
