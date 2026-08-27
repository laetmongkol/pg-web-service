import cn from "@/lib/tw-merge";

import { CustomSize } from "@/shared/types/custom-type.type";

import { BASE_FOCUS_VARIANT_CLASSNAME,BASE_FORM_FIELD_CLASSNAME } from "./base.classes";

export const TEXTAREA_MAX_HEIGHT_PX = 600;

export const TEXTAREA_BASE_CLASSNAME = cn(BASE_FORM_FIELD_CLASSNAME, "resize-y max-h-[600px]");

export const TEXTAREA_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "px-2.5 py-1.5 text-xs min-h-14",
    sm: "px-3.5 py-2 text-sm min-h-16",
    md: "px-4 py-2.5 text-sm min-h-20",
    lg: "px-5 py-3 text-base min-h-24",
    xl: "px-5.5 py-3 text-base min-h-28",
    "2xl": "px-6 py-3.5 text-lg min-h-32",
    "3xl": "px-6.5 py-4 text-lg min-h-36",
    "4xl": "px-7 py-4 text-xl min-h-40",
    "5xl": "px-8 py-4.5 text-xl min-h-48",
};

export const TEXTAREA_VARIANT_CLASSNAME = BASE_FOCUS_VARIANT_CLASSNAME;
