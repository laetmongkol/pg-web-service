import { HealthResponseDto, SystemApi } from "@/services/generated-cli/api-app-service";

const systemApi = new SystemApi();

export const systemKeys = {
    health: ["health"] as const,
};

const getHealth = async (): Promise<HealthResponseDto> => {
    return await systemApi.getHealth();
};

const systemAppService = {
    getHealth,
};

export default systemAppService;
