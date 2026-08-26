"use client";

import { type CSSProperties, ReactNode } from "react";
import { FieldError, type FieldValues,Path, PathValue, UseFormReturn } from "react-hook-form";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import { InputCustomType, InputIconPosition } from "@/shared/types/input-custom.type";
import {
    BASE_FOCUS_VARIANT_CLASSNAME,
    BASE_FORM_FIELD_CLASSNAME,
    BASE_SIZE_CLASSNAME,
} from "@/shared/ui/classes/base.classes";
import {
    INPUT_ICON_PADDING_CLASSNAME,
    INPUT_ICON_SLOT_CLASSNAME,
    INPUT_ICON_SLOT_POSITION_CLASSNAME,
} from "@/shared/ui/classes/input.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

interface InputCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError;
        /** When set, `error.message` is treated as an i18n key and passed through this translator. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        type?: InputCustomType;
        className?: string;
        /** Inline style on the underlying `<input>` — for dynamic, per-record values (e.g. a user-selected color) that can't be a static Tailwind class. */
        style?: CSSProperties;
        placeholder?: string;
        size?: CustomSize;
        variant?: CustomColor;
        isRequired?: boolean;
        isDisabled?: boolean;
        isReadOnly?: boolean;
        icon?: ReactNode;
        iconPosition?: InputIconPosition;
        mapOnChange?: (value: string) => string;
        mapOnBlur?: (value: string) => string;
    };
    text?: TextCustomProps;
}

const InputCustom = <TFieldValues extends FieldValues = FieldValues>({ formProps, text }: InputCustomProps<TFieldValues>) => {
    const { onBlur, onChange, ...registration } = formProps.form.register(formProps.name);
    const { isDisabled, isReadOnly, isInactive } = resolveFormFieldState(
        formProps,
        registration.disabled,
    );
    const size = formProps.size ?? "md";
    const iconPosition = formProps.iconPosition ?? "start";
    const hasIcon = formProps.icon != null;

    const inputClassName = cn(
        BASE_FORM_FIELD_CLASSNAME,
        BASE_SIZE_CLASSNAME[size],
        BASE_FOCUS_VARIANT_CLASSNAME[formProps.error ? "danger" : formProps.variant ?? "primary"],
        hasIcon && INPUT_ICON_PADDING_CLASSNAME[size][iconPosition],
        hasIcon && "order-1",
        formProps.className,
    );

    const inputElement = (
        <input
            {...registration}
            type={formProps.type ?? "text"}
            placeholder={formProps.placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            className={inputClassName}
            style={formProps.style}
            onChange={(e) => {
                if (isReadOnly) return;
                const normalized = e.target.value.replace(/^\s+/, "");
                const next = formProps.mapOnChange?.(normalized) ?? normalized;
                if (next !== e.target.value) {
                    e.target.value = next;
                }
                onChange(e);
            }}
            onBlur={(e) => {
                onBlur(e);
                if (isReadOnly) return;

                const normalized = e.target.value.trim();
                const next = formProps.mapOnBlur?.(normalized) ?? normalized;
                if (next === e.target.value) return;

                formProps.form.setValue(
                    formProps.name,
                    next as PathValue<TFieldValues, Path<TFieldValues>>,
                    { shouldValidate: true, shouldDirty: true },
                );
            }}
        />
    );

    return (
        <div className="flex flex-col gap-1">
            {text ? (
                <TextCustom
                    {...text}
                    required={formProps.isRequired}
                    disabled={isInactive}
                />
            ) : null}
            {hasIcon ? (
                <div className="relative flex w-full items-center">
                    <span
                        className={cn(
                            INPUT_ICON_SLOT_CLASSNAME,
                            INPUT_ICON_SLOT_POSITION_CLASSNAME[iconPosition],
                        )}
                    >
                        {formProps.icon}
                    </span>
                    {inputElement}
                </div>
            ) : (
                inputElement
            )}
            <ErrorMessageCustom error={formProps.error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default InputCustom;
