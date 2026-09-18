import { createElement, Fragment, type ReactNode } from "react";

import cn from "@/lib/tw-merge";

export const splitByLineBreak = (text?: string, className?: string) => {
    return createElement(
        "span",
        { className: cn("block whitespace-pre-line leading-tight", className) },
        text?.replace(/\\n/g, "\n"),
    );
};

/** Zero-width space — the segment separator inside a CMS string. */
const WORD_BREAK = "​";

/**
 * Thai has no spaces, so the browser may break a phrase anywhere. CMS copy marks the only
 * acceptable break points with a zero-width space; each segment between them is rendered
 * `whitespace-nowrap`, and a real space still separates clauses.
 */
export const renderNowrapText = (text?: string): ReactNode[] => {
    if (!text) return [];

    return text.split(" ").flatMap((clause, clauseIndex) => {
        const segments = clause.split(WORD_BREAK).flatMap((word, wordIndex) => {
            const held = createElement("span", { key: `w-${wordIndex}`, className: "whitespace-nowrap" }, word);
            return wordIndex === 0 ? [held] : [WORD_BREAK, held];
        });

        const clauseNode = createElement(Fragment, { key: `c-${clauseIndex}` }, ...segments);
        return clauseIndex === 0 ? [clauseNode] : [" ", clauseNode];
    });
};
