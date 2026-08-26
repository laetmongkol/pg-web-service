import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

export const REVIEW_STARS_ICON_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-4.5 h-4.5",
    xl: "w-5 h-5",
    "2xl": "w-5.5 h-5.5",
    "3xl": "w-6 h-6",
    "4xl": "w-6.5 h-6.5",
    "5xl": "w-7 h-7",
};

export const REVIEW_STARS_TEXT_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-base",
    "2xl": "text-lg",
    "3xl": "text-lg",
    "4xl": "text-xl",
    "5xl": "text-xl",
};

export const REVIEW_STARS_ACTIVE_COLOR_CLASSNAME: Record<CustomColor, string> = {
    primary: "text-(--color-primary)",
    secondary: "text-(--color-secondary)",
    success: "text-(--color-success-500)",
    danger: "text-(--color-danger-500)",
    info: "text-(--color-info-500)",
};
