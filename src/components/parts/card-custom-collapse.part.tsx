"use client";

import { ReactNode, useState } from "react";

import { ChevronDown } from "lucide-react";
import { Collapse } from "@material-tailwind/react";

import cn from "@/lib/tw-merge";

interface CardCustomCollapseProps {
    className?: string;
    defaultCollapsed: boolean;
    title?: ReactNode;
    bodyClassName?: string;
    children: ReactNode;
}

const CardCustomCollapse = ({
    className,
    defaultCollapsed,
    title,
    bodyClassName,
    children,
}: CardCustomCollapseProps) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const bodyId = "card-custom-collapse-body";

    return (
        <div className={className}>
            <button
                type="button"
                className={cn(
                    "flex w-full items-center gap-2 text-left",
                    title ? "justify-between" : "justify-end",
                )}
                aria-expanded={!collapsed}
                aria-controls={bodyId}
                onClick={() => setCollapsed((prev) => !prev)}
            >
                {title && (
                    <span className="text-sm font-medium text-(--text-primary) sm:text-base">
                        {title}
                    </span>
                )}
                <ChevronDown
                    className={cn(
                        "size-4 shrink-0 text-(--text-secondary) transition-transform duration-200",
                        collapsed && "-rotate-90",
                    )}
                    aria-hidden
                />
            </button>

            <Collapse open={!collapsed}>
                <div id={bodyId} className={bodyClassName}>
                    {children}
                </div>
            </Collapse>
        </div>
    );
};

export default CardCustomCollapse;
