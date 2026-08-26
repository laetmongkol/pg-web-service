"use client";

import { Fragment, type ReactNode } from "react";

import cn from "@/lib/tw-merge";

const GAP_CLASSNAME: Record<number, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
};

interface BunchButtonsProps {
    buttons: ReactNode[];
    className?: string;
    gap?: number;
}

const BunchButtons = ({
    buttons,
    className,
    gap = 2,
}: BunchButtonsProps) => {
    const items = buttons.filter((item) => item != null && item !== false && item !== true);

    return (
        <div className={cn("flex flex-wrap", GAP_CLASSNAME[gap] ?? "gap-2", className)}>
            {items.map((item, i) => (
                <Fragment key={i}>{item}</Fragment>
            ))}
        </div>
    );
};

export default BunchButtons;
