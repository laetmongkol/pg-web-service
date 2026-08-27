"use client";

import { ComponentPropsWithoutRef } from "react";
import { FieldError, type FieldValues,Path, PathValue, UseFormReturn } from "react-hook-form";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import {
    TEXTAREA_BASE_CLASSNAME,
    TEXTAREA_MAX_HEIGHT_PX,
    TEXTAREA_SIZE_CLASSNAME,
    TEXTAREA_VARIANT_CLASSNAME,
} from "@/shared/ui/classes/textarea.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

export type TextareaNativeProps = Omit<
    ComponentPropsWithoutRef<"textarea">,
    "name" | "onChange" | "onBlur" | "ref"
>;

interface TextareaCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError;
        /** When set, error.message is treated as an i18n key. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        className?: string;
        placeholder?: string;
        size?: CustomSize;
        variant?: CustomColor;
        rows?: number;
        isDisabled?: boolean;
        isReadOnly?: boolean;
        /** Override default max height (600px) */
        maxHeight?: number | string;
        /** Native textarea attributes (e.g. autoComplete, readOnly, aria-*) */
        textareaProps?: TextareaNativeProps;
    };
    text?: TextCustomProps;
}

const TextareaCustom = <TFieldValues extends FieldValues = FieldValues>({ formProps, text }: TextareaCustomProps<TFieldValues>) => {
    const { onBlur, onChange, ...registration } = formProps.form.register(formProps.name);
    const { isDisabled, isReadOnly, isInactive } = resolveFormFieldState(
        formProps,
        registration.disabled,
    );
    const {
        className: nativeClassName,
        style: nativeStyle,
        rows: nativeRows,
        placeholder: nativePlaceholder,
        disabled: nativeDisabled,
        readOnly: nativeReadOnly,
        ...nativeTextareaProps
    } = formProps.textareaProps ?? {};
    const fieldDisabled = isDisabled || !!nativeDisabled;
    const fieldReadOnly = isReadOnly || !!nativeReadOnly;

    const { maxHeight: nativeMaxHeight, ...nativeStyleRest } = nativeStyle ?? {};
    const maxHeight =
        formProps.maxHeight ?? nativeMaxHeight ?? `${TEXTAREA_MAX_HEIGHT_PX}px`;

    return (
        <div className="flex flex-col gap-1">
            {text ? (
                <TextCustom
                    {...text}
                    required={text?.required}
                    disabled={isInactive}
                />
            ) : null}
            <textarea
                {...registration}
                {...nativeTextareaProps}
                rows={formProps.rows ?? nativeRows ?? 4}
                placeholder={formProps.placeholder ?? nativePlaceholder}
                disabled={fieldDisabled}
                readOnly={fieldReadOnly}
                style={{ ...nativeStyleRest, maxHeight }}
                className={cn(
                    TEXTAREA_BASE_CLASSNAME,
                    TEXTAREA_SIZE_CLASSNAME[formProps.size ?? "md"],
                    TEXTAREA_VARIANT_CLASSNAME[formProps.variant ?? "primary"],
                    formProps.className,
                    nativeClassName,
                )}
                onChange={(e) => {
                    if (fieldReadOnly) return;
                    const next = e.target.value.replace(/^\s+/, "");
                    if (next !== e.target.value) {
                        e.target.value = next;
                    }
                    onChange(e);
                }}
                onBlur={(e) => {
                    onBlur(e);
                    if (fieldReadOnly) return;

                    const next = e.target.value.trim();
                    if (next === e.target.value) return;

                    formProps.form.setValue(
                        formProps.name,
                        next as PathValue<TFieldValues, Path<TFieldValues>>,
                        { shouldValidate: true, shouldDirty: true },
                    );
                }}
            />
            <ErrorMessageCustom error={formProps.error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default TextareaCustom;
