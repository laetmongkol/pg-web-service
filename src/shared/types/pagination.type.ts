/** Current pagination values the page passes in (usually from API / local state). */
export type PaginationValue = {
    /** 1-based page index */
    page: number;
    /** Page size */
    limit: number;
    /** Total matching items across all pages */
    total: number;
    /** Optional; if omitted, derived as `(page - 1) * limit` */
    offset?: number;
};

/**
 * Payload emitted by pagination controls so the parent can refresh API data.
 * Use with `onPaginationChange` — call your fetch with these values.
 */
export type PaginationChangeEvent = {
    page: number;
    limit: number;
    offset: number;
    total: number;
    pageCount: number;
};

export function buildPaginationChangeEvent(
    page: number,
    limit: number,
    total: number,
): PaginationChangeEvent {
    const safeLimit = Math.max(1, limit);
    const pageCount = Math.max(1, Math.ceil(Math.max(0, total) / safeLimit));
    const safePage = Math.min(Math.max(1, page), pageCount);
    return {
        page: safePage,
        limit: safeLimit,
        offset: (safePage - 1) * safeLimit,
        total: Math.max(0, total),
        pageCount,
    };
}

export function resolvePagination(pagination: PaginationValue) {
    const limit = Math.max(1, pagination.limit || 1);
    const total = Math.max(0, pagination.total);
    const pageCount = Math.max(1, Math.ceil(total / limit) || 1);
    const page = Math.min(Math.max(1, pagination.page || 1), pageCount);
    const offset = pagination.offset ?? (page - 1) * limit;
    return { page, limit, total, offset, pageCount };
}
