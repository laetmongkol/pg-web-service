import {
    ContactMessageResponseDto,
    ContactMessagesApi,
    CreateContactMessageRequestDto,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

const contactMessagesApi = new ContactMessagesApi(apiConfiguration);

// Header names must match api-app-service ContactConstants.BotTrap.
const HONEYPOT_HEADER = "x-contact-hp";
const ELAPSED_HEADER = "x-contact-elapsed";

export const contactKeys = {
    all: ["contactAppService"] as const,
};

export type ContactBotTrap = {
    /** Hidden honeypot field value; empty for humans. */
    honeypot: string;
    /** Ms elapsed between form render and submit. */
    elapsedMs: number;
};

const createContactMessage = async (
    request: CreateContactMessageRequestDto,
    botTrap: ContactBotTrap,
): Promise<ContactMessageResponseDto> => {
    return await contactMessagesApi.createContactMessage(request, async ({ init }) => ({
        headers: {
            ...init.headers,
            [HONEYPOT_HEADER]: botTrap.honeypot,
            [ELAPSED_HEADER]: String(botTrap.elapsedMs),
        },
    }));
};

const contactAppService = {
    createContactMessage,
};

export default contactAppService;
