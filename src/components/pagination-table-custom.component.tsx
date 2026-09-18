"use client";

import cn from "@/lib/tw-merge";

import PaginationControls from "@/components/parts/pagination-controls.part";
import TableCustom, {
    TableCustomHeader,
    TableCustomProps,
    TableCustomRow,
} from "@/components/table-custom.component";

import type { SortBy } from "@/shared/types/sort.type";

import {
    buildPaginationChangeEvent,
    PaginationChangeEvent,
    PaginationValue,
} from "@/shared/types/pagination.type";

export type { PaginationChangeEvent, PaginationValue, SortBy };
/** @deprecated Prefer `PaginationValue` */
export type PaginationTableValue = PaginationValue;
/** @deprecated Prefer `SortBy` */
export type TableSortState = SortBy;

export { buildPaginationChangeEvent };

export type PaginationTableCustomProps = Omit<TableCustomProps, "className"> & {
    headers: TableCustomHeader[];
    data: TableCustomRow[];
    pagination: PaginationValue;
    /** Fired after a pagination action (page / limit change). Refresh API here. */
    onPaginationChange: (event: PaginationChangeEvent) => void;
    /** Optional page-size choices; omit to hide the limit selector. */
    limitOptions?: number[];
    disabled?: boolean;
    className?: string;
    paginationClassName?: string;
};

const PaginationTableCustom = ({
    headers,
    data,
    pagination,
    onPaginationChange,
    limitOptions,
    disabled = false,
    className,
    paginationClassName,
    isLoading,
    sortBy,
    onSortChange,
    ...tableProps
}: PaginationTableCustomProps) => {
    return (
        <div className={cn("overflow-hidden rounded-xl border border-(--border-muted)", className)}>
            <TableCustom
                {...tableProps}
                headers={headers}
                data={data}
                isLoading={isLoading}
                sortBy={sortBy}
                onSortChange={onSortChange}
                className="rounded-none border-0"
            />

            <PaginationControls
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                itemCount={data.length}
                limitOptions={limitOptions}
                disabled={disabled}
                isLoading={isLoading}
                className={paginationClassName}
            />
        </div>
    );
};

export default PaginationTableCustom;
