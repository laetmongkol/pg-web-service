"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Search, X } from "lucide-react";

import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import {
    BASE_FOCUS_VARIANT_CLASSNAME,
    BASE_FORM_FIELD_CLASSNAME,
    BASE_SIZE_CLASSNAME,
    FIELD_CLEAR_BUTTON_BASE_CLASSNAME,
} from "@/shared/ui/classes/base.classes";
import {
    SEARCH_ICON_SIZE,
    SEARCH_INPUT_PADDING_CLASSNAME,
    SEARCH_SPINNER_SIZE,
} from "@/shared/ui/classes/search.classes";

let globalSearchTimer: ReturnType<typeof setTimeout> | null = null;
let globalSearchToken = 0;

interface SearchCustomProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    defaultValue?: string;
    size?: CustomSize;
    variant?: CustomColor;
    debounceMs?: number;
    className?: string;
    disabled?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
}

const SearchCustom = ({
    onSearch,
    placeholder = "Search...",
    defaultValue = "",
    size = "md",
    variant = "primary",
    debounceMs = 1000,
    className,
    disabled = false,
    isDisabled: isDisabledProp,
    isReadOnly = false,
}: SearchCustomProps) => {
    const isDisabled = isDisabledProp ?? disabled;
    const isInactive = isDisabled || isReadOnly;
    const [value, setValue] = useState(defaultValue);
    const [isPending, setIsPending] = useState(false);

    // stable ref so the effect never needs onSearch in its dep array
    const onSearchRef = useRef(onSearch);
    useLayoutEffect(() => { onSearchRef.current = onSearch; });

    useEffect(() => {
        const currentToken = ++globalSearchToken;

        if (globalSearchTimer) {
            clearTimeout(globalSearchTimer);
            globalSearchTimer = null;
        }

        if (value === "") {
            setIsPending(false);
            onSearchRef.current("");
            return;
        }

        setIsPending(true);

        globalSearchTimer = setTimeout(() => {
            if (currentToken !== globalSearchToken) return;
            onSearchRef.current(value);
            setIsPending(false);
            globalSearchTimer = null;
        }, debounceMs);

        return () => {
            if (currentToken !== globalSearchToken) return;
            if (globalSearchTimer) {
                clearTimeout(globalSearchTimer);
                globalSearchTimer = null;
            }
        };
    }, [value, debounceMs]);

    const iconSize = SEARCH_ICON_SIZE[size];

    return (
        <div className={cn("relative flex w-full items-center", className)}>
            <span className="pointer-events-none absolute left-2.5 flex items-center text-(--text-secondary)">
                <Search size={iconSize} />
            </span>

            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/^\s+/, ""))}
                onBlur={(e) => setValue(e.target.value.trim())}
                placeholder={placeholder}
                disabled={isDisabled}
                readOnly={isReadOnly}
                className={cn(
                    BASE_FORM_FIELD_CLASSNAME,
                    BASE_SIZE_CLASSNAME[size],
                    BASE_FOCUS_VARIANT_CLASSNAME[variant],
                    SEARCH_INPUT_PADDING_CLASSNAME[size],
                )}
            />

            <span className="absolute right-3 flex gap-3 items-stretch">
                {isPending ? (
                    <span
                        className={cn(
                            "inline-flex items-center justify-center",
                            "animate-spin rounded-full border-2 border-(--border-default) border-t-(--color-primary)",
                            SEARCH_SPINNER_SIZE[size],
                        )}
                    />
                ) : value && !isReadOnly ? (
                    <button
                        type="button"
                        onClick={() => setValue("")}
                        disabled={isInactive}
                        className={FIELD_CLEAR_BUTTON_BASE_CLASSNAME}
                        aria-label="Clear search"
                    >
                        <X size={14} />
                    </button>
                ) : null}
            </span>
        </div>
    );
};

export default SearchCustom;
