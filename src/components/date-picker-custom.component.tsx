"use client";

import { useEffect, useRef, useState } from "react";
import { FieldError, type FieldValues, Path, useController, UseFormReturn } from "react-hook-form";

import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

import cn from "@/lib/tw-merge";
import { resolveFormFieldState } from "@/lib/ui/form-field-state";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import { FIELD_CLEAR_BUTTON_BASE_CLASSNAME } from "@/shared/ui/classes/base.classes";
import {
    DATE_PICKER_DAY_STATE_CLASSNAME,
    DATE_PICKER_NAV_BTN_CLASSNAME,
    DATE_PICKER_TRIGGER_BASE_CLASSNAME,
    DATE_PICKER_TRIGGER_SIZE_CLASSNAME,
    DATE_PICKER_TRIGGER_VARIANT_CLASSNAME,
} from "@/shared/ui/classes/date-picker.classes";

import ErrorMessageCustom from "./error-message-custom.component";
import TextCustom, { TextCustomProps } from "./text-custom.component";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

type CalendarView = "days" | "months" | "years";
const YEARS_PER_PAGE = 12;

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(new Date(year, month, d));
    }
    while (days.length % 7 !== 0) days.push(null);
    return days;
}

interface DatePickerCustomProps<TFieldValues extends FieldValues = FieldValues> {
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
        minDate?: Date;
        maxDate?: Date;
        isRequired?: boolean;
        isDisabled?: boolean;
        isReadOnly?: boolean;
    };
    text?: TextCustomProps;
}

