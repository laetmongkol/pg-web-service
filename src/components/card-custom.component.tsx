import { ReactNode } from "react";

import cn from "@/lib/tw-merge";

import CardCustomCollapse from "@/components/parts/card-custom-collapse.part";

import {
    CARD_SIZE_CLASSNAME,
    CARD_VARIANT_CLASSNAME,
    CardSize,
    CardVariant
} from "@/shared/ui/classes/card.classes";

interface CardCustomProps {
    size?: CardSize;
    variant?: CardVariant;
    direction?: "column" | "row";
    gap?: number;
    className?: string;
    children: ReactNode;
    canCollapse?: boolean;
    isCollapse?: boolean;
    title?: ReactNode;
}

const CardCustom = ({
    size = "3",
    variant = "surface",
    direction = "column",
    gap = 4,
    className,
    children,
    canCollapse = false,
    isCollapse = false,
    title,
}: CardCustomProps) => {
    const layoutClassName = direction === "column"
        ? `flex flex-col gap-${gap - 1} lg:gap-${gap}`
        : `flex flex-row gap-${gap - 1} lg:gap-${gap}`;

    const cardClassName = cn(
        CARD_SIZE_CLASSNAME[size],
        CARD_VARIANT_CLASSNAME[variant],
        canCollapse ? "flex flex-col" : layoutClassName,
        className,
    );

    if (!canCollapse) {
        return (
            <div className={cardClassName}>
                {children}
            </div>
        );
    }

    return (
        <CardCustomCollapse
            className={cardClassName}
            defaultCollapsed={isCollapse}
            title={title}
            bodyClassName={cn("pt-3", layoutClassName)}
        >
            {children}
        </CardCustomCollapse>
    );
};

export default CardCustom;
