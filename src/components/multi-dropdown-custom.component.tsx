"use client";

import { useMemo, useState } from "react";
import { FieldError, type FieldValues, Path, useController, UseFormReturn } from "react-hook-form";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import type { DropdownItem } from "./dropdown-custom.component";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import { FIELD_CLEAR_BUTTON_BASE_CLASSNAME, FORM_FIELD_LOCKED_CLASSNAME } from "@/shared/ui/classes/base.classes";
import {
    DROPDOWN_CONTENT_CLASSNAME,
    DROPDOWN_ITEM_BASE_CLASSNAME,
    DROPDOWN_TRIGGER_VARIANT_CLASSNAME,
    DROPDOWN_TRIGGER_WRAPPER_CLASSNAME,
} from "@/shared/ui/classes/dropdown.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

interface MultiDropdownCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: FieldError;
        /** When set, error.message is treated as an i18n key. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        size?: CustomSize;
        variant?: CustomColor;
        placeholder?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        isReadOnly?: boolean;
        className?: string;
    };
    items: DropdownItem[];
    text?: TextCustomProps;
    hasSearch?: boolean;
    hasClear?: boolean;
    searchPlaceholder?: string;
    side?: "top" | "right" | "bottom" | "left";
    avoidCollisions?: boolean;
    onValueChange?: (items: DropdownItem[]) => void;
}

const toStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item)).filter(Boolean);
};

const MultiDropdownCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    items,
    text,
    hasSearch = false,
    hasClear = true,
    searchPlaceholder = "Search...",
    side = "bottom",
    avoidCollisions = true,
    onValueChange,
}: MultiDropdownCustomProps<TFieldValues>) => {
    const { field, fieldState } = useController({
        name: formProps.name,
        control: formProps.form.control,
    });

    const [searchQuery, setSearchQuery] = useState("");

    const { isReadOnly, isInactive } = resolveFormFieldState(formProps, field.disabled);
    const selectedValues = toStringArray(field.value);
    const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
    const selectedItems = useMemo(
        () => items.filter((item) => selectedSet.has(item.value)),
        [items, selectedSet],
    );
    const hasSelection = selectedItems.length > 0;
    const error = formProps.error ?? fieldState.error;
    const variant = formProps.variant ?? "primary";

    const filteredItems = useMemo(() => {
        const query = hasSearch && searchQuery ? searchQuery.toLowerCase() : "";
        if (!query) return items;
        return items.filter(
            (item) =>
                item.label.toLowerCase().includes(query) ||
                item.value.toLowerCase().includes(query),
        );
    }, [hasSearch, items, searchQuery]);

    const triggerLabel = (() => {
        if (!hasSelection) return formProps.placeholder ?? "Select...";
        if (selectedItems.length === 1) return selectedItems[0].label;
        if (selectedItems.length <= 3) return selectedItems.map((item) => item.label).join(", ");
        return `${selectedItems.length} selected`;
    })();

    const emitChange = (nextValues: string[]) => {
        field.onChange(nextValues);
        onValueChange?.(items.filter((item) => nextValues.includes(item.value)));
    };

    const handleToggle = (item: DropdownItem) => {
        if (item.disabled) return;
        const next = selectedSet.has(item.value)
            ? selectedValues.filter((value) => value !== item.value)
            : [...selectedValues, item.value];
        emitChange(next);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setSearchQuery("");
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        emitChange([]);
        setSearchQuery("");
    };

    return (
        <div className="flex flex-col gap-1">
            {text ? (
                <TextCustom {...text} required={formProps.isRequired} disabled={isInactive} />
            ) : null}
            <DropdownMenu.Root modal={false} onOpenChange={handleOpenChange}>
                <DropdownMenu.Trigger asChild disabled={isInactive}>
                    <div
                        className={cn(
                            DROPDOWN_TRIGGER_WRAPPER_CLASSNAME,
                            DROPDOWN_TRIGGER_VARIANT_CLASSNAME[variant],
                            error && "border-(--color-danger-500)",
                            isInactive && FORM_FIELD_LOCKED_CLASSNAME,
                            formProps.className,
                        )}
                    >
                        <span
                            className={cn(
                                "flex min-w-0 flex-1 items-center truncate text-left",
                                isInactive
                                    ? "text-(--text-secondary)"
                                    : hasSelection
                                      ? "text-(--text-primary)"
                                      : "text-(--text-secondary)",
                            )}
                        >
                            {triggerLabel}
                        </span>

                        <div className="flex shrink-0 items-stretch gap-3">
                            {hasClear && hasSelection && !isReadOnly ? (
                                <button
                                    type="button"
                                    disabled={isInactive}
                                    aria-label="Clear selection"
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={handleClear}
                                    className={FIELD_CLEAR_BUTTON_BASE_CLASSNAME}
                                >
                                    <X size={14} />
                                </button>
                            ) : null}
                            <span
                                className="inline-flex items-center justify-center text-(--text-secondary)"
                                aria-hidden
                            >
                                <ChevronDown size={14} />
                            </span>
                        </div>
                    </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        side={side}
                        align="start"
                        sideOffset={4}
                        collisionPadding={10}
                        avoidCollisions={avoidCollisions}
                        className={DROPDOWN_CONTENT_CLASSNAME}
                        onCloseAutoFocus={(event) => event.preventDefault()}
                        onWheel={(event) => {
                            event.stopPropagation();
                            const target = event.currentTarget;
                            if (target.scrollHeight <= target.clientHeight) return;
                            target.scrollTop += event.deltaY;
                        }}
                    >
                        {hasSearch ? (
                            <div className="sticky top-0 z-20 mb-1 flex items-center gap-1.5 border-b border-(--border-default) bg-(--surface-default) px-2 py-1.5">
                                <Search size={14} className="shrink-0 text-(--text-secondary)" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    autoFocus
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className="min-w-0 flex-1 bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary)"
                                />
                            </div>
                        ) : null}

                        {filteredItems.length === 0 ? (
                            <div className="px-2 py-3 text-center text-sm text-(--text-secondary)">
                                {hasSearch && searchQuery ? `No results for "${searchQuery}"` : "No options"}
                            </div>
                        ) : (
                            filteredItems.map((item) => {
                                const checked = selectedSet.has(item.value);
                                return (
                                    <DropdownMenu.CheckboxItem
                                        key={item.value}
                                        checked={checked}
                                        disabled={item.disabled}
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            handleToggle(item);
                                        }}
                                        className={cn(
                                            DROPDOWN_ITEM_BASE_CLASSNAME,
                                            item.disabled && "cursor-not-allowed opacity-45",
                                        )}
                                    >
                                        <span>{item.label}</span>
                                        {checked ? (
                                            <Check size={14} className="text-(--color-primary)" />
                                        ) : (
                                            <span className="size-3.5 shrink-0" aria-hidden />
                                        )}
                                    </DropdownMenu.CheckboxItem>
                                );
                            })
                        )}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <ErrorMessageCustom error={error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default MultiDropdownCustom;
