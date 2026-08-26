/** Same value as the `--text-primary` (light) design token — a sane default preview color. */
export const DEFAULT_COLOR_HEX = "#111827";

const resolveCssVar = (expression: string): string | null => {
    if (typeof window === "undefined") return null;
    const match = expression.match(/^var\((--[\w-]+)\)$/);
    if (!match) return null;
    const resolved = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
    return resolved || null;
};

/**
 * Normalizes a color value to lowercase 6-digit hex (#rrggbb).
 * Accepts hex (3 or 6 digit), rgb()/rgba(), or a `var(--token)` reference (resolved via
 * computed style, e.g. legacy Tiptap marks stored as `var(--color-danger-500)`).
 * Returns "" for anything unrecognized so it's treated as "no custom color" instead of breaking.
 */
export const normalizeColorToHex = (value?: string | null): string => {
    if (!value) return "";
    const trimmed = resolveCssVar(value.trim()) ?? value.trim();

    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();

    const shortHex = trimmed.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
    if (shortHex) {
        const [, r, g, b] = shortHex;
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }

    const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/i);
    if (rgbMatch) {
        const toHex = (channel: string) => Math.max(0, Math.min(255, Number(channel))).toString(16).padStart(2, "0");
        return `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`;
    }

    return "";
};
