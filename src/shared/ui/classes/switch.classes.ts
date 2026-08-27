import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

import { BASE_BG_VARIANT_CLASSNAME, BASE_TEXT_SIZE_CLASSNAME } from "./base.classes";

// Track: width = 2×height − 4px so that translate-x-full (= thumb width) lands perfectly
// xs/sm : h-4(16px)  → w-7(28px),   thumb h-3 w-3
// md    : h-5(20px)  → w-9(36px),   thumb h-4 w-4
// lg/xl : h-6(24px)  → w-11(44px),  thumb h-5 w-5
// 2xl+  : h-7(28px)  → w-[52px],    thumb h-6 w-6
export const SWITCH_TRACK_BASE_CLASSNAME = cn(
    "relative rounded-full transition-colors",
    "after:content-[''] after:absolute after:top-[2px] after:start-[2px]",
    "after:bg-(--surface-invert) after:rounded-full after:transition-all",
    "peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full",
    "peer-focus:outline-none",
    "peer-disabled:opacity-50"
);

export const SWITCH_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "w-7    h-4 after:w-3 after:h-3",
    sm: "w-7    h-4 after:w-3 after:h-3",
    md: "w-9    h-5 after:w-4 after:h-4",
    lg: "w-11   h-6 after:w-5 after:h-5",
    xl: "w-11   h-6 after:w-5 after:h-5",
    "2xl": "w-[52px] h-7 after:w-6 after:h-6",
    "3xl": "w-[52px] h-7 after:w-6 after:h-6",
    "4xl": "w-[52px] h-7 after:w-6 after:h-6",
    "5xl": "w-[52px] h-7 after:w-6 after:h-6",
};

export const SWITCH_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: BASE_BG_VARIANT_CLASSNAME.primary,
    secondary: BASE_BG_VARIANT_CLASSNAME.secondary,
    success: BASE_BG_VARIANT_CLASSNAME.success,
    danger: BASE_BG_VARIANT_CLASSNAME.danger,
    info: BASE_BG_VARIANT_CLASSNAME.info,
};

export const SWITCH_LABEL_SIZE_CLASSNAME = BASE_TEXT_SIZE_CLASSNAME;
