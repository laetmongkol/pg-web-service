"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";

import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";

import "keen-slider/keen-slider.min.css";

export type VisionItem = {
    tag: string;
    title: string;
    titleAccent: string;
    image: string;
    /** Pulled-out statement, shown with a rule down its left edge. */
    quote?: string;
    description?: string;
    /** Used instead of quote/description — the mission side of the pair. */
    points?: { title: string; description: string }[];
    /** Put the picture on the left, so consecutive cards mirror each other. */
    reverse?: boolean;
};

interface VisionSlideProps {
    items: VisionItem[];
}

const AUTOPLAY_MS = 3000;

/** Only this slides — the white card around it is a fixed frame. */
const VisionCard = ({ item }: { item: VisionItem }) => (
    <div
        className={cn(
            "flex w-full flex-col",
            "gap-8 lg:gap-14",
            "lg:flex-row lg:items-center",
            item.reverse && "lg:flex-row-reverse",
        )}
    >
        <div className={cn(
            "flex flex-col gap-5",
            "items-center text-center",
            "lg:flex-1 lg:items-start lg:text-start",
        )}>
            <span className={cn(
                "rounded-full border border-(--text-primary) px-4 py-1",
                "text-xs font-bold tracking-wide text-(--text-primary)",
            )}>
                {item.tag}
            </span>

            <h3 className={cn(
                "font-bold text-(--text-primary)",
                "text-2xl sm:text-3xl leading-tight",
            )}>
                <span className="text-(--color-secondary)">{item.titleAccent}</span>
                {item.title}
            </h3>

            {item.quote ? (
                <p className={cn(
                    "text-base sm:text-lg font-medium text-(--text-primary) leading-relaxed",
                    "border-(--color-secondary) lg:border-l-2 lg:pl-5",
                )}>
                    {item.quote}
                </p>
            ) : null}

            {item.description ? (
                <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed">
                    {item.description}
                </p>
            ) : null}

            {item.points ? (
                <ul className="flex flex-col gap-4">
                    {item.points.map((point) => (
                        <li key={point.title} className="flex flex-row items-start gap-3 text-start">
                            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-(--text-secondary)" strokeWidth={1.5} />
                            <span className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-(--text-primary) sm:text-base">
                                    {`${point.title}:`}
                                </span>
                                <span className="text-sm text-(--text-secondary) leading-relaxed">
                                    {point.description}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>

        {/* one element, two orientations: a rule above the picture, a spine beside it */}
        <span aria-hidden className={cn(
            "shrink-0 bg-(--text-primary)/15",
            "h-px w-full",
            "lg:h-64 lg:w-px",
        )} />

        <FillImage
            src={item.image}
            alt={`${item.titleAccent}${item.title}`}
            width={900}
            height={900}
            sizes="(max-width: 1024px) 100vw, 360px"
            draggable={false}
            wrapperClassName="mx-auto w-full max-w-sm shrink-0 lg:mx-0 lg:w-80"
            className="aspect-square w-full rounded-2xl object-cover"
        />
    </div>
);

const VisionSlide = ({ items }: VisionSlideProps) => {
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    /** Vertical keen needs a fixed height, so the track takes the tallest slide's. */
    const [trackHeight, setTrackHeight] = useState(0);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        // a phone swipes sideways; only the desktop card is wide enough to read a vertical move
        vertical: false,
        // spacing keeps the next card off the current one while a swipe is mid-flight
        slides: { perView: 1, spacing: 32 },
        breakpoints: {
            "(min-width: 1024px)": { vertical: true, slides: { perView: 1, spacing: 48 } },
        },
        // `rel` is the index within the real list, not the cloned track keen builds for looping
        slideChanged: (instance) => setActive(instance.track.details.rel),
    });

    // the slides stack their own content, so their heights differ and change with the viewport
    useEffect(() => {
        const nodes = slideRefs.current.filter((node): node is HTMLDivElement => node !== null);
        if (nodes.length === 0) return;

        const measure = () => {
            const tallest = Math.max(...nodes.map((node) => node.offsetHeight));
            setTrackHeight((current) => (Math.abs(current - tallest) > 1 ? tallest : current));
        };
        measure();

        const observer = new ResizeObserver(measure);
        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, [items.length]);

    // keen measures once on mount, so a height that lands later has to be handed back to it
    useEffect(() => {
        if (trackHeight > 0) slider.current?.update();
    }, [trackHeight, slider]);

    // depends on `active`, so every manual jump restarts the countdown
    useEffect(() => {
        if (items.length < 2 || isPaused) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const timer = window.setTimeout(() => slider.current?.next(), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [items.length, isPaused, active, slider]);

    if (items.length === 0) return null;

    return (
        <div
            className={cn(
                // the frame: it never moves, only its contents slide inside it
                "relative overflow-hidden bg-(--surface-elevated)",
                "rounded-3xl lg:rounded-br-[6rem]",
                "p-8 sm:p-10 lg:p-14",
            )}
            // only a real mouse hovers; a touch would otherwise stall autoplay until release
            onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setIsPaused(true);
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setIsPaused(false);
            }}
        >
            {/* the slider is only the inside of the section — the cards keep their own layout */}
            <div
                ref={sliderRef}
                className="keen-slider"
                style={trackHeight > 0 ? { height: `${trackHeight}px` } : undefined}
            >
                {items.map((item, index) => (
                    <div key={item.tag} className="keen-slider__slide">
                        <div ref={(node) => { slideRefs.current[index] = node; }}>
                            <VisionCard item={item} />
                        </div>
                    </div>
                ))}
            </div>

            {items.length > 1 ? (
                <div className={cn(
                    "flex items-center justify-center gap-2 pt-6",
                    // desktop parks the dots on the card's right edge, as in the mock
                    "lg:absolute lg:top-1/2 lg:right-6 lg:flex-col lg:-translate-y-1/2 lg:pt-0",
                )}>
                    {items.map((item, dot) => {
                        const isActive = dot === active;
                        return (
                            <button
                                key={item.tag}
                                type="button"
                                aria-label={`${item.titleAccent}${item.title}`}
                                aria-current={isActive}
                                onClick={() => slider.current?.moveToIdx(dot)}
                                className={cn(
                                    "size-2.5 rounded-full bg-(--text-primary) transition-opacity duration-300",
                                    "motion-reduce:transition-none",
                                    isActive ? "opacity-100" : "opacity-25",
                                )}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default VisionSlide;
