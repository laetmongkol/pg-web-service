"use client";

import { Check } from "lucide-react";

import cn from "@/lib/tw-merge";

import type { CheckboxPartProps } from "../checkbox-custom.component";

import {
    CHECKBOX_INPUT_BASE_CLASSNAME,
    CHECKBOX_INPUT_SIZE_CLASSNAME,
    CHECKBOX_INPUT_VARIANT_CLASSNAME,
    CHECKBOX_LABEL_SIZE_CLASSNAME,
} from "@/shared/ui/classes/checkbox.classes";

const CheckCheckbox = ({
    field,
    items,
    size = "xl",
    variant = "primary",
    checkerPosition = "start",
    isInactive = false,
}: CheckboxPartProps) => {
    const item = items[0];
    if (!item) return null;
    const {
        name,
        ref,
        value,
        onChange,
        onBlur,
    } = field;

    return (
        <label
            className={cn(
                "flex cursor-pointer select-none items-center gap-2",
                checkerPosition === "end" && "flex-row-reverse justify-between",
            )}
        >
            <span
                className={cn(
                    "relative inline-flex shrink-0 items-center justify-center overflow-visible",
                    CHECKBOX_INPUT_SIZE_CLASSNAME[size],
                )}
            >
                <input
                    type="checkbox"
                    name={name}
                    ref={ref}
                    checked={!!value}
                    disabled={item.disabled || isInactive}
                    onChange={(e) => onChange(e.target.checked)}
                    onBlur={onBlur}
                    className={cn(
                        CHECKBOX_INPUT_BASE_CLASSNAME,
                        CHECKBOX_INPUT_SIZE_CLASSNAME[size],
                        CHECKBOX_INPUT_VARIANT_CLASSNAME[variant],
                        "peer",
                    )}
                />
                <Check
                    aria-hidden
                    strokeWidth={3}
                    className={cn(
                        "pointer-events-none absolute left-1/2 top-1/2 size-[62.5%] min-h-2 min-w-2 -translate-x-1/2 -translate-y-1/2",
                        "text-(--color-primary) opacity-0 transition-opacity duration-150",
                        "peer-checked:opacity-100 peer-disabled:peer-checked:opacity-40",
                    )}
                />
            </span>
            <span className={cn(
                CHECKBOX_LABEL_SIZE_CLASSNAME[size],
                "text-(--text-primary)",
                (item.disabled || isInactive) && "opacity-50 cursor-not-allowed",
            )}>
                {item.label}
            </span>
        </label>
    );
};

export default CheckCheckbox;
