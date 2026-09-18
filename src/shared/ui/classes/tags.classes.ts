import cn from "@/lib/tw-merge";

export const TAGS_CONTAINER_CLASSNAME = cn(
    "relative flex flex-wrap items-center gap-2 rounded-lg border border-(--border-default) bg-(--surface-muted) p-3 pb-7",
);

export const TAGS_CHIP_CLASSNAME = cn(
    "inline-flex items-center gap-1 rounded-full bg-(--surface-page) px-2 py-1 text-sm text-(--text-primary) h-fit",
);

export const TAGS_INPUT_CLASSNAME = cn(
    "min-w-[120px] flex-1 self-center bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary)",
);

export const TAGS_CLEAR_BUTTON_CLASSNAME = cn(
    "shrink-0 text-sm font-medium text-(--color-danger-500) transition-colors hover:text-(--color-danger-500)/80 hover:underline disabled:cursor-not-allowed disabled:opacity-50",
);
