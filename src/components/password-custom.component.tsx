"use client";

import { useReducer } from "react";
import { FieldError, type FieldValues,Path, PathValue, UseFormReturn } from "react-hook-form";

import { Eye,EyeClosedIcon } from "lucide-react";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import { InputCustomType } from "@/shared/types/input-custom.type";
import {
    BASE_FOCUS_VARIANT_CLASSNAME,
    BASE_FORM_FIELD_CLASSNAME,
    BASE_SIZE_CLASSNAME,
} from "@/shared/ui/classes/base.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

interface PasswordCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError;
        /** When set, `error.message` is treated as an i18n key and passed through this translator. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        type?: InputCustomType;
        className?: string;
        placeholder?: string;
        size?: CustomSize;
        variant?: CustomColor;
        isRequired?: boolean;
        isDisabled?: boolean;
        isReadOnly?: boolean;
    };
    text?: TextCustomProps;
}

const PasswordCustom = <TFieldValues extends FieldValues = FieldValues>({ formProps, text }: PasswordCustomProps<TFieldValues>) => {
    const { onBlur, onChange, ...registration } = formProps.form.register(formProps.name);
    const { isDisabled, isReadOnly, isInactive } = resolveFormFieldState(
        formProps,
        registration.disabled,
    );

    const [isShowPassword, togglePassword] = useReducer((s) => !s, false);

    return (
        <div className="flex flex-col gap-1">
            {text ? (
                <TextCustom
                    {...text}
                    required={formProps.isRequired}
                    disabled={isInactive}
                />
            ) : null}
            <div className="relative">
                <input
                    {...registration}
                    type={isShowPassword ? "text" : "password"}
                    placeholder={formProps.placeholder}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    className={cn(
                        BASE_FORM_FIELD_CLASSNAME,
                        BASE_SIZE_CLASSNAME[formProps.size ?? "md"],
                        BASE_FOCUS_VARIANT_CLASSNAME[formProps.error ? "danger" : formProps.variant ?? "primary"],
                        formProps.className,
                        "pr-10",
                    )}
                    onChange={(e) => {
                        if (isReadOnly) return;
                        const next = e.target.value.replace(/^\s+/, "");
                        if (next !== e.target.value) {
                            e.target.value = next;
                        }
                        onChange(e);
                    }}
                    onBlur={(e) => {
                        onBlur(e);
                        if (isReadOnly) return;

                        const next = e.target.value.trim();
                        if (next === e.target.value) return;

                        formProps.form.setValue(
                            formProps.name,
                            next as PathValue<TFieldValues, Path<TFieldValues>>,
                            { shouldValidate: true, shouldDirty: true },
                        );
                    }}
                />
                <button
                    type="button"
                    onClick={togglePassword}
                    disabled={isInactive}
                    className={cn(
                        "absolute right-2.5 top-1/2 -translate-y-1/2 text-(--text-secondary) transition-colors hover:text-(--text-primary)",
                        isInactive && "pointer-events-none opacity-50",
                    )}
                    aria-label={isShowPassword ? "Hide password" : "Show password"}
                >
                    {isShowPassword ? <Eye size={14} /> : <EyeClosedIcon size={14} />}
                </button>
            </div>
            <ErrorMessageCustom error={formProps.error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div >
    );
};

export default PasswordCustom;
