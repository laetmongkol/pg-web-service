import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

export const ONE_TIME_PASSWORD_BASE_CLASSNAME = cn(
    "h-9 w-9 text-center rounded-md border border-(--border-default) bg-(--surface-muted)",
    "text-sm text-(--text-primary) outline-none transition-colors",
    "flex gap-2 flex-nowrap",
    "last:mr-0"
);

export const ONE_TIME_PASSWORD_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "h-6 px-2 py-1 text-xs",
    sm: "h-8 px-2.5 py-1.5 text-xs",
    md: "h-9 px-3 py-2 text-sm",
    lg: "h-10 px-3.5 py-2.5 text-base",
    xl: "h-11 px-4 py-2.5 text-base",
    "2xl": "h-12 px-4.5 py-3 text-lg",
    "3xl": "h-13 px-5 py-3.5 text-lg",
    "4xl": "h-14 px-5.5 py-4 text-xl",
    "5xl": "h-15 px-6 py-4.5 text-xl",
};

export const ONE_TIME_PASSWORD_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--border-default) focus:border-(--color-primary) focus:shadow-md focus:shadow-(--color-primary-200)/20",
    secondary: "border-(--border-default) focus:border-(--color-secondary) focus:shadow-md focus:shadow-gray-300/20",
    success: "border-(--color-success-500) focus:border-(--color-success-500) focus:shadow-md focus:shadow-(--color-success-300)/20",
    danger: "border-(--color-danger-500) focus:border-(--color-danger-500) focus:shadow-md focus:shadow-(--color-danger-300)/20",
    info: "border-(--color-info-500) focus:border-(--color-info-500) focus:shadow-md focus:shadow-(--color-info-300)/20",
};