"use client";

import { ReactNode } from "react";
import { FieldError, type FieldValues, Path, useController,UseFormReturn } from "react-hook-form";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import {
    SWITCH_LABEL_SIZE_CLASSNAME,
    SWITCH_SIZE_CLASSNAME,
    SWITCH_TRACK_BASE_CLASSNAME,
    SWITCH_VARIANT_CLASSNAME,
} from "@/shared/ui/classes/switch.classes";

import ErrorMessageCustom from "./error-message-custom.component";

interface SwitchCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError;
        /** When set, error.message is treated as an i18n key. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        size?: CustomSize;
        color?: CustomColor;
        isDisabled?: boolean;
        isReadOnly?: boolean;
    };
    label?: ReactNode;
    labelPosition?: "left" | "right";
}

const SwitchCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    label,
    labelPosition = "right",
}: SwitchCustomProps<TFieldValues>) => {
    const { field, fieldState } = useController({
        name: formProps.name,
        control: formProps.form.control,
    });

    const error = formProps.error ?? fieldState.error;
    const size = formProps.size ?? "md";
    const color = formProps.color ?? "primary";
    const { isInactive } = resolveFormFieldState(formProps, field.disabled);

    const labelEl = label ? (
        <span className={cn(
            SWITCH_LABEL_SIZE_CLASSNAME[size],
            "font-medium text-(--text-primary)",
            isInactive && "opacity-50",
        )}>
            {label}
        </span>
    ) : null;

    return (
        <div className="flex flex-col">
            <label className={cn(
                "inline-flex cursor-pointer select-none items-center gap-2",
                isInactive && "cursor-not-allowed opacity-60",
            )}>
                {labelPosition === "left" && labelEl}
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!!field.value}
                    onChange={(e) => {
                        if (formProps.isReadOnly) return;
                        field.onChange(e.target.checked);
                    }}
                    onBlur={field.onBlur}
                    disabled={isInactive}
                />
                <div className={cn(
                    SWITCH_TRACK_BASE_CLASSNAME,
                    SWITCH_SIZE_CLASSNAME[size],
                    SWITCH_VARIANT_CLASSNAME[color],
                )} />
                {labelPosition === "right" && labelEl}
            </label>
            <ErrorMessageCustom error={error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default SwitchCustom;
