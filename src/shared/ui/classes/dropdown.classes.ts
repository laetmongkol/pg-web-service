import cn from "@/lib/tw-merge";

import { CustomColor } from "@/shared/types/custom-type.type";

import { BASE_DISABLED_CLASSNAME, BASE_SIZE_CLASSNAME } from "./base.classes";

export const DROPDOWN_TRIGGER_WRAPPER_CLASSNAME = cn(
    "w-full rounded-md border bg-(--surface-muted)",
    "inline-flex items-stretch overflow-hidden",
    BASE_SIZE_CLASSNAME.md,
    "outline-none transition-colors cursor-pointer",
    "focus-visible:outline-none",
    BASE_DISABLED_CLASSNAME,
);

export const DROPDOWN_TRIGGER_VARIANT_CLASSNAME: Record<CustomColor, string> = {
    primary: "border-(--border-default) hover:border-(--color-primary)/50",
    secondary: "border-(--border-default) hover:border-(--color-secondary)/50",
    success: "border-(--color-success-500) hover:border-(--color-success-500)/70",
    danger: "border-(--color-danger-500) hover:border-(--color-danger-500)/70",
    info: "border-(--color-info-500) hover:border-(--color-info-500)/70",
};

export const DROPDOWN_CONTENT_CLASSNAME = cn(
    "min-w-(--radix-dropdown-menu-trigger-width) rounded-md border border-(--border-default)",
    "bg-(--surface-default) p-1 shadow-lg z-[110]",
    "max-h-[min(var(--radix-dropdown-menu-content-available-height),20rem)] overflow-y-auto overscroll-contain",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
);

export const DROPDOWN_ITEM_BASE_CLASSNAME = cn(
    "flex items-center justify-between gap-2 px-2 py-1.5 rounded-sm",
    "text-sm text-(--text-primary) cursor-pointer outline-none",
    "hover:bg-(--color-primary)/10 focus:bg-(--color-primary)/10",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "mb-0.5 last:mb-0",
);
