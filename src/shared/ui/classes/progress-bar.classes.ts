import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

export const PROGRESS_BAR_TRACK_SIZE_CLASSNAME: Record<Extract<CustomSize, "xs" | "sm" | "md" | "lg" | "xl">, string> = {
    xs: "h-1.5",
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
    xl: "h-4",
};

export const PROGRESS_BAR_FILL_COLOR_CLASSNAME: Record<CustomColor, string> = {
    primary: "bg-(--color-primary)",
    secondary: "bg-(--color-secondary)",
    success: "bg-(--color-success-500)",
    danger: "bg-(--color-danger-500)",
    info: "bg-(--color-info-500)",
};
