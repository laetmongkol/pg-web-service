"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import SectionNavButton from "./section-nav-button";

import "keen-slider/keen-slider.min.css";

import type { ReactNode } from "react";

export type ReviewItem = {
    quote: string;
    name: string;
    role: string;
    meta: string;
    /** Dot colour on the card — a plain CSS colour, kept out of Tailwind's class scan. */
    accent: string;
};

interface ReviewSlideProps {
    items: ReviewItem[];
    /** Badge + heading block — sits opposite the arrows on desktop. */
    header: ReactNode;
}

const ReviewCard = ({ item }: { item: ReviewItem }) => (
    <div
        className={cn(
            "flex h-full flex-col gap-6 rounded-2xl p-6",
            "border border-(--border-default) bg-(--surface-elevated)",
        )}
    >
        <div className="flex items-center justify-between gap-4">
            <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.accent }} />
            <span className="text-xs text-(--text-secondary)">{item.meta}</span>
        </div>

        <p className="flex-1 whitespace-pre-line text-sm leading-loose text-(--text-primary)">
            {item.quote}
        </p>

        <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-(--text-primary)">{item.name}</span>
            <span className="text-xs text-(--text-secondary)">{item.role}</span>
        </div>
    </div>
);

const ReviewSlide = ({ items, header }: ReviewSlideProps) => {
    const [current, setCurrent] = useState(0);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: { perView: 1.1, spacing: 16 },
        breakpoints: {
            "(min-width: 640px)": { slides: { perView: 2, spacing: 20 } },
            "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
        },
        // `rel` is the index in the real list, not in the cloned track keen builds for looping
        slideChanged: (instance) => setCurrent(instance.track.details.rel),
    });

    if (items.length === 0) return null;

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {header}
                <FadeIn delay={300} className="flex shrink-0 gap-3">
                    <SectionNavButton direction="prev" onClick={() => slider.current?.prev()} />
                    <SectionNavButton direction="next" onClick={() => slider.current?.next()} />
                </FadeIn>
            </div>

            {/* one fade for the whole track: a per-card fade would never fire for the slides
                parked off-screen, leaving them blank until they are paged in */}
            <FadeIn delay={400}>
                <div ref={sliderRef} className="keen-slider">
                {items.map((item) => (
                    <div key={item.name} className="keen-slider__slide">
                        <ReviewCard item={item} />
                    </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={500} className="flex items-center justify-center gap-2">
                {items.map((item, dot) => (
                    <button
                        key={item.name}
                        type="button"
                        aria-label={`ไปที่รีวิวของ ${item.name}`}
                        aria-current={dot === current}
                        onClick={() => slider.current?.moveToIdx(dot)}
                        className={cn(
                            "h-2 cursor-pointer rounded-full bg-(--text-primary)",
                            "transition-all duration-300 motion-reduce:transition-none",
                        )}
                        style={{ width: dot === current ? 24 : 8, opacity: dot === current ? 1 : 0.25 }}
                    />
                ))}
            </FadeIn>
        </div>
    );
};

export default ReviewSlide;
