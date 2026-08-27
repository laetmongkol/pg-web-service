import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

import { BASE_DISABLED_CLASSNAME, BASE_TEXT_SIZE_CLASSNAME } from "./base.classes";

export const CHECKBOX_INPUT_BASE_CLASSNAME = cn(
    "appearance-none rounded border-2 transition-colors cursor-pointer shrink-0",
    "focus:outline-none",
    BASE_DISABLED_CLASSNAME,
    "checked:relative"
);

export const CHECKBOX_INPUT_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-4.5 w-4.5",
    xl: "h-5 w-5",
    "2xl": "h-5.5 w-5.5",
    "3xl": "h-6 w-6",
    "4xl": "h-6.5 w-6.5",
    "5xl": "h-7 w-7",
};

export const CHECKBOX_INPUT_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-primary) checked:bg-(--color-primary)/20",
    secondary: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-secondary) checked:bg-(--color-secondary)/20",
    success: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-success-500) checked:bg-(--color-success-500)/20",
    danger: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-danger-500) checked:bg-(--color-danger-500)/20",
    info: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-info-500) checked:bg-(--color-info-500)/20",
};

export const CHECKBOX_LABEL_SIZE_CLASSNAME = BASE_TEXT_SIZE_CLASSNAME;

export const CHECKBOX_CHIP_BASE_CLASSNAME = cn(
    "inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium cursor-pointer transition-all select-none",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
);

export const CHECKBOX_CHIP_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "px-2 py-0.5 text-xs rounded-sm",
    sm: "px-2.5 py-1 text-xs rounded-sm",
    md: "px-3 py-1 text-sm rounded-md",
    lg: "px-3.5 py-1.5 text-base rounded-md",
    xl: "px-4 py-1.5 text-base rounded-md",
    "2xl": "px-4.5 py-2 text-lg rounded-md",
    "3xl": "px-5 py-2 text-lg rounded-lg",
    "4xl": "px-5.5 py-2.5 text-xl rounded-lg",
    "5xl": "px-6 py-2.5 text-xl rounded-lg",
};

/** Chip-mode checkbox square (unchecked) — lighter than chip bg in both themes */
export const CHECKBOX_CHIP_CHECKER_INACTIVE_CLASSNAME =
    "border-(--border-strong) bg-(--surface-muted)";

export const CHECKBOX_CHIP_CHECKER_ACTIVE_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--color-primary) bg-(--color-primary)/15 text-(--color-primary)",
    secondary: "border-(--color-secondary) bg-(--color-secondary)/15 text-(--color-secondary)",
    success: "border-(--color-success-500) bg-(--color-success-500)/15 text-(--color-success-500)",
    danger: "border-(--color-danger-500) bg-(--color-danger-500)/15 text-(--color-danger-500)",
    info: "border-(--color-info-500) bg-(--color-info-500)/15 text-(--color-info-500)",
};

export const CHECKBOX_CHIP_VARIANT_CLASSNAME: Record<CustomColor, { inactive: string; active: string }> = {
    primary: {
        inactive: "border-(--border-default) bg-(--surface-muted) text-(--text-primary) hover:border-(--color-primary)/50",
        active: "border-(--color-primary)/60 bg-(--color-primary)/15 text-(--text-primary) shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
    },
    secondary: {
        inactive: "border-(--border-default) bg-(--surface-muted) text-(--text-primary) hover:border-(--color-secondary)/50",
        active: "border-(--color-secondary)/60 bg-(--color-secondary)/15 text-(--text-primary) shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-secondary)_45%,transparent)]",
    },
    success: {
        inactive: "border-(--border-default) bg-(--surface-muted) text-(--text-primary) hover:border-(--color-success-500)/50",
        active: "border-(--color-success-500)/60 bg-(--color-success-500)/15 text-(--text-primary) shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-success-500)_45%,transparent)]",
    },
    danger: {
        inactive: "border-(--border-default) bg-(--surface-muted) text-(--text-primary) hover:border-(--color-danger-500)/50",
        active: "border-(--color-danger-500)/60 bg-(--color-danger-500)/15 text-(--text-primary) shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-danger-500)_45%,transparent)]",
    },
    info: {
        inactive: "border-(--border-default) bg-(--surface-muted) text-(--text-primary) hover:border-(--color-info-500)/50",
        active: "border-(--color-info-500)/60 bg-(--color-info-500)/15 text-(--text-primary) shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-info-500)_45%,transparent)]",
    },
};
