"use client";
import { Star } from "lucide-react";

import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import {
    REVIEW_STARS_ACTIVE_COLOR_CLASSNAME,
    REVIEW_STARS_ICON_SIZE_CLASSNAME,
    REVIEW_STARS_TEXT_SIZE_CLASSNAME,
} from "@/shared/ui/classes/review-stars.classes";

interface ReviewStarsProps {
    score: number;
    reviewCount?: number;
    max?: number;
    display?: "default" | "full" | "star";
    size?: CustomSize;
    color?: CustomColor;
    className?: string;
}

const numberFormatter = new Intl.NumberFormat("en-US");

const toShortCount = (count: number): string => {
    if (count < 1000) return String(count);
    if (count < 1_000_000) return `${(count / 1000).toFixed(1).replace(".0", "")}k`;
    return `${(count / 1_000_000).toFixed(1).replace(".0", "")}m`;
};

const clampScore = (score: number, max: number): number => {
    return Math.max(0, Math.min(score, max));
};

const ReviewStars = ({
    score,
    reviewCount = 0,
    max = 5,
    display = "default",
    size = "md",
    color = "primary",
    className,
}: ReviewStarsProps) => {
    const safeScore = clampScore(score, max);
    const fullStars = Math.floor(safeScore);
    const iconSizeClassName = REVIEW_STARS_ICON_SIZE_CLASSNAME[size];
    const textSizeClassName = REVIEW_STARS_TEXT_SIZE_CLASSNAME[size];
    const activeColorClassName = REVIEW_STARS_ACTIVE_COLOR_CLASSNAME[color];

    const renderStars = (mode: "single" | "five") => {
        const total = mode === "single" ? 1 : max;

        return Array.from({ length: total }, (_, index) => {
            const isActive = mode === "single" ? true : index < fullStars;

            return (
                <Star
                    key={`star-${index}`}
                    className={cn(iconSizeClassName, isActive ? activeColorClassName : "text-(--text-secondary)")}
                    fill="currentColor"
                    aria-hidden="true"
                />
            );
        });
    };

    return (
        <div className={cn("inline-flex items-center gap-1.5 text-(--text-primary)", textSizeClassName, className)}>
            {display === "default" && (
                <>
                    {renderStars("single")}
                    <span className="font-semibold text-(--text-primary)">{safeScore.toFixed(1)}</span>
                    <span className="text-(--text-secondary)">({toShortCount(reviewCount)})</span>
                </>
            )}

            {display === "full" && (
                <>
                    <div className="inline-flex items-center gap-0.5">{renderStars("five")}</div>
                    <span className="font-semibold text-(--text-primary)">{safeScore.toFixed(1)}</span>
                    <span className="text-(--text-secondary)">
                        ({numberFormatter.format(reviewCount)} reviews)
                    </span>
                </>
            )}

            {display === "star" && (
                <div className="inline-flex items-center gap-0.5">{renderStars("five")}</div>
            )}
        </div>
    );
};

export default ReviewStars;