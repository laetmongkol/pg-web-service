import cn from "@/lib/tw-merge";

import { CustomColor } from "@/shared/types/custom-type.type";

import { BASE_DISABLED_CLASSNAME, BASE_SIZE_CLASSNAME } from "./base.classes";

export const DATE_PICKER_TRIGGER_BASE_CLASSNAME = cn(
    "w-full rounded-md border bg-(--surface-muted) text-(--text-primary)",
    "flex items-stretch justify-between overflow-hidden",
    "outline-none transition-colors cursor-pointer text-left",
    BASE_DISABLED_CLASSNAME
);

export const DATE_PICKER_TRIGGER_SIZE_CLASSNAME = BASE_SIZE_CLASSNAME;

export const DATE_PICKER_TRIGGER_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--border-default) focus:border-(--color-primary) focus:shadow-md focus:shadow-(--color-primary-200)/20",
    secondary: "border-(--border-default) focus:border-(--border-strong) focus:shadow-md focus:shadow-gray-300/20",
    success: "border-(--color-success-500) focus:border-(--color-success-500) focus:shadow-md focus:shadow-green-300/20",
    danger: "border-(--color-danger-500)  focus:border-(--color-danger-500) focus:shadow-md focus:shadow-red-300/20",
    info: "border-(--color-info-500)    focus:border-(--color-info-500) focus:shadow-md focus:shadow-(--color-info-300)/20",
};

export const DATE_PICKER_NAV_BTN_CLASSNAME = cn(
    "h-7 w-7 flex items-center justify-center rounded-md",
    "text-(--text-secondary) hover:bg-(--color-primary)/10 hover:text-(--text-primary)",
    "transition-colors cursor-pointer outline-none focus-visible:outline-none"
);

export const DATE_PICKER_DAY_STATE_CLASSNAME = {
    default: "text-(--text-primary) hover:bg-(--color-primary)/10",
    today: "text-(--color-primary) font-semibold hover:bg-(--color-primary)/10",
    selected: "bg-(--color-primary) text-(--text-invert) font-semibold hover:bg-(--color-primary)/90",
    outside: "text-(--text-secondary) opacity-40 hover:bg-(--color-primary)/10",
    disabled: "text-(--text-secondary) opacity-30 cursor-not-allowed pointer-events-none",
};
