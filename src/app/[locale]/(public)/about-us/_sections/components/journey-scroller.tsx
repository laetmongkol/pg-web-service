"use client";

import { useEffect, useRef, useState } from "react";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

export type JourneyItem = {
    year: string;
    title: string;
    description: string;
};

interface JourneyScrollerProps {
    items: JourneyItem[];
    /** Section heading — pinned alongside the track on desktop, so it stays readable while scrolling. */
    header: ReactNode;
    /** Sits under the track, inside the pinned viewport — the timeline alone leaves it half empty. */
    footer?: ReactNode;
}

const JourneyCard = ({ item, className }: { item: JourneyItem; className?: string }) => (
    <div className={cn("flex shrink-0 flex-col gap-4", className)}>
        {/* the dashed rule is per-card, so the cards line up into one continuous track */}
        <div className="relative h-6 w-full">
            <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-(--border-default)" />
            <span className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2",
                "size-2.5 rounded-full bg-(--color-secondary)",
            )} />
        </div>

        <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold text-(--text-primary) sm:text-3xl">
                {item.year}
            </span>
            <h3 className="text-base font-bold text-(--text-primary) sm:text-lg">
                {item.title}
            </h3>
            <p className="text-xs text-(--text-secondary) sm:text-sm">
                {item.description}
            </p>
        </div>
    </div>
);

const JourneyScroller = ({ items, header, footer }: JourneyScrollerProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    /**
     * Pinned height: the block's own height plus its horizontal overflow, so the section claims
     * exactly the extra page scroll the track needs and not a pixel more.
     */
    const [pinnedHeight, setPinnedHeight] = useState(0);
    /** Finger origin for the touch path; null while no swipe is in progress. */
    const swipeRef = useRef<{ pointerId: number; x: number; scrollY: number } | null>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const sticky = stickyRef.current;
        const track = trackRef.current;
        if (!wrapper || !sticky || !track) return;

        let frame = 0;

        const overflowOf = () =>
            // offsetHeight is 0 below lg, where the whole wrapper is display:none
            sticky.offsetHeight === 0 ? 0 : Math.max(0, track.scrollWidth - sticky.clientWidth);

        const update = () => {
            frame = 0;
            const overflow = overflowOf();
            if (overflow <= 0) {
                track.style.transform = "";
                return;
            }
            const scrollable = wrapper.offsetHeight - sticky.offsetHeight;
            if (scrollable <= 0) return;

            const progress = Math.min(Math.max(-wrapper.getBoundingClientRect().top / scrollable, 0), 1);
            track.style.transform = `translate3d(${-progress * overflow}px, 0, 0)`;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        const measure = () => {
            const overflow = overflowOf();
            setPinnedHeight(overflow > 0 ? sticky.offsetHeight + overflow : 0);
            onScroll();
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(track);
        observer.observe(sticky);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", measure);
        };
    }, [items.length]);

    /**
     * A landscape iPad renders the pinned track, but the track only moves when the *page*
     * scrolls — and a finger swiped sideways scrolls nothing. Translate that sideways swipe
     * into the page scroll the track is already listening to.
     */
    const onSwipeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") return;
        swipeRef.current = { pointerId: event.pointerId, x: event.clientX, scrollY: window.scrollY };
    };

    const onSwipeMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const swipe = swipeRef.current;
        const wrapper = wrapperRef.current;
        const sticky = stickyRef.current;
        const track = trackRef.current;
        if (!swipe || swipe.pointerId !== event.pointerId || !wrapper || !sticky || !track) return;

        const overflow = Math.max(0, track.scrollWidth - sticky.clientWidth);
        const scrollable = wrapper.offsetHeight - sticky.offsetHeight;
        if (overflow <= 0 || scrollable <= 0) return;

        // dragging the cards left (negative dx) means moving forward, i.e. further down the page
        const dx = event.clientX - swipe.x;
        // `instant` because html has scroll-behavior: smooth, which would lag behind the finger
        window.scrollTo({ top: swipe.scrollY - (dx / overflow) * scrollable, behavior: "instant" });
    };

    const onSwipeEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (swipeRef.current?.pointerId === event.pointerId) swipeRef.current = null;
    };

    return (
        <>
            {/* mobile-first: plain stack */}
            <div className="flex flex-col gap-24 lg:hidden">
                {header}
                <div className="flex flex-col gap-8">
                    {items.map((item, index) => (
                        <FadeIn key={item.year} delay={index * 100}>
                            <JourneyCard item={item} className="w-full" />
                        </FadeIn>
                    ))}
                </div>
                {footer}
            </div>

            {/* desktop: the page scroll drives the track sideways while the viewport is pinned */}
            <div
                ref={wrapperRef}
                className="relative hidden lg:block"
                style={pinnedHeight > 0 ? { height: `${pinnedHeight}px` } : undefined}
            >
                <div
                    ref={stickyRef}
                    onPointerDown={onSwipeStart}
                    onPointerMove={onSwipeMove}
                    onPointerUp={onSwipeEnd}
                    onPointerCancel={onSwipeEnd}
                    // full viewport + centred: the block is short, so pinning it at the top would
                    // leave all the leftover space in one empty band underneath it
                    // pan-y keeps the normal vertical page scroll; sideways gestures reach us instead
                    // the track is clipped to the section's own column, not to the viewport
                    className="sticky top-0 flex h-screen touch-pan-y flex-col justify-center gap-13 overflow-hidden py-10"
                >
                    {/* pinned with the cards so the heading stays on screen for the whole scroll */}
                    {header}

                    <div
                        ref={trackRef}
                        className="flex w-max will-change-transform"
                    >
                        {items.map((item) => (
                            <JourneyCard key={item.year} item={item} className="w-[320px] pr-10" />
                        ))}
                    </div>

                    <FadeIn delay={items.length * 100} className="h-0.5 overflow-hidden rounded-full">
                        <div
                            ref={progressRef}
                            className="h-full origin-left scale-x-0 bg-(--color-secondary)"
                        />
                    </FadeIn>

                    {footer}
                </div>
            </div>
        </>
    );
};

export default JourneyScroller;
