import { ReactNode } from "react";

import cn from "@/lib/tw-merge";

type TextSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type TextWeight = "light" | "regular" | "medium" | "semibold" | "bold";
type TextAlign = "start" | "center" | "end";
type TextColor = "default" | "primary" | "secondary" | "success" | "danger" | "info" | "warning";

export interface TextCustomProps {
    label: ReactNode;
    className?: string;
    isLoading?: boolean;
    size?: TextSize;
    weight?: TextWeight;
    color?: TextColor;
    align?: TextAlign;
    required?: boolean;
    disabled?: boolean;
}

const SIZE_CLASS: Record<TextSize, string> = {
    "1": "text-[10px] sm:text-[11px] md:text-[11px] lg:text-xs xl:text-xs",
    "2": "text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm",
    "3": "text-sm sm:text-base md:text-base lg:text-base xl:text-base",
    "4": "text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg",
    "5": "text-lg sm:text-xl md:text-xl lg:text-xl xl:text-xl",
    "6": "text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl",
    "7": "text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl",
    "8": "text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl",
    "9": "text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl",
};

const WEIGHT_CLASS: Record<TextWeight, string> = {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
};

const COLOR_CLASS: Record<TextColor, string> = {
    default: "text-(--text-primary)",
    secondary: "text-(--text-secondary)",
    primary: "text-(--color-primary)",
    danger: "text-(--color-danger)",
    success: "text-(--color-success)",
    info: "text-(--color-info)",
    warning: "text-(--color-warning)",
};

const ALIGN_CLASS: Record<TextAlign, string> = {
    start: "text-left",
    center: "text-center",
    end: "text-right",
};

const TextCustom = ({
    label,
    className,
    size = "2",
    weight = "regular",
    color = "default",
    align = "start",
    required = false,
    disabled = false,
}: TextCustomProps) => {
    return (
        <label
            className={cn(
                SIZE_CLASS[size],
                WEIGHT_CLASS[weight],
                COLOR_CLASS[color],
                ALIGN_CLASS[align],
                disabled && "opacity-50 cursor-not-allowed",
                required && "required",
                className,
            )}
        >
            {label}
        </label>
    );
};

export default TextCustom;
