export type CardSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
export type CardVariant = "surface" | "classic" | "ghost";

export const CARD_SIZE_CLASSNAME: Record<CardSize, string> = {
    "1": "p-1.5 sm:p-2 md:p-2.5 lg:p-2.5 xl:p-3",
    "2": "p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4",
    "3": "p-2.5 sm:p-3 md:p-4 lg:p-4.5 xl:p-5",
    "4": "p-3 sm:p-4 md:p-5 lg:p-5.5 xl:p-6",
    "5": "p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8",
    "6": "p-5 sm:p-6 md:p-8 lg:p-9 xl:p-10",
    "7": "p-6 sm:p-8 md:p-9 lg:p-10 xl:p-12",
    "8": "p-7 sm:p-9 md:p-11 lg:p-12 xl:p-14",
    "9": "p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16",
    "10": "p-9 sm:p-12 md:p-14 lg:p-16 xl:p-18",
};

export const CARD_VARIANT_CLASSNAME: Record<CardVariant, string> = {
    surface: "bg-(--surface-default) rounded-xl shadow-sm ring-1 ring-black/[0.04]",
    classic: "bg-(--surface-default) rounded-xl shadow-md ring-1 ring-black/[0.06]",
    ghost: "bg-transparent",
};
