"use client";

import { FieldError, type FieldValues,Path, UseFormReturn } from "react-hook-form";

import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import { ONE_TIME_PASSWORD_BASE_CLASSNAME, ONE_TIME_PASSWORD_SIZE_CLASSNAME, ONE_TIME_PASSWORD_VARIANT_CLASSNAME } from "@/shared/ui/classes/one-time-passsword.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

interface OneTimePasswordCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError | undefined;
        /** When set, error.message is treated as an i18n key. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        size?: CustomSize;
        variant?: CustomColor;
        isDisabled?: boolean;
        isReadOnly?: boolean;
    };
    text?: TextCustomProps;
    fieldLength: number;
}

const OneTimePasswordCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    text,
    fieldLength
}: OneTimePasswordCustomProps<TFieldValues>) => {
    const registration = formProps.form.register(formProps.name);
    const { isInactive } = resolveFormFieldState(formProps, registration.disabled);

    return (
        <div className="flex flex-col gap-1">
            {text ? (
                <TextCustom
                    {...text}
                    required={registration.required}
                    disabled={isInactive}
                />
            ) : null}
            <OneTimePasswordField.Root
                className="flex gap-2 flex-nowrap"
                disabled={isInactive}
            >
                {Array.from({ length: fieldLength }).map((_, i) => (
                    <OneTimePasswordField.Input
                        key={i}
                        className={cn(
                            ONE_TIME_PASSWORD_BASE_CLASSNAME,
                            ONE_TIME_PASSWORD_SIZE_CLASSNAME[formProps.size ?? "md"],
                            ONE_TIME_PASSWORD_VARIANT_CLASSNAME[formProps.variant ?? "primary"],
                        )}
                    />
                ))}
                <OneTimePasswordField.HiddenInput {...registration} />
            </OneTimePasswordField.Root>
            <ErrorMessageCustom error={formProps.error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default OneTimePasswordCustom;
