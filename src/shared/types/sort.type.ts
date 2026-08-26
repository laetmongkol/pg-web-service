/**
 * Shared table sort payload. Always an array — even a single column is `[{ field, direction }]`.
 * Wire format for APIs: `sortBy=updatedDate:desc&sortBy=pageCode:asc`
 */
export type SortDirection = "asc" | "desc";

export type SortByItem = {
    field: string;
    direction: SortDirection;
};

export type SortBy = SortByItem[];

export function cycleSortBy(current: SortBy, field: string): SortBy {
    const primary = current[0];
    if (!primary || primary.field !== field) {
        return [{ field, direction: "asc" }];
    }
    if (primary.direction === "asc") {
        return [{ field, direction: "desc" }];
    }
    return [];
}

/** Serialize for query string (`field:asc`). */
export function serializeSortBy(sortBy: SortBy): string[] {
    return sortBy.map((item) => `${item.field}:${item.direction}`);
}

export function findSortItem(sortBy: SortBy, field: string): SortByItem | undefined {
    return sortBy.find((item) => item.field === field);
}
