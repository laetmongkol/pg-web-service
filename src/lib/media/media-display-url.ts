/** Resolve a media record to a same-origin display URL for Next Image / editor HTML. */
export const resolveMediaDisplayUrl = (s3Url?: string, storageKey?: string): string => {
    const raw = s3Url ?? storageKey ?? "";
    if (!raw) return "";
    if (raw.startsWith("/api/app/image/")) return raw;
    if (!raw.includes("://")) return `/api/app/image/${raw}`;
    try {
        const key = new URL(raw).pathname.slice(1);
        return `/api/app/image/${key}`;
    } catch {
        return raw;
    }
};
