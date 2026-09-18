/**
 * Media row status, as stored on the media table. Declared here rather than imported: it used to
 * come from the generated `UpdateMediaStatusRequestDtoStatusEnum` via the upload wrapper, and both
 * are gone — media management is a console concern and its endpoints left api-app-service. The
 * public site still reads the value off image records to pick a URL, so only the shape is needed.
 */
export type MediaStatus = "Y" | "N" | "D";

export const GALLERY_THUMBNAIL_SCALE = 0.3;
export const GALLERY_VIEW_SCALE = 0.7;

const DEFAULT_IMAGE_WIDTH = 1920;
const DEFAULT_IMAGE_HEIGHT = 1080;

export type ImageDimensions = {
    width?: number;
    height?: number;
};

export function normalizeImageUrl(imageUrl: string): string {
    return imageUrl.split("?")[0] ?? imageUrl;
}

function toPreviewPath(imageUrl: string): string {
    return normalizeImageUrl(imageUrl).replace("/api/app/image/", "/api/app/image/preview/");
}

/** Append or replace a single query param on a same-origin relative path. */
function withParam(path: string, key: string, value: string): string {
    const base = normalizeImageUrl(path);
    const params = new URLSearchParams(path.includes("?") ? path.split("?")[1] : "");
    params.set(key, value);
    const query = params.toString();
    return query ? `${base}?${query}` : base;
}

function resolveDimensions(dimensions?: ImageDimensions): { width: number; height: number } {
    return {
        width: dimensions?.width && dimensions.width > 0 ? dimensions.width : DEFAULT_IMAGE_WIDTH,
        height: dimensions?.height && dimensions.height > 0 ? dimensions.height : DEFAULT_IMAGE_HEIGHT,
    };
}

function scaledDimension(value: number, scale: number): number {
    return Math.max(1, Math.round(value * scale));
}

function buildScaledPreviewUrl(
    imageUrl: string,
    scale: number,
    dimensions?: ImageDimensions,
    options?: { original?: boolean },
): string {
    const base = normalizeImageUrl(toPreviewPath(imageUrl));
    const { width, height } = resolveDimensions(dimensions);
    const params = new URLSearchParams({
        w: String(scaledDimension(width, scale)),
        h: String(scaledDimension(height, scale)),
        fmt: "webp",
        q: String(Math.round(scale * 100)),
    });

    if (options?.original) {
        params.set("original", "1");
    }

    return `${base}?${params.toString()}`;
}

/** Gallery grid thumbnail at 30% of original dimensions and quality. */
export function getGalleryThumbnailUrl(imageUrl: string, dimensions?: ImageDimensions): string {
    return buildScaledPreviewUrl(imageUrl, GALLERY_THUMBNAIL_SCALE, dimensions, { original: true });
}

/** In-modal preview at 70% of original dimensions and quality. */
export function getGalleryViewUrl(
    imageUrl: string,
    status: MediaStatus = "Y",
    dimensions?: ImageDimensions,
): string {
    const url = buildScaledPreviewUrl(imageUrl, GALLERY_VIEW_SCALE, dimensions, { original: true });
    if (status !== "Y") {
        return withParam(url, "st", status);
    }
    return url;
}

/** Full-quality original for open-in-new-tab only. */
export function getGalleryFullUrl(imageUrl: string, status: MediaStatus = "Y"): string {
    const base = normalizeImageUrl(toPreviewPath(imageUrl));
    const params = new URLSearchParams({ original: "1" });
    if (status !== "Y") {
        params.set("st", status);
    }
    return `${base}?${params.toString()}`;
}

export function getDisplayImageUrl(imageUrl: string, status?: MediaStatus): string {
    const base = normalizeImageUrl(imageUrl);
    if (status === "N" || status === "D") {
        return withParam(base, "st", status);
    }
    return base;
}
