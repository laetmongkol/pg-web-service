"use client";

import { ReactNode } from "react";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import cn from "@/lib/tw-merge";

import {
    cycleSortBy,
    findSortItem,
    SortBy,
} from "@/shared/types/sort.type";
import {
    TABLE_BODY_CELL_CLASSNAME,
    TABLE_BODY_ROW_CLASSNAME,
    TABLE_CLASSNAME,
    TABLE_HEAD_CELL_CLASSNAME,
    TABLE_HEAD_ROW_CLASSNAME,
    TABLE_STATE_CELL_CLASSNAME,
    TABLE_WRAPPER_CLASSNAME,
} from "@/shared/ui/classes/table.classes";

export type TableAlign = "left" | "center" | "right";

/** @deprecated Prefer `SortBy` from `@/shared/types/sort.type` */
export type TableSortDirection = "asc" | "desc";
/** @deprecated Prefer `SortBy` from `@/shared/types/sort.type` */
export type TableSortState = SortBy;

export type TableCustomHeader = {
    /** Matches a property on each data row. */
    key: string;
    label: ReactNode;
    className?: string;
    headerClassName?: string;
    /** Header cell alignment. Default: `center`. */
    headerAlign?: TableAlign;
    /** Body cell alignment. Default: `left`. */
    dataAlign?: TableAlign;
    /** Shrink column width to fit cell content. */
    fitContent?: boolean;
    /** When true, header is clickable for sorting (requires `sortBy` + `onSortChange`). */
    sortable?: boolean;
};

/**
 * Each row must include `key` (React list id).
 * Other keys should match `headers[].key` and hold the cell content to render.
 */
export type TableCustomRow = {
    key: string;
} & Record<string, ReactNode>;

export type TableCustomProps = {
    headers: TableCustomHeader[];
    data: TableCustomRow[];
    isLoading?: boolean;
    isError?: boolean;
    emptyTitle?: ReactNode;
    emptyDescription?: ReactNode;
    errorMessage?: ReactNode;
    loadingMessage?: ReactNode;
    /** When set, `isLoading` renders this many shimmer rows instead of `loadingMessage`. */
    skeletonRows?: number;
    className?: string;
    tableClassName?: string;
    minWidthClassName?: string;
    /**
     * Controlled sort as array (sent to APIs as `sortBy`).
     * Parent fetches sorted data — this component only renders headers.
     */
    sortBy?: SortBy;
    onSortChange?: (next: SortBy) => void;
};

const EMPTY_CELL = "—";
const DEFAULT_HEADER_ALIGN: TableAlign = "center";
const DEFAULT_DATA_ALIGN: TableAlign = "left";

const ALIGN_CLASSNAME: Record<TableAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

