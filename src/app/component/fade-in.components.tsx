"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import cn from "@/lib/tw-merge";

const DEFAULT_INTERSECTION_THRESHOLD = 0.3;

type FadeDirection = "up" | "down" | "left" | "right";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    id?: string;
    delay?: number;
    distance?: number;
    duration?: number;
    threshold?: number;
    direction?: FadeDirection;
}

const FadeIn = ({
    children,
    className,
    id,
    delay = 0,
    distance = 24,
    duration = 600,
    threshold = DEFAULT_INTERSECTION_THRESHOLD,
    direction = "up",
}: FadeInProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Init false to match SSR; IntersectionObserver adds is-visible on the client. Reduced-motion is handled purely in CSS (custom-animations.css).
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = containerRef.current;
        if (!element || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [isVisible, threshold]);

    return (
        <div
            ref={containerRef}
            id={id}
            className={cn(`animate-fade-${direction}`, isVisible && "is-visible", className)}
            style={{
                "--fade-up-delay": `${delay + 50}ms`,
                "--fade-up-distance": `${distance}px`,
                "--fade-up-duration": `${duration}ms`,
            } as CSSProperties}
        >
            {children}
        </div>
    );
};

export default FadeIn;
