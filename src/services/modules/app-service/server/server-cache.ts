"server-only";

/**
 * Two server-cache windows, picked by how fast the data behind a page actually moves.
 *
 * Neither window delays an intentional update: blog publish (backend RevalidateService) and
 * the console's editor > Cache page both bust by tag, so these numbers only bound how stale
 * a page can get when nobody has edited anything.
 */

/**
 * Every window is env-tunable so cache timing is a deploy setting, not a code change.
 * Blank / non-numeric / negative env value falls back to the baked default (an empty
 * `NEXT_*=` line in .env must not turn into `revalidate: NaN`).
 */
const envSeconds = (name: string, fallback: number): number => {
    const raw = process.env[name]?.trim();
    const parsed = Number(raw);
    // `raw` must be non-empty: Number("") is 0, and a blank env line means "unset", not "never cache".
    return raw && Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

/** Non-list content pages — home, services, about, partners, promotion, point mall copy. */
export const CONTENT_REVALIDATE_SECONDS = envSeconds("NEXT_CONTENT_REVALIDATE_SECONDS", 3600);

/** Blog surfaces (article, list, hero, sitemap, author pages) churn faster. */
export const BLOG_REVALIDATE_SECONDS = envSeconds("NEXT_BLOG_REVALIDATE_SECONDS", 1800);

/** Per-deployment override; the content window is the default. Callers pass a window explicitly. */
export const REVALIDATE_SECONDS = envSeconds("NEXT_REVALIDATE_SECONDS", CONTENT_REVALIDATE_SECONDS);

export function createRevalidateInit(tags: string[], revalidateSeconds = REVALIDATE_SECONDS): RequestInit {
    return {
        next: {
            revalidate: revalidateSeconds,
            tags,
        },
    } as RequestInit;
}
