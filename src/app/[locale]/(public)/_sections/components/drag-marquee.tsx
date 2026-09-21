"use client";

import { useEffect, useRef, useState } from "react";

import cn from "@/lib/tw-merge";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

interface DragMarqueeProps {
    children: ReactNode;
    /**
     * Fixed width of one copy in px. Omit to let the content size itself — needed when the copy is
     * a row of logos whose widths are only known once they render.
     */
    copyWidth?: number;
    /**
     * Minimum number of times the children repeat inside each half. More copies are added on the
     * client when the frame turns out to be wider than one half — see `useCopiesPerHalf`.
     */
    copiesPerHalf?: number;
    /** Idle drift in px per second. */
    speed?: number;
    className?: string;
}

/** Velocity left over from a flick, decayed once per ~16ms frame. */
const FLING_DECAY = 0.92;
const FLING_MAX = 2500;
/** A flick older than this was really a hold, so don't coast on release. */
const FLING_STALE_MS = 80;

/**
 * Endless drag strip: the row drifts on its own, a drag takes it over and a flick coasts, and
 * either direction wraps forever instead of stopping at an edge. The track holds two identical
 * halves, so normalising the offset into one half's width loops with no seam.
 */
const DragMarquee = ({
    children,
    copyWidth,
    copiesPerHalf: minCopiesPerHalf = 1,
    speed = 18,
    className,
}: DragMarqueeProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    /**
     * The loop only holds up while one half is at least as wide as the frame: past that, wrapping
     * the offset would expose bare track on the trailing edge — which is what a 2K screen did to a
     * board built for 1720px. The count starts at the minimum for SSR and grows once the real
     * frame width is known.
     */
    const [copiesPerHalf, setCopiesPerHalf] = useState(minCopiesPerHalf);

    useEffect(() => {
        const frame = frameRef.current;
        const track = trackRef.current;
        if (!frame || !track) return;

        const fit = () => {
            const oneCopy = copyWidth ?? track.scrollWidth / (copiesPerHalf * 2);
            if (!oneCopy) return;

            const needed = Math.max(minCopiesPerHalf, Math.ceil(frame.clientWidth / oneCopy));
            setCopiesPerHalf((current) => (current === needed ? current : needed));
        };

        fit();

        const observer = new ResizeObserver(fit);
        observer.observe(frame);
        observer.observe(track);
        return () => observer.disconnect();
    }, [copiesPerHalf, copyWidth, minCopiesPerHalf]);

    /** Pixels scrolled, kept normalised into one half so the loop is seamless. */
    const offset = useRef(0);
    const halfWidth = useRef(0);
    const fling = useRef(0);
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const lastMoveAt = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // content can settle late (fonts, images), so re-measure whenever the track resizes
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
                if (!reduceMotion.matches) {
                    offset.current += (speed * delta) / 1000;
                }
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
    }, [speed]);

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        // let links and buttons inside the row keep their own clicks
        if ((event.target as HTMLElement).closest("a, button, input")) return;

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
        // dragging right reveals earlier content, so the offset moves the other way
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

    const copies = Array.from({ length: copiesPerHalf * 2 }, (_, index) => (
        <div
            key={index}
            aria-hidden={index > 0}
            className="shrink-0"
            style={copyWidth ? { width: `${copyWidth}px` } : undefined}
        >
            {children}
        </div>
    ));

    return (
        <div
            ref={frameRef}
            className={cn(
                "w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing",
                // the row runs past both edges, so they fade instead of being cut off mid-item
                "[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]",
                className,
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* two identical halves — normalising the offset into one half loops with no seam */}
            <div ref={trackRef} className="flex w-max will-change-transform">
                {copies}
            </div>
        </div>
    );
};

export default DragMarquee;
