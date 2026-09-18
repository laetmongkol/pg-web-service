import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";

const COUNT_UP_DURATION_MS = 1500;
const COUNT_UP_INTERSECTION_THRESHOLD = 0.4;
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

function easeOutCubic(progress: number) {
    return 1 - Math.pow(1 - progress, 3);
}

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches;
}

function useCountUpAnimation(target: number, enabled: boolean) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const startTime = performance.now();
        let frameId = 0;

        const animate = (now: number) => {
            const progress = Math.min((now - startTime) / COUNT_UP_DURATION_MS, 1);
            setValue(target * easeOutCubic(progress));

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [enabled, target]);

    return value;
}

function useInViewOnce(elementRef: RefObject<Element | null>, enabled: boolean) {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const element = elementRef.current;
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: COUNT_UP_INTERSECTION_THRESHOLD },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [enabled, elementRef]);

    return isInView;
}

const subscribeNoop = () => () => {};

export function useCountUpNumber(target: number, elementRef: RefObject<HTMLElement | null>) {
    // Reduced-motion is client-only; read via useSyncExternalStore (server snapshot false) to avoid a hydration mismatch and set-state-in-effect.
    const skipAnimation = useSyncExternalStore(subscribeNoop, prefersReducedMotion, () => false);

    const isInView = useInViewOnce(elementRef, !skipAnimation);
    const shouldAnimate = isInView && !skipAnimation;
    const animatedValue = useCountUpAnimation(target, shouldAnimate);

    return { shouldAnimate, animatedValue };
}
