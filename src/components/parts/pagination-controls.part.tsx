"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import cn from "@/lib/tw-merge";

import ButtonCustom from "@/components/button-custom.component";

import {
    buildPaginationChangeEvent,
    PaginationChangeEvent,
    PaginationValue,
    resolvePagination,
} from "@/shared/types/pagination.type";
import {
    TABLE_PAGINATION_BAR_CLASSNAME,
    TABLE_PAGINATION_CONTROLS_CLASSNAME,
    TABLE_PAGINATION_META_CLASSNAME,
} from "@/shared/ui/classes/table.classes";

export type PaginationControlsProps = {
    pagination: PaginationValue;
    onPaginationChange: (event: PaginationChangeEvent) => void;
    /** Items currently visible on this page (for “Showing X–Y of Z”). */
    itemCount?: number;
    limitOptions?: number[];
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
    /**
     * Max page buttons shown from the `lg` breakpoint up (desktop). Also caps the `md`–`lg`
     * tier (which otherwise defaults to 5), so a smaller value keeps a compact container
     * (e.g. a modal gallery) from showing more buttons on a wider viewport than a narrower one.
     * Floored at 3 — `buildPageItems` needs at least 2 boundary pages + 1 sibling to render sensibly.
     */
    maxPageButtons?: number;
};

const ELLIPSIS = "ellipsis" as const;

type PageItem = number | typeof ELLIPSIS;

function buildPageItems(page: number, pageCount: number, maxButtons: number): PageItem[] {
    if (pageCount <= maxButtons) {
        return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    const innerCount = maxButtons - 2;
    const half = Math.floor(innerCount / 2);
    let start = Math.max(2, page - half);
    let end = start + innerCount - 1;

    if (end >= pageCount) {
        end = pageCount - 1;
        start = end - innerCount + 1;
    }

    const items: PageItem[] = [1];
    if (start > 2) items.push(ELLIPSIS);
    for (let current = start; current <= end; current += 1) items.push(current);
    if (end < pageCount - 1) items.push(ELLIPSIS);
    items.push(pageCount);

    return items;
}

function buildSlidingWindow(page: number, pageCount: number, size: number): number[] {
    if (pageCount <= size) {
        return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    const half = Math.floor(size / 2);
    let start = Math.max(1, page - half);
    let end = start + size - 1;

    if (end > pageCount) {
        end = pageCount;
        start = end - size + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const PaginationControls = ({
    pagination,
    onPaginationChange,
    itemCount,
    limitOptions,
    disabled = false,
    isLoading = false,
    className,
    maxPageButtons = 7,
}: PaginationControlsProps) => {
    const { page, limit, total, offset, pageCount } = resolvePagination(pagination);
    const visibleCount = itemCount ?? Math.min(limit, Math.max(0, total - offset));
    const from = total === 0 ? 0 : offset + 1;
    const to = total === 0 ? 0 : Math.min(offset + visibleCount, total);

    const emit = (nextPage: number, nextLimit: number = limit) => {
        onPaginationChange(buildPaginationChangeEvent(nextPage, nextLimit, total));
    };

    const canPrev = page > 1 && !disabled && !isLoading;
    const canNext = page < pageCount && !disabled && !isLoading;
    const safeMaxPageButtons = Math.max(3, maxPageButtons);
    const smallPageItems = buildSlidingWindow(page, pageCount, 3);
    const mediumPageItems = buildPageItems(page, pageCount, Math.min(5, safeMaxPageButtons));
    const largePageItems = buildPageItems(page, pageCount, safeMaxPageButtons);

    const renderPageItem = (item: PageItem, index: number, buttonClassName: string) =>
        item === ELLIPSIS ? (
            <span
                key={`ellipsis-${index}`}
                className="px-1 text-sm text-(--text-secondary)"
                aria-hidden="true"
            >
                …
            </span>
        ) : (
            <ButtonCustom
                key={item}
                color={item === page ? "primary" : "secondary"}
                variant={item === page ? "solid" : "soft"}
                size="sm"
                className={buttonClassName}
                disabled={disabled || isLoading}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => emit(item)}
            >
                {item}
            </ButtonCustom>
        );

    return (
        <div className={cn(TABLE_PAGINATION_BAR_CLASSNAME, className)}>
            <div className={cn(TABLE_PAGINATION_CONTROLS_CLASSNAME, "gap-1 sm:gap-2")}>
                {limitOptions && limitOptions.length > 0 ? (
                    <label className="flex items-center gap-2 text-sm text-(--text-secondary)">
                        <span>Rows</span>
                        <select
                            className="rounded-md border border-(--border-default) bg-(--surface-default) px-2 py-1.5 text-sm text-(--text-primary) outline-none"
                            value={limit}
                            disabled={disabled || isLoading}
                            onChange={(event) => {
                                const nextLimit = Number(event.target.value);
                                emit(1, nextLimit);
                            }}
                        >
                            {limitOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : null}

                <p className={TABLE_PAGINATION_META_CLASSNAME}>
                    {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
                </p>
            </div>

            <div className="flex w-full items-center justify-center gap-1 sm:w-auto sm:justify-start sm:gap-2">
                <ButtonCustom
                    color="secondary"
                    variant="soft"
                    size="sm"
                    className="px-1.5 md:hidden"
                    disabled={!canPrev}
                    aria-label="First page"
                    onClick={() => emit(1)}
                >
                    <ChevronsLeft size={16} />
                </ButtonCustom>

                <ButtonCustom
                    color="secondary"
                    variant="soft"
                    size="sm"
                    className="px-1.5 md:px-2"
                    disabled={!canPrev}
                    aria-label="Previous page"
                    onClick={() => emit(page - 1)}
                >
                    <ChevronLeft size={16} />
                </ButtonCustom>

                <div className="flex items-center gap-0.5 md:hidden">
                    {smallPageItems.map((item, index) => renderPageItem(item, index, "min-w-7 px-1.5"))}
                </div>
                <div className="hidden items-center gap-1 md:flex lg:hidden">
                    {mediumPageItems.map((item, index) => renderPageItem(item, index, "min-w-8 px-2"))}
                </div>
                <div className="hidden items-center gap-1 lg:flex">
                    {largePageItems.map((item, index) => renderPageItem(item, index, "min-w-8 px-2"))}
                </div>

                <ButtonCustom
                    color="secondary"
                    variant="soft"
                    size="sm"
                    className="px-1.5 md:px-2"
                    disabled={!canNext}
                    aria-label="Next page"
                    onClick={() => emit(page + 1)}
                >
                    <ChevronRight size={16} />
                </ButtonCustom>

                <ButtonCustom
                    color="secondary"
                    variant="soft"
                    size="sm"
                    className="px-1.5 md:hidden"
                    disabled={!canNext}
                    aria-label="Last page"
                    onClick={() => emit(pageCount)}
                >
                    <ChevronsRight size={16} />
                </ButtonCustom>
            </div>
        </div>
    );
};

export default PaginationControls;
