import type { ImageLoaderProps } from "next/image";

export const BACKEND_IMAGE_PREFIX = "/api/app/image/";

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
    const [path, existingQuery = ""] = src.split("?");
    const params = new URLSearchParams(existingQuery);

    params.set("w", String(width));

    if (!src.includes(BACKEND_IMAGE_PREFIX)) {
        return `${path}?${params.toString()}`;
    }

    params.set("q", String(quality ?? 75));
    if (!params.has("fmt")) {
        params.set("fmt", "webp");
    }

    return `${path}?${params.toString()}`;
}
