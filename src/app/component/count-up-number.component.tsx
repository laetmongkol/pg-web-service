"use client";

import { type ReactNode, useRef } from "react";

import {
    type CountUpNumberConfig,
    formatCountUpDisplayValue,
    formatCountUpTarget,
    getCountUpAnimationTarget,
    parseCountUpValue,
} from "@/lib/format/format-count-up-value";
import cn from "@/lib/tw-merge";
import { useCountUpNumber } from "@/providers/hooks/count-up.hook";

interface CountUpNumberProps extends Partial<CountUpNumberConfig> {
    className?: string;
    children?: ReactNode;
    value?: string;
}

const CountUpNumber = ({ className, children, value, ...config }: CountUpNumberProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const parsed = value ? parseCountUpValue(value) : null;
    const resolved: CountUpNumberConfig = {
        target: config.target ?? parsed?.target ?? 0,
        prefix: config.prefix ?? parsed?.prefix,
        suffix: config.suffix ?? parsed?.suffix,
        decimals: config.decimals ?? parsed?.decimals,
        formatThousands: config.formatThousands ?? parsed?.formatThousands,
        countThroughK: config.countThroughK ?? parsed?.countThroughK,
    };
    const animationTarget = getCountUpAnimationTarget(resolved);
    const { shouldAnimate, animatedValue } = useCountUpNumber(animationTarget, ref);
    const staticValue = children ?? value ?? formatCountUpTarget(resolved);

    return (
        <span ref={ref} className={cn(className)}>
            {shouldAnimate ? formatCountUpDisplayValue(animatedValue, resolved) : staticValue}
        </span>
    );
};

export default CountUpNumber;
