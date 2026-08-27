import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

import { BASE_DISABLED_CLASSNAME, BASE_TEXT_SIZE_CLASSNAME } from "./base.classes";

export const RADIO_INPUT_BASE_CLASSNAME = cn(
    "appearance-none rounded-full border-2 transition-colors cursor-pointer shrink-0",
    "focus:outline-none",
    BASE_DISABLED_CLASSNAME
);

export const RADIO_INPUT_SIZE_CLASSNAME: Record<CustomSize, string> = {
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

export const RADIO_INPUT_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-primary) checked:bg-(--color-primary)/20",
    secondary: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-secondary) checked:bg-(--color-secondary)/20",
    success: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-success-500) checked:bg-(--color-success-500)/20",
    danger: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-danger-500) checked:bg-(--color-danger-500)/20",
    info: "border-(--border-default) bg-(--surface-muted) checked:border-(--color-info-500) checked:bg-(--color-info-500)/20",
};

export const RADIO_LABEL_SIZE_CLASSNAME = BASE_TEXT_SIZE_CLASSNAME;

export const RADIO_CHIP_BASE_CLASSNAME = cn(
    "group inline-flex items-center gap-2 rounded-full border border-(--border-default) bg-transparent px-3 py-1 text-sm font-medium text-(--text-primary) cursor-pointer transition-all select-none",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
);

export const RADIO_CHIP_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "px-2 py-0.5 text-xs rounded-md",
    sm: "px-2.5 py-1 text-xs rounded-md",
    md: "px-3 py-1 text-sm rounded-full",
    lg: "px-3.5 py-1.5 text-base rounded-full",
    xl: "px-4 py-1.5 text-base rounded-full",
    "2xl": "px-4.5 py-2 text-lg rounded-full",
    "3xl": "px-5 py-2 text-lg rounded-full",
    "4xl": "px-5.5 py-2.5 text-xl rounded-full",
    "5xl": "px-6 py-2.5 text-xl rounded-full",
};

export const RADIO_CHIP_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "hover:border-(--color-primary)/50 has-[:checked]:border-(--color-primary) has-[:checked]:bg-(--color-primary)/20",
    secondary: "hover:border-(--color-secondary)/50 has-[:checked]:border-(--color-secondary) has-[:checked]:bg-(--color-secondary)/20",
    success: "hover:border-(--color-success-500)/50 has-[:checked]:border-(--color-success-500) has-[:checked]:bg-(--color-success-500)/20",
    danger: "hover:border-(--color-danger-500)/50 has-[:checked]:border-(--color-danger-500) has-[:checked]:bg-(--color-danger-500)/20",
    info: "hover:border-(--color-info-500)/50 has-[:checked]:border-(--color-info-500) has-[:checked]:bg-(--color-info-500)/20",
};

/** Select-chip radio circle — mirrors RADIO_INPUT_VARIANT_CLASSNAME via group-has-[:checked] */
export const RADIO_CHIP_CHECKER_CLASSNAME = {
    variant: {
        primary: "border-(--border-default) bg-(--surface-muted) group-has-[:checked]:border-(--color-primary) group-has-[:checked]:bg-(--color-primary)/20",
        secondary: "border-(--border-default) bg-(--surface-muted) group-has-[:checked]:border-(--color-secondary) group-has-[:checked]:bg-(--color-secondary)/20",
        success: "border-(--border-default) bg-(--surface-muted) group-has-[:checked]:border-(--color-success-500) group-has-[:checked]:bg-(--color-success-500)/20",
        danger: "border-(--border-default) bg-(--surface-muted) group-has-[:checked]:border-(--color-danger-500) group-has-[:checked]:bg-(--color-danger-500)/20",
        info: "border-(--border-default) bg-(--surface-muted) group-has-[:checked]:border-(--color-info-500) group-has-[:checked]:bg-(--color-info-500)/20",
    } satisfies Record<CustomColor, string>,
};
