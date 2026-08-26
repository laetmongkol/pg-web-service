import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

// ═══════════════════════════════════════════════════════════════════════════
// Common Base Classes
// ═══════════════════════════════════════════════════════════════════════════

export const BASE_DISABLED_CLASSNAME = cn(
    "disabled:cursor-not-allowed disabled:opacity-100",
    "disabled:bg-(--surface-page) disabled:text-(--text-secondary) disabled:border-(--border-muted)",
);

export const BASE_TRANSITION_CLASSNAME = "outline-none transition-colors";

/** Locked / non-editable field surface — distinct from editable `--surface-muted` fields. */
export const FORM_FIELD_LOCKED_CLASSNAME = cn(
    "cursor-default bg-(--surface-page) text-(--text-secondary) border-(--border-muted)",
);

export const FORM_FIELD_READ_ONLY_CLASSNAME = cn(
    "read-only:cursor-default",
    "read-only:bg-(--surface-page)",
    "read-only:text-(--text-secondary)",
    "read-only:border-(--border-muted)",
);

export const BASE_FORM_FIELD_CLASSNAME = cn(
    "w-full rounded-md border bg-(--surface-muted) text-(--text-primary) placeholder:text-(--text-muted)",
    BASE_TRANSITION_CLASSNAME,
    BASE_DISABLED_CLASSNAME,
    FORM_FIELD_READ_ONLY_CLASSNAME,
);

export const FIELD_CLEAR_BUTTON_BASE_CLASSNAME = cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center self-stretch",
    "text-(--text-secondary) transition-colors",
    "hover:bg-(--surface-muted) hover:text-(--text-primary)",
    "disabled:pointer-events-none disabled:opacity-50",
);

/** Compact clear (X) — for chips / inline controls */
export const FIELD_CLEAR_ICON_BUTTON_CLASSNAME = cn(
    FIELD_CLEAR_BUTTON_BASE_CLASSNAME,
    "size-6 rounded-sm",
);

export const BANNER_IMAGE_DRAG_PREVENT_CLASSNAME = "select-none [-webkit-user-drag:none]";

/** White gradient overlay so banner/hero text stays readable on photo backgrounds (mobile). */
export const BANNER_MOBILE_TEXT_OVERLAY_CLASSNAME = cn(
    "pointer-events-none absolute inset-0 z-[1] block sm:hidden",
    "bg-linear-to-t from-(--surface-default) via-(--surface-default)/60 via-50% to-transparent",
);

/**
 * Fixed 16:9 box for full-width page banners and heroes, sized to the 1920x1080 artwork.
 *
 * These used to be viewport heights (`h-[80vh]`, `calc(95vh-60px)`), which made the box track the
 * window rather than the picture: `object-cover` then cropped to whatever ratio the window happened
 * to be, so zooming or resizing changed which part of the banner you saw. A fixed ratio crops the
 * same way at every size.
 *
 * `max-h` stops it growing past the artwork's own height on very large monitors — past that point
 * there is no more picture to show, only upscaling.
 */
export const BANNER_SECTION_HEIGHT_CLASSNAME = "aspect-video max-h-[1080px]";

/** Taller mobile variant: 16:9 is only ~211px tall on a phone, too short for the overlaid copy. */
export const BANNER_SECTION_HEIGHT_LARGE_CLASSNAME =
    "aspect-[3/4] sm:aspect-video max-h-[1080px]";

// ═══════════════════════════════════════════════════════════════════════════
// Common Size Classes (for buttons, inputs, selects, etc.)
// ═══════════════════════════════════════════════════════════════════════════

export const BASE_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3.5 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    xl: "px-5.5 py-3 text-base",
    "2xl": "px-6 py-3.5 text-lg",
    "3xl": "px-6.5 py-4 text-lg",
    "4xl": "px-7 py-4 text-xl",
    "5xl": "px-8 py-4.5 text-xl",
};

// ═══════════════════════════════════════════════════════════════════════════
// Common Text Size Classes (for labels, text elements)
// ═══════════════════════════════════════════════════════════════════════════

export const BASE_TEXT_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
    xl: "text-base",
    "2xl": "text-lg",
    "3xl": "text-lg",
    "4xl": "text-xl",
    "5xl": "text-xl",
};

// ═══════════════════════════════════════════════════════════════════════════
// Common Focus Border & Shadow (for inputs, textareas, selects)
// ═══════════════════════════════════════════════════════════════════════════

export const BASE_FOCUS_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--border-default) focus:border-(--color-primary) focus:shadow-md focus:shadow-(--color-primary-200)/20",
    secondary: "border-(--border-default) focus:border-(--border-strong) focus:shadow-md focus:shadow-gray-300/20",
    success: "border-(--color-success-500) focus:border-(--color-success-500) focus:shadow-md focus:shadow-green-300/20",
    danger: "border-(--color-danger-500) focus:border-(--color-danger-500) focus:shadow-md focus:shadow-red-300/20",
    info: "border-(--color-info-500) focus:border-(--color-info-500) focus:shadow-md focus:shadow-(--color-info-300)/20",
};

// ═══════════════════════════════════════════════════════════════════════════
// Common Background Colors (unchecked state for switches, borders)
// ═══════════════════════════════════════════════════════════════════════════

export const BASE_BG_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "bg-(--border-default) peer-checked:bg-(--color-primary)",
    secondary: "bg-(--border-default) peer-checked:bg-(--border-strong)",
    success: "bg-(--border-default) peer-checked:bg-(--color-success-500)",
    danger: "bg-(--border-default) peer-checked:bg-(--color-danger-500)",
    info: "bg-(--border-default) peer-checked:bg-(--color-info-500)",
};
