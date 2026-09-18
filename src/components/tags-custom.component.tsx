"use client";

import { useId, useMemo, useState } from "react";
import { FieldError, type FieldValues, Merge, Path, useController, UseFormReturn } from "react-hook-form";

import { X } from "lucide-react";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor } from "@/shared/types/custom-type.type";
import { FIELD_CLEAR_ICON_BUTTON_CLASSNAME } from "@/shared/ui/classes/base.classes";
import { BASE_FOCUS_VARIANT_CLASSNAME } from "@/shared/ui/classes/base.classes";
import {
    TAGS_CHIP_CLASSNAME,
    TAGS_CLEAR_BUTTON_CLASSNAME,
    TAGS_CONTAINER_CLASSNAME,
    TAGS_INPUT_CLASSNAME,
} from "@/shared/ui/classes/tags.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

type TagsFieldError = Merge<FieldError, (FieldError | undefined)[]> | FieldError | undefined;

export interface TagSuggestion {
    value: string;
    label: string;
}

function collectTagErrorMessages(error: TagsFieldError): string[] {
    if (!error) return [];

    const messages: string[] = [];
    const push = (item?: { message?: string } | null) => {
        if (item?.message) messages.push(item.message);
    };

    if (Array.isArray(error)) {
        error.forEach(push);
        return [...new Set(messages)];
    }

    const record = error as Merge<FieldError, (FieldError | undefined)[]>;
    push(record);
    push(record.root);

    Object.keys(record).forEach((key) => {
        if (!/^\d+$/.test(key)) return;
        push(record[Number(key) as keyof typeof record] as FieldError | undefined);
    });

    return [...new Set(messages)];
}

interface TagsCustomProps<TFieldValues extends FieldValues = FieldValues> {
    formProps: {
        name: Path<TFieldValues>;
        form: UseFormReturn<TFieldValues>;
        error?: TagsFieldError;
        /** When set, error.message is treated as an i18n key. */
        translateError?: (message: string) => string;
        showErrorMessage?: boolean;
        className?: string;
        placeholder?: string;
        variant?: CustomColor;
        isRequired?: boolean;
        isDisabled?: boolean;
        isReadOnly?: boolean;
        limit?: number;
    };
    text?: TextCustomProps;
    suggestions?: TagSuggestion[];
}

const DEFAULT_TAGS_LIMIT = 20;

const TagsCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    text,
    suggestions = [],
}: TagsCustomProps<TFieldValues>) => {
    const [tagInput, setTagInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const suggestionListId = useId();

    const { field, fieldState } = useController({
        name: formProps.name,
        control: formProps.form.control,
    });

    const errorMessages = collectTagErrorMessages(formProps.error ?? fieldState.error).map((message) =>
        formProps.translateError ? formProps.translateError(message) : message,
    );
    const displayError: FieldError | undefined = errorMessages.length
        ? { message: errorMessages.join(", "), type: "validate" }
        : undefined;
    const variant = displayError ? "danger" : formProps.variant ?? "primary";
    const limit = formProps.limit ?? DEFAULT_TAGS_LIMIT;
    const tags = useMemo(
        () => (Array.isArray(field.value) ? field.value : []) as string[],
        [field.value],
    );
    const { isDisabled, isReadOnly, isInactive } = resolveFormFieldState(formProps, field.disabled);
    const isAtLimit = tags.length >= limit;
    const filteredSuggestions = useMemo(() => {
        const query = tagInput.trim().toLocaleLowerCase();
        if (!query) return [];

        return suggestions
            .filter(
                (suggestion) =>
                    !tags.some((tag) => tag.toLocaleLowerCase() === suggestion.value.toLocaleLowerCase()) &&
                    (suggestion.label.toLocaleLowerCase().includes(query) ||
                        suggestion.value.toLocaleLowerCase().includes(query)),
            )
            .slice(0, 8);
    }, [suggestions, tagInput, tags]);
    const showSuggestions = isFocused && filteredSuggestions.length > 0;

    const addTag = (input = tagInput) => {
        if (isInactive || isAtLimit) return;
        const parts = input
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean);
        if (parts.length === 0) return;

        const next = [...tags];
        for (const value of parts) {
            if (next.length >= limit) break;
            if (next.some((tag) => tag.toLocaleLowerCase() === value.toLocaleLowerCase())) continue;
            next.push(value);
        }
        field.onChange(next);
        setTagInput("");
        setActiveSuggestionIndex(0);
    };

    const removeTag = (tag: string) => {
        if (isInactive) return;
        field.onChange(tags.filter((t) => t !== tag));
    };

    const clearTags = () => {
        if (isInactive || tags.length === 0) return;
        field.onChange([]);
        setTagInput("");
    };

    return (
        <div className="flex flex-col gap-1">
            {text || tags.length > 0 ? (
                <div className="flex items-center justify-between gap-2">
                    {text ? (
                        <TextCustom
                            {...text}
                            required={formProps.isRequired}
                            disabled={isInactive}
                        />
                    ) : null}
                    {tags.length > 0 && !isReadOnly ? (
                        <button
                            type="button"
                            onClick={clearTags}
                            disabled={isInactive}
                            className={cn(TAGS_CLEAR_BUTTON_CLASSNAME, !text && "ml-auto", "cursor-pointer")}
                            aria-label="Clear all tags"
                        >
                            Clear tags
                        </button>
                    ) : null}
                </div>
            ) : null}
            <div
                className={cn(
                    TAGS_CONTAINER_CLASSNAME,
                    BASE_FOCUS_VARIANT_CLASSNAME[variant],
                    isInactive && "cursor-not-allowed opacity-50",
                    formProps.className,
                )}
            >
                {tags.map((tag) => (
                    <span key={tag} className={TAGS_CHIP_CLASSNAME}>
                        {tag}
                        {!isReadOnly ? (
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                disabled={isInactive}
                                className={FIELD_CLEAR_ICON_BUTTON_CLASSNAME}
                                aria-label={`Remove tag ${tag}`}
                            >
                                <X size={14} />
                            </button>
                        ) : null}
                    </span>
                ))}
                {!isAtLimit && !isReadOnly ? (
                    <input
                        value={tagInput}
                        onChange={(e) => {
                            setTagInput(e.target.value.replace(/^\s+/, ""));
                            setIsFocused(true);
                            setActiveSuggestionIndex(0);
                        }}
                        onKeyDown={(e) => {
                            if (showSuggestions && e.key === "ArrowDown") {
                                e.preventDefault();
                                setActiveSuggestionIndex((index) =>
                                    Math.min(index + 1, filteredSuggestions.length - 1),
                                );
                                return;
                            }
                            if (showSuggestions && e.key === "ArrowUp") {
                                e.preventDefault();
                                setActiveSuggestionIndex((index) => Math.max(index - 1, 0));
                                return;
                            }
                            if (e.key === "Enter") {
                                e.preventDefault();
                                const suggestion = showSuggestions
                                    ? filteredSuggestions[activeSuggestionIndex]
                                    : undefined;
                                addTag(suggestion?.value);
                            }
                            if (e.key === "Escape") {
                                setIsFocused(false);
                            }
                        }}
                        onBlur={(e) => {
                            setTagInput(e.target.value.trim());
                            setIsFocused(false);
                            field.onBlur();
                        }}
                        onFocus={() => setIsFocused(true)}
                        placeholder={
                            tags.length === 0 ? (formProps.placeholder ?? "Add tag...") : undefined
                        }
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        className={TAGS_INPUT_CLASSNAME}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showSuggestions}
                        aria-controls={showSuggestions ? suggestionListId : undefined}
                        aria-activedescendant={
                            showSuggestions
                                ? `${suggestionListId}-${activeSuggestionIndex}`
                                : undefined
                        }
                    />
                ) : null}
                {showSuggestions ? (
                    <ul
                        id={suggestionListId}
                        role="listbox"
                        className="max-h-56 w-full basis-full overflow-y-auto rounded-lg border border-(--border-default) bg-(--surface-page) py-1 shadow-sm"
                    >
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                id={`${suggestionListId}-${index}`}
                                key={suggestion.value}
                                role="option"
                                aria-selected={index === activeSuggestionIndex}
                            >
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => addTag(suggestion.value)}
                                    className={cn(
                                        "w-full cursor-pointer px-3 py-2 text-left text-sm text-(--text-primary)",
                                        index === activeSuggestionIndex
                                            ? "bg-(--surface-muted)"
                                            : "hover:bg-(--surface-muted)",
                                    )}
                                >
                                    {suggestion.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : null}
                <span
                    className={cn(
                        "pointer-events-none absolute right-3 bottom-2 text-xs tabular-nums text-(--text-secondary)",
                        isAtLimit && "text-(--color-danger-500)",
                    )}
                    aria-live="polite"
                >
                    {tags.length}/{limit}
                </span>
            </div>
            <ErrorMessageCustom error={displayError} show={formProps.showErrorMessage} />
        </div>
    );
};

export default TagsCustom;