const TableCustom = ({
    headers,
    data,
    isLoading = false,
    isError = false,
    emptyTitle = "No data",
    emptyDescription,
    errorMessage = "Failed to load data. Please try again.",
    loadingMessage = "Loading…",
    skeletonRows,
    className,
    tableClassName,
    minWidthClassName = "min-w-[640px]",
    sortBy = [],
    onSortChange,
}: TableCustomProps) => {
    const colSpan = Math.max(headers.length, 1);
    const showRows = !isLoading && !isError && data.length > 0;
    const showEmpty = !isLoading && !isError && data.length === 0;

    const fitContentClassName = (header: TableCustomHeader) =>
        header.fitContent ? "w-0 whitespace-nowrap" : null;

    return (
        <div className={cn(TABLE_WRAPPER_CLASSNAME, className)}>
            <table className={cn(TABLE_CLASSNAME, minWidthClassName, tableClassName)}>
                <thead>
                    <tr className={TABLE_HEAD_ROW_CLASSNAME}>
                        {headers.map((header) => {
                            const canSort = Boolean(header.sortable && onSortChange);
                            const active = findSortItem(sortBy, header.key);
                            const SortIcon = !active
                                ? ArrowUpDown
                                : active.direction === "asc"
                                  ? ArrowUp
                                  : ArrowDown;

                            return (
                                <th
                                    key={header.key}
                                    className={cn(
                                        TABLE_HEAD_CELL_CLASSNAME,
                                        ALIGN_CLASSNAME[header.headerAlign ?? DEFAULT_HEADER_ALIGN],
                                        fitContentClassName(header),
                                        header.headerClassName,
                                    )}
                                    aria-sort={
                                        canSort && active
                                            ? active.direction === "asc"
                                                ? "ascending"
                                                : "descending"
                                            : canSort
                                              ? "none"
                                              : undefined
                                    }
                                >
                                    {canSort ? (
                                        <button
                                            type="button"
                                            className={cn(
                                                "inline-flex items-center gap-1 rounded-md px-1 py-0.5",
                                                "hover:bg-(--surface-muted) focus-visible:outline-none",
                                                "focus-visible:ring-2 focus-visible:ring-(--color-primary)/40",
                                                active && "text-(--color-primary)",
                                            )}
                                            onClick={() => onSortChange?.(cycleSortBy(sortBy, header.key))}
                                        >
                                            <span>{header.label}</span>
                                            <SortIcon size={14} className="shrink-0 opacity-70" aria-hidden />
                                        </button>
                                    ) : (
                                        header.label
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {isLoading && skeletonRows
                        ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                              <tr key={`skeleton:${rowIndex}`} className={TABLE_BODY_ROW_CLASSNAME}>
                                  {headers.map((header) => (
                                      <td
                                          key={`skeleton:${rowIndex}:${header.key}`}
                                          className={cn(
                                              TABLE_BODY_CELL_CLASSNAME,
                                              ALIGN_CLASSNAME[header.dataAlign ?? DEFAULT_DATA_ALIGN],
                                              fitContentClassName(header),
                                          )}
                                      >
                                          <span className="inline-block h-4 w-full max-w-[220px] animate-pulse rounded bg-(--surface-muted)" />
                                      </td>
                                  ))}
                              </tr>
                          ))
                        : null}

                    {isLoading && !skeletonRows ? (
                        <tr>
                            <td
                                colSpan={colSpan}
                                className={cn(TABLE_STATE_CELL_CLASSNAME, "text-(--text-secondary)")}
                            >
                                {loadingMessage}
                            </td>
                        </tr>
                    ) : null}

                    {isError ? (
                        <tr>
                            <td
                                colSpan={colSpan}
                                className={cn(TABLE_STATE_CELL_CLASSNAME, "text-(--color-danger-700)")}
                            >
                                {errorMessage}
                            </td>
                        </tr>
                    ) : null}

                    {showEmpty ? (
                        <tr>
                            <td colSpan={colSpan} className={TABLE_STATE_CELL_CLASSNAME}>
                                <p className="font-medium text-(--text-primary)">{emptyTitle}</p>
                                {emptyDescription ? (
                                    <p className="mt-1 text-(--text-secondary)">{emptyDescription}</p>
                                ) : null}
                            </td>
                        </tr>
                    ) : null}

                    {showRows
                        ? data.map((row) => (
                              <tr key={row.key} className={TABLE_BODY_ROW_CLASSNAME}>
                                  {headers.map((header) => {
                                      const cell = row[header.key];
                                      return (
                                          <td
                                              key={`${row.key}:${header.key}`}
                                              className={cn(
                                                  TABLE_BODY_CELL_CLASSNAME,
                                                  ALIGN_CLASSNAME[header.dataAlign ?? DEFAULT_DATA_ALIGN],
                                                  fitContentClassName(header),
                                                  header.className,
                                              )}
                                          >
                                              {cell === undefined || cell === null || cell === ""
                                                  ? EMPTY_CELL
                                                  : cell}
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
        </div>
    );
};

export default TableCustom;
