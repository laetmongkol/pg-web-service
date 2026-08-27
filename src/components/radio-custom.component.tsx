"use client";

import { FieldError, type FieldValues, Path, useController,UseFormReturn } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form";

import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";

import CheckRadio from "./parts/check-radio.part";
import SelectRadio from "./parts/select-radio.part";
import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

export interface RadioItem<TData = unknown> {
    value: string;
    label: string;
    data?: TData;
    disabled?: boolean;
}

export interface RadioResult<TData = unknown> {
    value: string;
    data?: TData;
}

export interface RadioPartProps {
    field: ControllerRenderProps<FieldValues, string>;
    items: RadioItem[];
    size?: CustomSize;
    variant?: CustomColor;
    checkerPosition?: "start" | "end";
    align?: "row" | "column";
    isInactive?: boolean;
    onValueChange?: (result: RadioResult) => void;
}

interface RadioCustomProps<TFieldValues extends FieldValues = FieldValues> {
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
    items: RadioItem[];
    style?: "check" | "select";
    checkerPosition?: "start" | "end";
    align?: "row" | "column";
    text?: TextCustomProps;
    onValueChange?: (result: RadioResult) => void;
}

const RadioCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    items,
    style = "check",
    checkerPosition = "start",
    align = "column",
    text,
    onValueChange,
}: RadioCustomProps<TFieldValues>) => {
    const { field, fieldState } = useController({
        name: formProps.name,
        control: formProps.form.control,
    });

    const { isInactive } = resolveFormFieldState(formProps, field.disabled);

    const partProps: RadioPartProps = {
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
            {style === "check" ? <CheckRadio {...partProps} /> : <SelectRadio {...partProps} />}
            <ErrorMessageCustom error={error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default RadioCustom;
