"use client";

import cn from "@/lib/tw-merge";

import type { RadioPartProps } from "../radio-custom.component";

import {
    RADIO_INPUT_BASE_CLASSNAME,
    RADIO_INPUT_SIZE_CLASSNAME,
    RADIO_INPUT_VARIANT_CLASSNAME,
    RADIO_LABEL_SIZE_CLASSNAME,
} from "@/shared/ui/classes/radio.classes";

const CheckRadio = ({
    field,
    items,
    size = "md",
    variant = "primary",
    checkerPosition = "start",
    align = "column",
    onValueChange,
    isInactive = false,
}: RadioPartProps) => {
    return (
        <div className={align === "row" ? "flex flex-row flex-wrap gap-3" : "flex flex-col gap-2"}>
            {items.map((item) => (
                <label
                    key={item.value}
                    className={cn(
                        "flex cursor-pointer select-none items-center gap-2",
                        checkerPosition === "end" && "flex-row-reverse justify-between",
                    )}
                >
                    <input
                        type="radio"
                        name={field.name}
                        ref={field.ref}
                        value={item.value}
                        checked={field.value === item.value}
                        disabled={item.disabled || isInactive}
                        onChange={() => {
                            field.onChange(item.value);
                            onValueChange?.({ value: item.value, data: item.data });
                        }}
                        onBlur={field.onBlur}
                        className={cn(
                            RADIO_INPUT_BASE_CLASSNAME,
                            RADIO_INPUT_SIZE_CLASSNAME[size],
                            RADIO_INPUT_VARIANT_CLASSNAME[variant],
                        )}
                    />
                    <span className={cn(
                        RADIO_LABEL_SIZE_CLASSNAME[size],
                        "text-(--text-primary)",
                        (item.disabled || isInactive) && "opacity-50 cursor-not-allowed",
                    )}>
                        {item.label}
                    </span>
                </label>
            ))}
        </div>
    );
};

export default CheckRadio;
