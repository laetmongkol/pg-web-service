const EDITOR_EMBED_IMG_STYLE =
    "max-width:100%;border-radius:0.5rem;display:block;margin:0.75rem 0;width:auto;height:auto;";

const HTTP_IMAGE_URL_PATTERN =
    /(https?:\/\/[^\s<>"]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s<>"]*)?)/gi;

const IMAGE_CHIP_TAG = /<span([^>]*data-image-chip[^>]*)>.*?<\/span>/gi;

/** TipTap TableView wraps tables in the editor; getHTML() often omits that wrapper. */
const BARE_TABLE_TAG = /<table\b[\s\S]*?<\/table>/gi;

function escapeAttr(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function getDataAttr(attrs: string, name: string): string {
    const match = attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, "i"));
    return match?.[1]?.trim() ?? "";
}

/**
 * Link target allowed on an image chip: absolute http(s), or a site-relative path.
 * Relative is accepted on purpose — rejecting it silently dropped every internal image link
 * and forced writers into absolute URLs, which is how the content filled up with hardcoded
 * origins. `//host` stays rejected: it reads as relative but leaves the site. Anything else
 * (`javascript:`, `data:`, `vbscript:`) drops the link and renders the bare image.
 */
function isSafeLinkHref(url: string): boolean {
    const value = url.trim();
    return /^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//"));
}

/** Convert TipTap editor HTML (image chips, inline URLs) into display-ready HTML. */
export function transformEditorHtmlForDisplay(
    html: string,
    resolveImageUrl: (url: string) => string = (url) => url,
): string {
    const toImg = (url: string, href?: string) => {
        const img = `<img src="${escapeAttr(resolveImageUrl(url))}" alt="" style="${EDITOR_EMBED_IMG_STYLE}" loading="lazy" />`;
        if (href && isSafeLinkHref(href)) {
            return `<a href="${escapeAttr(href.trim())}" target="_blank" rel="noopener noreferrer">${img}</a>`;
        }
        return img;
    };

    let result = html.replace(IMAGE_CHIP_TAG, (_full, attrs: string) => {
        const url = getDataAttr(attrs, "data-url");
        if (!url) return _full;
        const href =
            getDataAttr(attrs, "data-link") || getDataAttr(attrs, "data-href");
        return toImg(url, href || undefined);
    });

    result = result.replace(/>([^<]+)</g, (_, text: string) => {
        const transformed = text.replace(HTTP_IMAGE_URL_PATTERN, (url: string) => toImg(url));
        return `>${transformed}<`;
    });

    result = result.replace(BARE_TABLE_TAG, (tableHtml, offset: number, full: string) => {
        const before = full.slice(Math.max(0, offset - 80), offset);
        if (/<div[^>]*\btableWrapper\b[^>]*>\s*$/i.test(before)) {
            return tableHtml;
        }
        return `<div class="tableWrapper">${tableHtml}</div>`;
    });

    return result;
}

/**
 * Strip hard-coded text/background colors from pasted HTML (e.g. Google Docs, Word)
 * so text inherits the domain theme color instead of a fixed black/white. Links and
 * other formatting (bold, font-size, alignment) are left untouched.
 */
export function stripPastedColors(html: string): string {
    if (typeof window === "undefined" || !html) return html;
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
        el.style.removeProperty("color");
        el.style.removeProperty("background-color");
        el.style.removeProperty("background");
        if (!el.getAttribute("style")?.trim()) el.removeAttribute("style");
    });
    // legacy <font color="..."> / color attribute
    doc.querySelectorAll("[color]").forEach((el) => el.removeAttribute("color"));
    return doc.body.innerHTML;
}

/** Attributes that can carry a link in editor HTML. None contains a regex metacharacter. */
const LINK_ATTRIBUTES = ["href", "data-link", "data-href"] as const;

function stripTrailingSlashes(value: string): string {
    let result = value;
    while (result.endsWith("/")) result = result.slice(0, -1);
    return result;
}

/** Origins that mean the tenant's own site: the given web URL, both schemes, with and without `www.`. */
function ownOrigins(webUrl?: string | null): string[] {
    const trimmed = stripTrailingSlashes(webUrl?.trim() ?? "");
    if (!trimmed) return [];

    let host: string;
    try {
        host = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).host.toLowerCase();
    } catch {
        return [];
    }
    if (!host) return [];

    const bare = host.startsWith("www.") ? host.slice(4) : host;
    const hosts = bare === host ? [host, `www.${host}`] : [host, bare];
    return hosts.flatMap((entry) => [`https://${entry}`, `http://${entry}`]);
}

/**
 * Links into the tenant's own site, reduced to the shape they are stored in: site-relative, no
 * trailing slash. A writer pastes what the address bar shows — origin included — and a stored
 * absolute URL breaks the day the primary host changes (www -> apex, staging -> prod).
 *
 * `webUrl` is the PUBLIC site origin for this tenant, never the console's own. Omit it and only
 * already-relative links are tidied, because the host cannot be guessed from a console origin.
 *
 * api-app-service / console-app-service run the same normalization on save
 * (`common/utils/blog-link.util.ts`) — that copy is the authority for what reaches the DB;
 * this one exists so the editor shows what will actually be stored.
 */
export function normalizeBlogHtmlLinks(html: string, webUrl?: string | null): string {
    if (!html) return html;

    const origins = ownOrigins(webUrl);
    let result = html;

    for (const attribute of LINK_ATTRIBUTES) {
        // `origin/` and bare `origin"` are handled apart so a link to the origin with no path
        // becomes `/` rather than an empty attribute.
        for (const origin of origins) {
            result = result.split(`${attribute}="${origin}/`).join(`${attribute}="/`);
            result = result.split(`${attribute}="${origin}"`).join(`${attribute}="/"`);
        }

        // Trailing slashes on site-relative links only — an external URL keeps whatever it was given.
        const trailing = new RegExp(`${attribute}="(/[^"]*[^/"])/+"`, "g");
        result = result.replace(trailing, `${attribute}="$1"`);
    }

    return result;
}
