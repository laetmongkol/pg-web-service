import cn from "@/lib/tw-merge";

import { CustomSize } from "@/shared/types/custom-type.type";

import { BASE_FORM_FIELD_CLASSNAME } from "./base.classes";

export const TEXT_EDITOR_CONTAINER_CLASSNAME = cn(
    BASE_FORM_FIELD_CLASSNAME,
    "overflow-visible p-0",
);

export const TEXT_EDITOR_TOOLBAR_CLASSNAME = cn(
    "relative z-20 flex flex-wrap items-center gap-0.5 border-b border-(--border-default) bg-(--surface-muted) px-2 py-1.5",
);

export const TEXT_EDITOR_TOOLBAR_BUTTON_CLASSNAME = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-md p-1.5",
    "text-(--text-secondary) transition-colors",
    "hover:bg-(--surface-elevated) hover:text-(--text-primary)",
    "disabled:cursor-not-allowed disabled:opacity-40",
);

export const TEXT_EDITOR_TOOLBAR_BUTTON_ACTIVE_CLASSNAME = cn(
    "bg-(--surface-elevated) text-(--color-primary)",
);

export const TEXT_EDITOR_CONTENT_CLASSNAME = cn(
    "prose-editor cursor-text min-h-[var(--editor-min-height)] max-h-[var(--editor-max-height)] w-full overflow-y-auto bg-(--surface-muted) px-3 py-2 text-(--text-primary) focus:outline-none",
);

/** Wrapper + body classes for rendering saved editor HTML outside the editor (preview, article view). */
export const TEXT_EDITOR_RENDER_WRAPPER_CLASSNAME = cn("prose-editor text-(--text-primary)");

export const TEXT_EDITOR_RENDER_BODY_CLASSNAME = cn("tiptap wrap-break-word");

export const TEXT_EDITOR_SIZE_CLASSNAME: Record<CustomSize, string> = {
    xs: "text-xs [--editor-min-height:6rem] [--editor-max-height:14rem]",
    sm: "text-xs [--editor-min-height:7rem] [--editor-max-height:16rem]",
    md: "text-sm [--editor-min-height:8rem] [--editor-max-height:20rem]",
    lg: "text-base [--editor-min-height:9rem] [--editor-max-height:24rem]",
    xl: "text-base [--editor-min-height:10rem] [--editor-max-height:28rem]",
    "2xl": "text-lg [--editor-min-height:11rem] [--editor-max-height:32rem]",
    "3xl": "text-lg [--editor-min-height:12rem] [--editor-max-height:36rem]",
    "4xl": "text-xl [--editor-min-height:13rem] [--editor-max-height:40rem]",
    "5xl": "text-xl [--editor-min-height:14rem] [--editor-max-height:44rem]",
};
