"use client";

import cn from "@/lib/tw-merge";

import type { RadioPartProps } from "../radio-custom.component";

import {
    RADIO_CHIP_BASE_CLASSNAME,
    RADIO_CHIP_CHECKER_CLASSNAME,
    RADIO_CHIP_SIZE_CLASSNAME,
    RADIO_CHIP_VARIANT_CLASSNAME,
    RADIO_INPUT_BASE_CLASSNAME,
    RADIO_INPUT_SIZE_CLASSNAME,
} from "@/shared/ui/classes/radio.classes";

const SelectRadio = ({
    field,
    items,
    size = "md",
    variant = "primary",
    checkerPosition = "start",
    align = "row",
    onValueChange,
    isInactive = false,
}: RadioPartProps) => {
    return (
        <div className={align === "row" ? "flex flex-row flex-wrap gap-3" : "flex flex-col gap-2"}>
            {items.map((item) => {
                const isActive = field.value === item.value;
                return (
                    <label
                        key={item.value}
                        className={cn(
                            RADIO_CHIP_BASE_CLASSNAME,
                            RADIO_CHIP_SIZE_CLASSNAME[size],
                            RADIO_CHIP_VARIANT_CLASSNAME[variant],
                            align === "column" && "w-full",
                            checkerPosition === "end" && "flex-row-reverse justify-between",
                        )}
                    >
                        <input
                            type="radio"
                            name={field.name}
                            ref={field.ref}
                            value={item.value}
                            checked={isActive}
                            disabled={item.disabled || isInactive}
                            onChange={() => {
                                field.onChange(item.value);
                                onValueChange?.({ value: item.value, data: item.data });
                            }}
                            onBlur={field.onBlur}
                            className="sr-only"
                        />
                        <span
                            aria-hidden
                            className={cn(
                                RADIO_INPUT_BASE_CLASSNAME,
                                RADIO_INPUT_SIZE_CLASSNAME[size],
                                RADIO_CHIP_CHECKER_CLASSNAME.variant[variant],
                            )}
                        />
                        <span>{item.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

export default SelectRadio;
