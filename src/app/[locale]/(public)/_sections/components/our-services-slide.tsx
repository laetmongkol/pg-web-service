"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import FillImage from "@/components/fill-image.component";

import type { PointerEvent as ReactPointerEvent } from "react";

export type OurServiceSlideItem = {
    image: string;
    title: string;
    description: string;
};

interface OurServicesSlideProps {
    items: OurServiceSlideItem[];
}

/** How many cards peek out on each side of the active one. */
const MAX_PEEK = 3;
/** Hidden cards parked past the peek stack, where the ring wraps without being seen. */
const BUFFER = 2;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 550;
const SWIPE_THRESHOLD = 40;
const AUTOPLAY_MS = 3000;

/**
 * How far past the active card each layer sticks out is `shift + scale / 2 - 0.5` of the card
 * width — so raising `shift` alone is what widens the fan; `scale` only sets its size.
 */
const DEPTH_STYLE = [
    { shift: 0, scale: 1, opacity: 1 },
    { shift: 13, scale: 0.94, opacity: 0.6 },
    { shift: 25, scale: 0.88, opacity: 0.4 },
    { shift: 37, scale: 0.82, opacity: 0.22 },
];

const OurServicesSlide = ({ items }: OurServicesSlideProps) => {
    const [ringIndex, setRingIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const dragStartX = useRef<number | null>(null);

    // depends on ringIndex, so every manual nav restarts the countdown instead of
    // firing mid-transition
    useEffect(() => {
        if (items.length < 2 || isPaused) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const timer = window.setTimeout(() => setRingIndex((current) => current + 1), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [items.length, isPaused, ringIndex]);

    if (items.length === 0) return null;

    const total = items.length;
    const hasStack = total > 1;

    // Repeat the list until there are enough physical cards to fill every slot plus a
    // hidden buffer, so each card animates continuously instead of swapping its image.
    const repeats = hasStack ? Math.max(1, Math.ceil((2 * MAX_PEEK + BUFFER) / total)) : 1;
    const ringLength = total * repeats;
    const activeIndex = ((ringIndex % total) + total) % total;

    /** Shortest signed distance from the active card, so wrapping never jumps. */
    const offsetOf = (position: number) => {
        let offset = (position - ringIndex) % ringLength;
        if (offset > ringLength / 2) offset -= ringLength;
        if (offset < -ringLength / 2) offset += ringLength;
        return offset;
    };

    const go = (step: number) => setRingIndex((current) => current + step);

    const goToItem = (target: number) => {
        let step = (target - activeIndex + total) % total;
        if (step > total / 2) step -= total;
        go(step);
    };

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        // let the arrows and dots handle their own clicks
        if ((event.target as HTMLElement).closest("button")) return;
        dragStartX.current = event.clientX;
    };

    /** `endX` of null cancels the gesture (pointer left the slide or was interrupted). */
    const endDrag = (endX: number | null) => {
        const startX = dragStartX.current;
        dragStartX.current = null;
        if (startX === null || endX === null) return;
        const delta = endX - startX;
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        go(delta < 0 ? 1 : -1);
    };

    return (
        <div
            className="flex flex-col items-center gap-6"
            // only a real mouse hovers; a touch would otherwise stall autoplay until release
            onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setIsPaused(true);
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setIsPaused(false);
            }}
        >
            <div
                className="relative mx-auto grid w-full max-w-xl cursor-grab touch-pan-y select-none active:cursor-grabbing"
                onPointerDown={onPointerDown}
                onPointerUp={(event) => endDrag(event.clientX)}
                onPointerCancel={() => endDrag(null)}
                onPointerLeave={() => endDrag(null)}
            >
                {Array.from({ length: ringLength }, (_, position) => {
                    const item = items[position % total];
                    const offset = offsetOf(position);
                    const depth = Math.abs(offset);
                    const isActive = offset === 0;
                    const visible = depth <= MAX_PEEK;
                    // cards past the stack park at the outermost slot and just fade out
                    const slot = Math.min(depth, MAX_PEEK);
                    const style = DEPTH_STYLE[slot];

                    return (
                        <div
                            key={position}
                            aria-hidden={!isActive}
                            className="col-start-1 row-start-1 w-full overflow-hidden rounded-3xl bg-(--color-primary-400) shadow-lg will-change-transform motion-reduce:transition-none"
                            style={{
                                transform: `translateX(${Math.sign(offset) * style.shift}%) scale(${style.scale})`,
                                opacity: visible ? style.opacity : 0,
                                zIndex: 10 - slot,
                                pointerEvents: isActive ? "auto" : "none",
                                transition: `transform ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}`,
                            }}
                        >
                            <div className="relative">
                                <FillImage
                                    src={item.image}
                                    alt={isActive ? item.title : ""}
                                    width={800}
                                    height={480}
                                    draggable={false}
                                    className="aspect-[16/10] w-full object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-(--color-primary-400)/70 motion-reduce:transition-none"
                                    style={{
                                        opacity: isActive ? 0 : 1,
                                        transition: `opacity ${DURATION}ms ${EASE}`,
                                    }}
                                />
                            </div>
                            <div
                                className="flex flex-col gap-2 px-6 py-5 text-(--text-invert) motion-reduce:transition-none"
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    transition: `opacity ${DURATION}ms ${EASE}`,
                                }}
                            >
                                <p className="text-xl font-bold">{item.title}</p>
                                <p className="text-sm leading-snug text-(--text-invert)/80">{item.description}</p>
                            </div>
                        </div>
                    );
                })}

                {hasStack ? (
                    <>
                        <button
                            type="button"
                            aria-label="Previous"
                            className="absolute top-1/2 left-0 z-20 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--surface-elevated) text-(--text-primary) shadow-md transition-transform hover:scale-105 active:scale-95"
                            onClick={() => go(-1)}
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next"
                            className="absolute top-1/2 right-0 z-20 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--surface-elevated) text-(--text-primary) shadow-md transition-transform hover:scale-105 active:scale-95"
                            onClick={() => go(1)}
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </>
                ) : null}
            </div>

            {hasStack ? (
                <div className="flex items-center gap-2">
                    {items.map((item, position) => {
                        const isActive = position === activeIndex;
                        return (
                            <button
                                key={item.title}
                                type="button"
                                aria-label={item.title}
                                aria-current={isActive}
                                className="h-2 rounded-full bg-(--color-secondary) transition-all duration-300 motion-reduce:transition-none"
                                style={{ width: isActive ? 24 : 8, opacity: isActive ? 1 : 0.3 }}
                                onClick={() => goToItem(position)}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default OurServicesSlide;
