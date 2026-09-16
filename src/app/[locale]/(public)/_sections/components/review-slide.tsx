"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";

import cn from "@/lib/tw-merge";

import "keen-slider/keen-slider.min.css";

import type { ReactNode } from "react";
import FadeIn from "@/app/component/fade-in.components";

export type ReviewItem = {
    quote: string;
    name: string;
    role: string;
};

interface ReviewSlideProps {
    items: ReviewItem[];
    /** Section heading — sits beside the arrows on desktop. */
    header: ReactNode;
}

const NavButton = ({
    direction,
    onClick,
    className,
}: {
    direction: "prev" | "next";
    onClick: () => void;
    className?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={direction === "prev" ? "ก่อนหน้า" : "ถัดไป"}
        className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full transition",
            "border border-(--text-primary)/15 text-(--text-primary) shadow-md",
            "hover:scale-105",
            direction === "next" ? "bg-(--text-primary) text-(--text-invert)" : "bg-(--text-invert) text-(--text-primary)",
            className,
        )}
    >
        {direction === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
);

const ReviewCard = ({ item }: { item: ReviewItem }) => (
    <div className="flex h-full flex-col gap-5 rounded-2xl bg-(--text-invert) p-6 shadow-sm">
        <Quote aria-hidden className="size-8 shrink-0 fill-(--color-primary-400) text-(--color-primary-400)" />
        <p className="flex-1 text-base leading-relaxed text-(--text-secondary)">
            {item.quote}
        </p>
        <div className="flex flex-col gap-1">
            <span className="font-bold text-(--text-primary)">{item.name}</span>
            <span className="text-sm text-(--text-secondary)">{item.role}</span>
        </div>
    </div>
);

const ReviewSlide = ({ items, header }: ReviewSlideProps) => {
    const [current, setCurrent] = useState(0);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: { perView: 1, spacing: 16 },
        breakpoints: {
            "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
        },
        // `rel` is the index within the real list, not the cloned track keen builds for looping
        slideChanged: (instance) => setCurrent(instance.track.details.rel),
    });

    if (items.length === 0) return null;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {header}
                <FadeIn delay={100} className="hidden shrink-0 gap-3 lg:flex">
                    <NavButton direction="prev" onClick={() => slider.current?.prev()} />
                    <NavButton direction="next" onClick={() => slider.current?.next()} />
                </FadeIn>
            </div>

            <FadeIn direction="right" delay={200} className="relative">
                <div ref={sliderRef} className="keen-slider">
                    {items.map((item) => (
                        <div key={item.name} className="keen-slider__slide">
                            <ReviewCard item={item} />
                        </div>
                    ))}
                </div>

                {/* phones get the arrows on the card edges instead of up in the header */}
                <NavButton
                    direction="prev"
                    onClick={() => slider.current?.prev()}
                    className="absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2 lg:hidden"
                />
                <NavButton
                    direction="next"
                    onClick={() => slider.current?.next()}
                    className="absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 lg:hidden"
                />
            </FadeIn>

            <div className="flex items-center justify-center gap-2">
                {items.map((item, dot) => (
                    <button
                        key={item.name}
                        type="button"
                        aria-label={`ไปที่รีวิวของ ${item.name}`}
                        aria-current={dot === current}
                        onClick={() => slider.current?.moveToIdx(dot)}
                        className="h-2 rounded-full bg-(--color-primary-400) transition-all duration-300 motion-reduce:transition-none"
                        style={{ width: dot === current ? 24 : 8, opacity: dot === current ? 1 : 0.3 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewSlide;
