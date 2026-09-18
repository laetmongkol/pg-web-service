import cn from "@/lib/tw-merge";

export const DIALOG_OVERLAY_CLASSNAME = cn(
    "fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
);

export const DIALOG_CONTENT_CLASSNAME = cn(
    "fixed left-1/2 top-1/2 z-[110] flex w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2",
    "max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-(--surface-default) shadow-2xl outline-none",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
);
