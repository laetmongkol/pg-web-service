import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import { BACKEND_IMAGE_PREFIX } from "../media/image-loader";

export interface PictureAttributes {
    mediaStorageKey?: string;
    mediaAltText?: string;
    mediaCaptionText?: string;
    mediaDescription?: string;
    mediaUploadedBy?: string;
    width?: number;
    height?: number;
    [key: string]: unknown;
}

export interface CardDefaultAttributes extends PictureAttributes {
    label?: string;
    description?: string;
    [key: string]: unknown;
}

export type KeyedContentAttributes<T> = TranslateContentResponseDto & {
    key: string;
    attributes: T;
    [key: string]: unknown;
};

const isValidObject = (value: unknown): value is Record<string, unknown> => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

const isPictureAttributes = (value: unknown): value is PictureAttributes => {
    if (!isValidObject(value)) return false;
    
    const keys: (keyof PictureAttributes)[] = [
        "mediaStorageKey",
    ];
    return keys.some((k) => k in value);
}

const resolvePictureUrl = (attrs: PictureAttributes, baseUrl = BACKEND_IMAGE_PREFIX): PictureAttributes => {
    if (!attrs.mediaStorageKey) return attrs;

    return {
        ...attrs,
        mediaStorageKey: `${baseUrl}${attrs.mediaStorageKey}`,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractAttributes = <T = Record<string, any>>(dto: TranslateContentResponseDto | undefined): T | undefined => {
    if (!dto) return undefined;

    const attributes = dto.attributes as unknown;
    if (isPictureAttributes(attributes)) {
        return resolvePictureUrl(attributes) as unknown as T;
    }
    return attributes as unknown as T;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertObjectToArrayByPrefix = <T = Record<string, any>>(
    data: Record<string, TranslateContentResponseDto> | null | undefined,
    prefix: string,
): KeyedContentAttributes<T>[] => {
    if (!data) return [];

    return Object.entries(data)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, dto]) => {
            const attributes = extractAttributes<T>(dto);
            if (!attributes) return undefined;

            const entry: KeyedContentAttributes<T> = {
                key,
                ...dto,
                attributes,
            };

            return entry;
        })
        .filter((entry): entry is KeyedContentAttributes<T> => entry !== undefined)
        .sort((a, b) => (a?.sequence ?? 0) - (b?.sequence ?? 0));
};
