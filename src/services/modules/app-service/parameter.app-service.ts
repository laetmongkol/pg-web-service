import {
    AdminParameterGroupDto,
    AdminParameterValueDto,
    InitOverrideFunction,
    ParametersApi,
    ParameterValueResponseDto,
} from "@/services/generated-cli/api-app-service";

import apiConfiguration from "./api-configuration";

/** Parameter group for blog writer categories (`blog_categories.parameter_value_code`). */
export const BLOG_CATEGORY_GROUP_CODE = "BlogCategories";

/** Parameter group for blog writer tags (`blog_tags.parameter_value_code`). */
export const BLOG_TAG_GROUP_CODE = "BlogTags";

/** Parameter group for contact-us form topic dropdown. */
export const CONTACT_US_TOPIC_GROUP_CODE = "ContactUsTopic";

/**
 * Parameter group for writer profile social platforms.
 * Suggested value codes: facebook, instagram, x, line, linkedin, youtube, tiktok, threads, website
 */
export const AUTHOR_SOCIAL_PLATFORM_GROUP_CODE = "AuthorSocialPlatforms";

/** Parameter group for register-trading campaign Platform dropdown. */
export const CAMPAIGN_PLATFORM_GROUP_CODE = "CampaignPlatform";

const parametersApi = new ParametersApi(apiConfiguration);

export const parameterKeys = {
    all: ["parameterAppService"] as const,
    lists: () => [...parameterKeys.all, "list"] as const,
    list: (groupCode: string, languageCode?: string) =>
        [...parameterKeys.lists(), groupCode, languageCode ?? ""] as const,
    tree: () => [...parameterKeys.all, "tree"] as const,
};

const getParameterValues = async (
    groupCode: string,
    languageCode?: string,
    initOverrides?: RequestInit | InitOverrideFunction,
): Promise<ParameterValueResponseDto[]> => {
    return await parametersApi.getParameterValues(groupCode, languageCode, initOverrides);
};

const parameterAppService = {
    getParameterValues,
};

export default parameterAppService;
