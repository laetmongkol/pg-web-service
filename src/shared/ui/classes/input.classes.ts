import cn from "@/lib/tw-merge";

import { CustomSize } from "@/shared/types/custom-type.type";

export const INPUT_ICON_SLOT_CLASSNAME = cn(
    "absolute top-1/2 flex -translate-y-1/2 items-center text-(--text-secondary)",
);

export const INPUT_ICON_SLOT_POSITION_CLASSNAME = {
    start: "left-2.5 order-0",
    end: "right-2.5 order-2",
} as const;

export const INPUT_ICON_SIZE: Record<CustomSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 16,
    xl: 18,
    "2xl": 18,
    "3xl": 20,
    "4xl": 20,
    "5xl": 22,
};

export const INPUT_ICON_PADDING_CLASSNAME: Record<CustomSize, { start: string; end: string }> = {
    xs: { start: "pl-6 pr-2", end: "pl-2 pr-6" },
    sm: { start: "pl-7 pr-2.5", end: "pl-2.5 pr-7" },
    md: { start: "pl-9 pr-3", end: "pl-3 pr-9" },
    lg: { start: "pl-10 pr-3.5", end: "pl-3.5 pr-10" },
    xl: { start: "pl-11 pr-4", end: "pl-4 pr-11" },
    "2xl": { start: "pl-12 pr-4.5", end: "pl-4.5 pr-12" },
    "3xl": { start: "pl-13 pr-5", end: "pl-5 pr-13" },
    "4xl": { start: "pl-14 pr-5.5", end: "pl-5.5 pr-14" },
    "5xl": { start: "pl-15 pr-6", end: "pl-6 pr-15" },
};