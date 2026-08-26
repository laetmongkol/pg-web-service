"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize, CustomVariant } from "@/shared/types/custom-type.type";
import {
  BUTTON_BASE_CLASSNAME,
  BUTTON_COLOR_VARIANT_CLASSNAME,
  BUTTON_SIZE_CLASSNAME,
} from "@/shared/ui/classes/button.classes";

export type ButtonType = "button" | "submit" | "reset";
export type ButtonIconPosition = "start" | "end";

export interface ButtonCustomProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: ReactNode;
  className?: string;
  type?: ButtonType;
  variant?: CustomVariant;
  color?: CustomColor;
  size?: CustomSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
}

const ButtonCustom = ({
  children,
  className,
  type = "button",
  variant = "solid",
  color = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "end",
  onClick,
  ...props
}: ButtonCustomProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={cn(
        BUTTON_BASE_CLASSNAME,
        BUTTON_SIZE_CLASSNAME[size],
        BUTTON_COLOR_VARIANT_CLASSNAME[color][variant],
        fullWidth && "w-full",
        className,
      )}
    >
      {icon && iconPosition === "start" ? icon : null}
      {children}
      {icon && iconPosition === "end" ? icon : null}
    </button>
  );
};

export default ButtonCustom;
