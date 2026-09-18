import cn from "@/lib/tw-merge";

import { CustomColor, CustomSize } from "@/shared/types/custom-type.type";
import {
    PROGRESS_BAR_FILL_COLOR_CLASSNAME,
    PROGRESS_BAR_TRACK_SIZE_CLASSNAME,
} from "@/shared/ui/classes/progress-bar.classes";

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: Extract<CustomSize, "xs" | "sm" | "md" | "lg" | "xl">;
    color?: CustomColor;
    showValue?: boolean;
    className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ProgressBar = ({
    value,
    max = 100,
    size = "md",
    color = "primary",
    showValue = false,
    className,
}: ProgressBarProps) => {
    const safeMax = max <= 0 ? 100 : max;
    const safeValue = clamp(value, 0, safeMax);
    const progress = (safeValue / safeMax) * 100;

    return (
        <div className={cn("flex w-full items-center gap-2", className)}>
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={safeMax}
                aria-valuenow={safeValue}
                className={cn(
                    "w-full overflow-hidden rounded-full bg-(--surface-default)",
                    PROGRESS_BAR_TRACK_SIZE_CLASSNAME[size],
                )}
            >
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-300 ease-out",
                        PROGRESS_BAR_FILL_COLOR_CLASSNAME[color],
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
            {showValue && (
                <span className="min-w-11 text-right text-xs font-medium text-(--text-secondary)">
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
};

export default ProgressBar;