const DatePickerCustom = <TFieldValues extends FieldValues = FieldValues>({
    formProps,
    text,
}: DatePickerCustomProps<TFieldValues>) => {
    const { field, fieldState } = useController({
        name: formProps.name,
        control: formProps.form.control,
    });

    const today = new Date();
    const selectedDate: Date | null = field.value ? new Date(field.value) : null;

    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<CalendarView>("days");
    const [displayMonth, setDisplayMonth] = useState<Date>(selectedDate ?? today);
    const [yearPageStart, setYearPageStart] = useState<number>(() => {
        const y = (selectedDate ?? today).getFullYear();
        return y - (y % YEARS_PER_PAGE);
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setView("days");
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const calendarDays = getCalendarDays(year, month);

    const { isDisabled, isReadOnly, isInactive } = resolveFormFieldState(formProps, field.disabled);

    const openCalendar = () => {
        if (isInactive) return;
        setView("days");
        setIsOpen((o) => !o);
    };

    const selectDay = (date: Date) => {
        field.onChange(date.toISOString());
        setIsOpen(false);
        setView("days");
    };

    const clearDate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        field.onChange(null);
    };

    const isDateDisabled = (date: Date) => {
        if (formProps.minDate && date < formProps.minDate) return true;
        if (formProps.maxDate && date > formProps.maxDate) return true;
        return false;
    };

    const handleHeaderClick = () => {
        if (view === "days") setView("months");
        else if (view === "months") setView("years");
    };

    const selectMonth = (m: number) => {
        setDisplayMonth(new Date(year, m, 1));
        setView("days");
    };

    const selectYear = (y: number) => {
        setDisplayMonth(new Date(y, month, 1));
        setYearPageStart(y - (y % YEARS_PER_PAGE));
        setView("months");
    };

    const prevPeriod = () => {
        if (view === "days") setDisplayMonth(new Date(year, month - 1, 1));
        else if (view === "months") setDisplayMonth(new Date(year - 1, month, 1));
        else setYearPageStart((s) => s - YEARS_PER_PAGE);
    };

    const nextPeriod = () => {
        if (view === "days") setDisplayMonth(new Date(year, month + 1, 1));
        else if (view === "months") setDisplayMonth(new Date(year + 1, month, 1));
        else setYearPageStart((s) => s + YEARS_PER_PAGE);
    };

    const headerLabel = () => {
        if (view === "days") return `${MONTHS_FULL[month]} ${year}`;
        if (view === "months") return `${year}`;
        return `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}`;
    };

    const error = formProps.error ?? fieldState.error;
    const size = formProps.size ?? "md";
    const variant = formProps.variant ?? "primary";

    return (
        <div className="flex flex-col gap-1" ref={containerRef}>
            {text ? (
                <TextCustom {...text} required={formProps.isRequired} disabled={isInactive} />
            ) : null}
            <div className="relative">
                <div
                    className={cn(
                        DATE_PICKER_TRIGGER_BASE_CLASSNAME,
                        DATE_PICKER_TRIGGER_VARIANT_CLASSNAME[error ? "danger" : variant],
                        isInactive && "cursor-not-allowed opacity-50",
                    )}
                >
                    <button
                        type="button"
                        onClick={openCalendar}
                        disabled={isInactive}
                        className={cn(
                            "flex min-w-0 flex-1 items-center text-left outline-none",
                            DATE_PICKER_TRIGGER_SIZE_CLASSNAME[size],
                        )}
                    >
                        <span className={selectedDate ? "text-(--text-primary)" : "text-(--text-secondary)"}>
                            {selectedDate ? formatDate(selectedDate) : (formProps.placeholder ?? "Select date")}
                        </span>
                    </button>

                    <div className="flex shrink-0 gap-3 items-stretch">
                        {selectedDate && !isReadOnly ? (
                            <button
                                type="button"
                                disabled={isInactive}
                                aria-label="Clear date"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={clearDate}
                                className={FIELD_CLEAR_BUTTON_BASE_CLASSNAME}
                            >
                                <X size={14} />
                            </button>
                        ) : null}
                        <span
                            className="inline-flex shrink-0 items-center justify-center self-stretch text-(--text-secondary)"
                            aria-hidden
                        >
                            <CalendarIcon size={14} />
                        </span>
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-70 rounded-lg border border-(--border-default) bg-(--surface-default) p-3 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <button type="button" onClick={prevPeriod} className={DATE_PICKER_NAV_BTN_CLASSNAME}>
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleHeaderClick}
                                className="text-sm font-semibold text-(--text-primary) px-2 py-0.5 rounded-md hover:bg-(--color-primary)/10 transition-colors cursor-pointer"
                            >
                                {headerLabel()}
                            </button>
                            <button type="button" onClick={nextPeriod} className={DATE_PICKER_NAV_BTN_CLASSNAME}>
                                <ChevronRight size={14} />
                            </button>
                        </div>

                        {/* Days view */}
                        {view === "days" && (
                            <div className="grid grid-cols-7">
                                {DAY_LABELS.map((d) => (
                                    <div key={d} className="h-8 w-8 flex items-center justify-center text-xs font-medium text-(--text-secondary)">
                                        {d}
                                    </div>
                                ))}
                                {calendarDays.map((date, i) => {
                                    if (!date) return <div key={i} />;
                                    const isToday = isSameDay(date, today);
                                    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                                    const disabled = isDateDisabled(date);
                                    const isOutside = date.getMonth() !== month;

                                    const stateClass = disabled
                                        ? DATE_PICKER_DAY_STATE_CLASSNAME.disabled
                                        : isSelected
                                            ? DATE_PICKER_DAY_STATE_CLASSNAME.selected
                                            : isToday
                                                ? DATE_PICKER_DAY_STATE_CLASSNAME.today
                                                : isOutside
                                                    ? DATE_PICKER_DAY_STATE_CLASSNAME.outside
                                                    : DATE_PICKER_DAY_STATE_CLASSNAME.default;

                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => selectDay(date)}
                                            className={cn(
                                                "h-8 w-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer outline-none focus-visible:outline-none",
                                                stateClass,
                                            )}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Months view */}
                        {view === "months" && (
                            <div className="grid grid-cols-3 gap-1 mt-1">
                                {MONTHS.map((m, i) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => selectMonth(i)}
                                        className={cn(
                                            "h-9 rounded-md text-sm font-medium transition-colors cursor-pointer outline-none text-(--text-primary) hover:bg-(--color-primary)/10 focus-visible:outline-none",
                                            selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === i
                                                ? "bg-(--color-primary) text-(--text-invert) hover:bg-(--color-primary)/90"
                                                : today.getFullYear() === year && today.getMonth() === i
                                                    ? "text-(--color-primary) font-semibold"
                                                    : "",
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Years view */}
                        {view === "years" && (
                            <div className="grid grid-cols-4 gap-1 mt-1">
                                {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i).map((y) => (
                                    <button
                                        key={y}
                                        type="button"
                                        onClick={() => selectYear(y)}
                                        className={cn(
                                            "h-9 rounded-md text-sm font-medium transition-colors cursor-pointer outline-none text-(--text-primary) hover:bg-(--color-primary)/10 focus-visible:outline-none",
                                            selectedDate && selectedDate.getFullYear() === y
                                                ? "bg-(--color-primary) text-(--text-invert) hover:bg-(--color-primary)/90"
                                                : today.getFullYear() === y
                                                    ? "text-(--color-primary) font-semibold"
                                                    : "",
                                        )}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ErrorMessageCustom error={error} translateError={formProps.translateError} show={formProps.showErrorMessage ?? true} />
        </div>
    );
};

export default DatePickerCustom;
