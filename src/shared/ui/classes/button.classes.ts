import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize, CustomVariant } from "@/shared/types/custom-type.type";

export const BUTTON_BASE_CLASSNAME = cn(
  "inline-flex items-center justify-center gap-1.5 rounded-md font-medium leading-none",
  "outline-none transition-all duration-200",
  "cursor-pointer",
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none",
  "focus-visible:outline-none",
);

export const BUTTON_SIZE_CLASSNAME: Record<CustomSize, string> = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3.5 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
  xl: "px-5.5 py-3 text-base",
  "2xl": "px-6 py-3.5 text-lg",
  "3xl": "px-6.5 py-4 text-lg",
  "4xl": "px-7 py-4 text-xl",
  "5xl": "px-8 py-4.5 text-xl",
};

const LINK_VARIANT_CLASSNAME = cn(
  "border-0 bg-transparent",
  "text-(--text-primary) underline underline-offset-4 decoration-1",
  "hover:text-(--color-primary) hover:decoration-(--color-primary)",
  "shadow-none focus-visible:outline-none",
);

export const BUTTON_COLOR_VARIANT_CLASSNAME: Record<CustomColor, Record<CustomVariant, string>> = {
  primary: {
    solid: cn(
      "border border-(--color-primary) bg-(--color-primary) text-(--text-invert)",
      "hover:bg-(--color-primary-hover) hover:border-(--color-primary-hover)",
    ),
    soft: cn(
      "border border-(--color-primary)/30 bg-(--color-primary)/15 text-(--color-primary)",
      "hover:bg-(--color-primary)/25",
    ),
    surface: cn(
      "border border-(--border-default) bg-(--surface-muted) text-(--text-primary)",
      "hover:bg-(--surface-elevated)",
    ),
    outline: cn(
      "border border-(--color-primary) bg-transparent text-(--color-primary)",
      "hover:bg-(--color-primary)/10",
    ),
    ghost: cn(
      "border border-transparent bg-transparent text-(--color-primary)",
      "hover:bg-(--color-primary)/10",
    ),
    link: LINK_VARIANT_CLASSNAME,
  },

  secondary: {
    solid: cn(
      "border border-(--border-default) bg-(--surface-muted) text-(--text-primary)",
      "hover:bg-(--surface-elevated)",
    ),
    soft: cn(
      "border border-(--border-default) bg-(--surface-muted)/80 text-(--text-primary)",
      "hover:bg-(--surface-muted)",
    ),
    surface: cn(
      "border border-(--border-default) bg-(--surface-muted) text-(--text-primary)",
      "hover:bg-(--surface-muted)",
    ),
    outline: cn(
      "border border-(--border-default) bg-(--surface-default) text-(--text-primary)",
      "hover:border-(--border-strong) hover:bg-(--surface-muted)/40",
    ),
    ghost: cn(
      "border border-transparent bg-transparent text-(--text-primary)",
      "hover:bg-(--surface-muted)/40",
    ),
    link: LINK_VARIANT_CLASSNAME,
  },

  success: {
    solid: cn(
      "border border-(--color-success-500) bg-(--color-success-500) text-white",
      "hover:bg-(--color-success-600)",
    ),
    soft: cn(
      "border border-(--color-success-500)/30 bg-(--color-success-500)/15 text-(--color-success-500)",
      "hover:bg-(--color-success-500)/25",
    ),
    surface: cn(
      "border border-(--border-default) bg-(--surface-muted) text-(--color-success-500)",
      "hover:bg-(--surface-elevated)",
    ),
    outline: cn(
      "border border-(--color-success-500) bg-transparent text-(--color-success-500)",
      "hover:bg-(--color-success-500)/10",
    ),
    ghost: cn(
      "border border-transparent bg-transparent text-(--color-success-500)",
      "hover:bg-(--color-success-500)/10",
    ),
    link: LINK_VARIANT_CLASSNAME,
  },

  danger: {
    solid: cn(
      "border border-(--color-danger-500) bg-(--color-danger-500) text-white",
      "hover:bg-(--color-danger-600)",
    ),
    soft: cn(
      "border border-(--color-danger-500)/30 bg-(--color-danger-500)/15 text-(--color-danger-500)",
      "hover:bg-(--color-danger-500)/25",
    ),
    surface: cn(
      "border border-(--border-default) bg-(--surface-muted) text-(--color-danger-500)",
      "hover:bg-(--surface-elevated)",
    ),
    outline: cn(
      "border border-(--color-danger-500) bg-transparent text-(--color-danger-500)",
      "hover:bg-(--color-danger-500)/10",
    ),
    ghost: cn(
      "border border-transparent bg-transparent text-(--color-danger-500)",
      "hover:bg-(--color-danger-500)/10",
    ),
    link: LINK_VARIANT_CLASSNAME,
  },

  info: {
    solid: cn(
      "border border-(--color-info-500) bg-(--color-info-500) text-white",
      "hover:bg-(--color-info-600)",
    ),
    soft: cn(
      "border border-(--color-info-500)/30 bg-(--color-info-500)/15 text-(--color-info-500)",
      "hover:bg-(--color-info-500)/25",
    ),
    surface: cn(
      "border border-(--border-default) bg-(--surface-muted) text-(--color-info-500)",
      "hover:bg-(--surface-elevated)",
    ),
    outline: cn(
      "border border-(--color-info-500) bg-transparent text-(--color-info-500)",
      "hover:bg-(--color-info-500)/10",
    ),
    ghost: cn(
      "border border-transparent bg-transparent text-(--color-info-500)",
      "hover:bg-(--color-info-500)/10",
    ),
    link: LINK_VARIANT_CLASSNAME,
  },
};
