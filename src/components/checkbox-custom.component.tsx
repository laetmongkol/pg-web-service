"use client";

import { ControllerRenderProps,FieldError, type FieldValues, Path, useController, UseFormReturn } from "react-hook-form";

import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import type { ReactNode } from "react";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

import CheckCheckbox from "./parts/check-checkbox.part";
import SelectCheckbox from "./parts/select-checkbox.part";
import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

export interface CheckboxItem<TData = unknown> {
    value: string;
    label: ReactNode;
    data?: TData;
    disabled?: boolean;
}

export interface CheckboxResult<TData = unknown> {
    value: string;
    data?: TData;
}

export interface CheckboxPartProps {
    field: ControllerRenderProps<FieldValues, string>;
    items: CheckboxItem[];
    size?: CustomSize;
    variant?: CustomColor;
    checkerPosition?: "start" | "end";
    align?: "row" | "column";
    isInactive?: boolean;
    onValueChange?: (results: CheckboxResult[]) => void;
}

interface CheckboxCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError;
        /** When set, error.message is treated as an i18n key. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        size?: CustomSize;
        variant?: CustomColor;
        isDisabled?: boolean;
        isReadOnly?: boolean;
    };
    items: CheckboxItem[];
    mode?: "check" | "select";
    checkerPosition?: "start" | "end";
    align?: "row" | "column";
    text?: TextCustomProps;
    onValueChange?: (results: CheckboxResult[]) => void;
}

const CheckboxCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    items,
    mode = "check",
    checkerPosition = "start",
    align = "column",
    text,
    onValueChange,
}: CheckboxCustomProps<TFieldValues>) => {
    const { field, fieldState } = useController({
        name: formProps.name,
        control: formProps.form.control,
    });

    const { isInactive } = resolveFormFieldState(formProps, field.disabled);

    const partProps: CheckboxPartProps = {
        field: field as ControllerRenderProps<FieldValues, string>,
        items,
        size: formProps.size ?? "md",
        variant: formProps.variant ?? "primary",
        checkerPosition,
        align,
        isInactive,
        onValueChange,
    };

    const error = formProps.error ?? fieldState.error;

    return (
        <div className="flex flex-col gap-1">
            {text ? (
                <TextCustom
                    {...text}
                    required={false}
                    disabled={isInactive}
                />
            ) : null}
            {mode === "check" ? <CheckCheckbox {...partProps} /> : <SelectCheckbox {...partProps} />}
            <ErrorMessageCustom error={error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default CheckboxCustom;
