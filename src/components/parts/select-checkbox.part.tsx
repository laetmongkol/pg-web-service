"use client";

import { Check } from "lucide-react";

import cn from "@/lib/tw-merge";

import type { CheckboxItem, CheckboxPartProps, CheckboxResult } from "../checkbox-custom.component";

import {
    CHECKBOX_CHIP_BASE_CLASSNAME,
    CHECKBOX_CHIP_CHECKER_ACTIVE_CLASSNAME,
    CHECKBOX_CHIP_CHECKER_INACTIVE_CLASSNAME,
    CHECKBOX_CHIP_SIZE_CLASSNAME,
    CHECKBOX_CHIP_VARIANT_CLASSNAME,
} from "@/shared/ui/classes/checkbox.classes";

const SelectCheckbox = ({
    field,
    items,
    size = "md",
    variant = "primary",
    checkerPosition = "start",
    align = "row",
    onValueChange,
    isInactive = false,
}: CheckboxPartProps) => {
    const currentValues: string[] = field.value || [];

    const handleChange = (item: CheckboxItem, checked: boolean) => {
        if (isInactive) return;
        const newValues = checked
            ? [...currentValues, item.value]
            : currentValues.filter((v) => v !== item.value);

        field.onChange(newValues);

        const results: CheckboxResult[] = items
            .filter((i) => newValues.includes(i.value))
            .map((i) => ({ value: i.value, data: i.data }));
        onValueChange?.(results);
    };

    return (
        <div className={align === "row" ? "flex flex-row flex-wrap gap-3" : "flex flex-col gap-2"}>
            {items.map((item) => {
                const isActive = currentValues.includes(item.value);
                const chipVariant = CHECKBOX_CHIP_VARIANT_CLASSNAME[variant];
                return (
                    <label
                        key={item.value}
                        className={cn(
                            CHECKBOX_CHIP_BASE_CLASSNAME,
                            CHECKBOX_CHIP_SIZE_CLASSNAME[size],
                            align === "column" && "w-full",
                            checkerPosition === "end" && "flex-row-reverse justify-between",
                            isActive ? chipVariant.active : chipVariant.inactive,
                        )}
                    >
                        <input
                            type="checkbox"
                            name={field.name}
                            ref={field.ref}
                            value={item.value}
                            checked={isActive}
                            disabled={item.disabled || isInactive}
                            onChange={(e) => handleChange(item, e.target.checked)}
                            onBlur={field.onBlur}
                            className="sr-only"
                        />
                        <span
                            className={cn(
                                "inline-flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                                isActive
                                    ? CHECKBOX_CHIP_CHECKER_ACTIVE_CLASSNAME[variant]
                                    : CHECKBOX_CHIP_CHECKER_INACTIVE_CLASSNAME,
                            )}
                        >
                            <Check
                                className={cn(
                                    "size-3 transition-opacity",
                                    isActive ? "opacity-100" : "opacity-0",
                                )}
                            />
                        </span>
                        <span>{item.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

export default SelectCheckbox;
