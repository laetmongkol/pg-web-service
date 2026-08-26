import { CustomSize } from "@/shared/types/custom-type.type";

// left padding reserves space for the search icon; right padding reserves space for the action icon
export const SEARCH_INPUT_PADDING_CLASSNAME: Record<CustomSize, string> = {
    xs:   "pl-6  pr-6",
    sm:   "pl-7  pr-7",
    md:   "pl-9  pr-9",
    lg:   "pl-10 pr-10",
    xl:   "pl-11 pr-11",
    "2xl": "pl-12 pr-12",
    "3xl": "pl-13 pr-13",
    "4xl": "pl-14 pr-14",
    "5xl": "pl-15 pr-15",
};

export const SEARCH_ICON_SIZE: Record<CustomSize, number> = {
    xs:   12,
    sm:   14,
    md:   16,
    lg:   16,
    xl:   18,
    "2xl": 18,
    "3xl": 20,
    "4xl": 20,
    "5xl": 22,
};

export const SEARCH_SPINNER_SIZE: Record<CustomSize, string> = {
    xs:   "h-3   w-3",
    sm:   "h-3.5 w-3.5",
    md:   "h-4   w-4",
    lg:   "h-4   w-4",
    xl:   "h-4.5 w-4.5",
    "2xl": "h-5  w-5",
    "3xl": "h-5  w-5",
    "4xl": "h-5  w-5",
    "5xl": "h-6  w-6",
};
