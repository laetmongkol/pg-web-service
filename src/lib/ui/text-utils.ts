import { createElement } from "react";

import cn from "@/lib/tw-merge";

export const splitByLineBreak = (text?: string, className?: string) => {
    return createElement(
        "span",
        { className: cn("block whitespace-pre-line leading-tight", className) },
        text?.replace(/\\n/g, "\n"),
    );
};
