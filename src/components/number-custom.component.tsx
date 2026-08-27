"use client";

import { ReactNode, useState } from "react";
import {
  FieldError,
  type FieldValues,
  Path,
  PathValue,
  useController,
  UseFormReturn,
} from "react-hook-form";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import { InputIconPosition } from "@/shared/types/input-custom.type";
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
import {
  formatNumberDisplay,
  isWithinPrecisionInput,
  normalizeNumberValue,
  NUMBER_HIDE_SPINNER_CLASSNAME,
  resolveNumberFieldValue,
  sanitizeZeroStartInput,
  stepFromPrecision,
} from "@/shared/ui/classes/number.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

interface NumberCustomProps<TFieldValues extends FieldValues = FieldValues> {
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
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    min?: number;
    max?: number;
    step?: number | string;
    /** Max decimal places; uses text input with fixed display (e.g. 0.00). */
    precision?: number;
    emptyFallback?: number;
    icon?: ReactNode;
    iconPosition?: InputIconPosition;
  };
  text?: TextCustomProps;
}

const NumberCustom = <TFieldValues extends FieldValues = FieldValues>({
  formProps,
  text,
}: NumberCustomProps<TFieldValues>) => {
  const precision = formProps.precision;
  const emptyFallback = formProps.emptyFallback ?? 0;
  const usesFormattedText = precision != null;
  const step =
    formProps.step ?? (usesFormattedText ? stepFromPrecision(precision) : undefined);
  const size = formProps.size ?? "md";
  const iconPosition = formProps.iconPosition ?? "start";
  const hasIcon = formProps.icon != null;

  const { field } = useController({
    name: formProps.name,
    control: formProps.form.control,
    defaultValue: emptyFallback as PathValue<TFieldValues, Path<TFieldValues>>,
  });
  const { isDisabled, isReadOnly, isInactive } = resolveFormFieldState(
    formProps,
    field.disabled,
  );

  const [isFocused, setIsFocused] = useState(false);
  const [editText, setEditText] = useState("");

  const numericValue = normalizeNumberValue(field.value, emptyFallback);

  const inputClassName = cn(
    BASE_FORM_FIELD_CLASSNAME,
    BASE_SIZE_CLASSNAME[size],
    BASE_FOCUS_VARIANT_CLASSNAME[formProps.error ? "danger" : formProps.variant ?? "primary"],
    NUMBER_HIDE_SPINNER_CLASSNAME,
    hasIcon && INPUT_ICON_PADDING_CLASSNAME[size][iconPosition],
    hasIcon && "order-1",
    formProps.className,
  );

  const inputElement = usesFormattedText ? (
    <input
      name={formProps.name}
      type="text"
      inputMode="decimal"
      value={isFocused ? editText : formatNumberDisplay(numericValue, precision)}
      placeholder={formProps.placeholder ?? formatNumberDisplay(emptyFallback, precision)}
      disabled={isDisabled}
      readOnly={isReadOnly}
      className={inputClassName}
      onFocus={(event) => {
        if (isReadOnly) return;
        setIsFocused(true);
        setEditText(formatNumberDisplay(numericValue, precision));
        requestAnimationFrame(() => event.target.select());
      }}
      onChange={(event) => {
        if (isReadOnly) return;
        let raw = event.target.value;
        if (!isWithinPrecisionInput(raw, precision)) return;

        raw = sanitizeZeroStartInput(raw, normalizeNumberValue(field.value, emptyFallback));
        setEditText(raw);

        if (raw === "" || raw === ".") return;

        const parsed = Number.parseFloat(raw);
        if (!Number.isNaN(parsed)) {
          field.onChange(parsed);
        }
      }}
      onBlur={(event) => {
        setIsFocused(false);
        const resolved = resolveNumberFieldValue(
          event.target.value,
          Number.parseFloat(event.target.value),
          emptyFallback,
          precision,
        );
        field.onChange(resolved);
        setEditText(formatNumberDisplay(resolved, precision));
        field.onBlur();
      }}
    />
  ) : (
    <input
      name={formProps.name}
      type="number"
      inputMode="decimal"
      value={Number.isNaN(numericValue) ? "" : numericValue}
      placeholder={formProps.placeholder}
      disabled={isDisabled}
      readOnly={isReadOnly}
      min={formProps.min}
      max={formProps.max}
      step={step}
      className={inputClassName}
      onChange={(event) => {
        if (isReadOnly) return;
        const parsed = event.target.valueAsNumber;
        field.onChange(
          resolveNumberFieldValue(event.target.value, parsed, emptyFallback),
        );
      }}
      onBlur={(event) => {
        const resolved = resolveNumberFieldValue(
          event.target.value,
          event.target.valueAsNumber,
          emptyFallback,
        );
        field.onChange(resolved);
        field.onBlur();
      }}
    />
  );

  return (
    <div className="flex flex-col gap-1">
      {text ? (
        <TextCustom {...text} required={formProps.isRequired} disabled={isInactive} />
      ) : null}
      {hasIcon ? (
        <div className="relative flex w-full items-center">
          <span
            className={cn(INPUT_ICON_SLOT_CLASSNAME, INPUT_ICON_SLOT_POSITION_CLASSNAME[iconPosition])}
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

export default NumberCustom;
