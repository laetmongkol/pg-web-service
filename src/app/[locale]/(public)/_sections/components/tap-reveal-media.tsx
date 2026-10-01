"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";

import cn from "@/lib/tw-merge";

interface TapRevealMediaProps {
    children: ReactNode;
    className?: string;
    label?: string;
}

/**
 * Touch screens have no hover, so below `lg` a tap toggles `data-active` instead —
 * children style the revealed state with `group-data-[active=true]/media:*`.
 * Tapping anywhere outside closes it again.
 */
const TapRevealMedia = ({ children, className, label }: TapRevealMediaProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        const close = (event: PointerEvent) => {
            if (!ref.current?.contains(event.target as Node)) setIsActive(false);
        };

        document.addEventListener("pointerdown", close);

        return () => document.removeEventListener("pointerdown", close);
    }, [isActive]);

    const toggle = () => setIsActive((value) => !value);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle();
    };

    return (
        <div
            ref={ref}
            role="button"
            tabIndex={0}
            aria-label={label}
            aria-expanded={isActive}
            data-active={isActive}
            onClick={toggle}
            onKeyDown={onKeyDown}
            className={cn(
                "group/media cursor-pointer outline-none lg:cursor-default",
                "focus-visible:ring-2 focus-visible:ring-(--color-primary-400) focus-visible:ring-offset-2",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default TapRevealMedia;
