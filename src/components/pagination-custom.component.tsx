"use client";

import { ReactNode } from "react";

import cn from "@/lib/tw-merge";

import PaginationControls from "@/components/parts/pagination-controls.part";

import {
    PaginationChangeEvent,
    PaginationValue,
} from "@/shared/types/pagination.type";

export type { PaginationChangeEvent, PaginationValue };

export type PaginationCustomProps = {
    pagination: PaginationValue;
    /** Fired after a pagination action (page / limit change). Refresh API here. */
    onPaginationChange: (event: PaginationChangeEvent) => void;
    /** Custom content (cards, grids, lists, etc.). */
    children: ReactNode;
    /**
     * How many items are currently rendered in `children`.
     * Used for “Showing X–Y of Z”. Defaults to an estimate from limit/offset.
     */
    itemCount?: number;
    limitOptions?: number[];
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
    contentClassName?: string;
    paginationClassName?: string;
    maxPageButtons?: number;
};

/**
 * Pagination shell for non-table layouts.
 * Parent owns the data fetch — call API inside `onPaginationChange`.
 */
const PaginationCustom = ({
    pagination,
    onPaginationChange,
    children,
    itemCount,
    limitOptions,
    disabled = false,
    isLoading = false,
    className,
    contentClassName,
    paginationClassName,
    maxPageButtons,
}: PaginationCustomProps) => {
    return (
        <div className={cn("flex w-full flex-col gap-4", className)}>
            <div className={cn("min-w-0", contentClassName)}>{children}</div>

            <PaginationControls
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                itemCount={itemCount}
                limitOptions={limitOptions}
                disabled={disabled}
                isLoading={isLoading}
                maxPageButtons={maxPageButtons}
                className={cn(
                    "rounded-xl border border-(--border-muted) bg-(--surface-default)",
                    paginationClassName,
                )}
            />
        </div>
    );
};

export default PaginationCustom;
