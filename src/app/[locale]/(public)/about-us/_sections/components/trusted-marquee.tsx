"use client";

import { useEffect, useRef } from "react";

import cn from "@/lib/tw-merge";

import type { PointerEvent as ReactPointerEvent } from "react";

interface TrustedMarqueeProps {
    items: string[];
    /** Idle drift speed in px per second. */
    speed?: number;
}

/**
 * Copies of the list per half of the track. A handful of names only spans ~900px, so a single
 * copy would leave a visible hole on a wide screen.
 */
const COPIES_PER_HALF = 3;

/** Velocity left over from a flick, decayed once per ~16ms frame. */
const FLING_DECAY = 0.92;
const FLING_MAX = 2500;
/** A flick older than this was really a hold, so don't coast on release. */
const FLING_STALE_MS = 80;

const TrustedMarquee = ({ items, speed = 40 }: TrustedMarqueeProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    /** Pixels scrolled, kept normalised into one half-track so the loop is seamless. */
    const offset = useRef(0);
    const halfWidth = useRef(0);
    const fling = useRef(0);
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const lastMoveAt = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || items.length === 0) return;

        // widths depend on the loaded font, so re-measure whenever the track resizes
        const measure = () => {
            halfWidth.current = track.scrollWidth / 2;
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(track);

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0;
        let previous = performance.now();

        const tick = (now: number) => {
            // cap the step so a backgrounded tab doesn't jump the track on return
            const delta = Math.min(now - previous, 50);
            previous = now;

            if (!isDragging.current) {
                if (!reduceMotion.matches) offset.current += (speed * delta) / 1000;
                if (fling.current !== 0) {
                    offset.current += (fling.current * delta) / 1000;
                    fling.current *= FLING_DECAY ** (delta / 16);
                    if (Math.abs(fling.current) < 1) fling.current = 0;
                }
            }

            const half = halfWidth.current;
            if (half > 0) {
                offset.current = ((offset.current % half) + half) % half;
                track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
            }

            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [items.length, speed]);

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        isDragging.current = true;
        fling.current = 0;
        lastX.current = event.clientX;
        lastMoveAt.current = performance.now();
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        const now = performance.now();
        const dx = event.clientX - lastX.current;
        const dt = Math.max(now - lastMoveAt.current, 1);
        lastX.current = event.clientX;
        lastMoveAt.current = now;
        // dragging right reveals earlier names, so the offset moves the other way
        offset.current -= dx;
        fling.current = Math.max(-FLING_MAX, Math.min(FLING_MAX, (-dx / dt) * 1000));
    };

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (performance.now() - lastMoveAt.current > FLING_STALE_MS) fling.current = 0;
    };

    if (items.length === 0) return null;

    return (
        <div
            className={cn(
                "relative w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing",
                // the names fade out into the page instead of being cut mid-letter
                "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            <div ref={trackRef} className="flex w-max items-center will-change-transform">
                {/* two identical halves — normalising the offset into one half loops with no seam */}
                {Array.from({ length: COPIES_PER_HALF * 2 }, (_, copy) =>
                    items.map((name, position) => (
                        <span
                            key={`${copy}-${position}`}
                            aria-hidden={copy > 0}
                            className={cn(
                                "shrink-0 whitespace-nowrap",
                                "px-8 sm:px-12",
                                "text-xl sm:text-2xl font-bold text-(--text-secondary)/60",
                            )}
                        >
                            {name}
                        </span>
                    )),
                )}
            </div>
        </div>
    );
};

export default TrustedMarquee;
