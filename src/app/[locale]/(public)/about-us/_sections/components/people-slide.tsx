"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";

import cn from "@/lib/tw-merge";

import "keen-slider/keen-slider.min.css";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

export type PersonItem = {
    image: string;
    name: string;
    role: string;
};

interface PeopleSlideProps {
    items: PersonItem[];
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
            "border border-(--text-primary)/15 shadow-md",
            "hover:scale-105",
            direction === "next" ? "bg-(--text-primary) text-(--text-invert)" : "bg-(--text-invert) text-(--text-primary)",
            className,
        )}
    >
        {direction === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
);

const PersonCard = ({ item }: { item: PersonItem }) => (
    <div className="relative h-full overflow-hidden rounded-3xl">
        <FillImage
            src={item.image}
            alt={item.name}
            width={800}
            height={1000}
            sizes="(max-width: 1024px) 80vw, 360px"
            draggable={false}
            wrapperClassName="aspect-4/5 w-full"
            className="h-full w-full object-cover"
        />

        <div className={cn(
            "absolute inset-x-3 bottom-4 flex items-center gap-2",
            "rounded-full bg-(--surface-invert)/45 px-4 py-3 backdrop-blur-sm",
        )}>
            <span className="text-sm font-bold whitespace-nowrap text-(--text-invert)">
                {item.name}
            </span>
            <span aria-hidden className="h-4 w-px shrink-0 bg-(--text-invert)/40" />
            <span className="truncate text-xs text-(--text-invert)/80 lg:overflow-visible">
                {item.role}
            </span>
            <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 text-(--text-invert)" />
        </div>
    </div>
);

const PeopleSlide = ({ items }: PeopleSlideProps) => {
    const [current, setCurrent] = useState(0);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: { perView: 1, spacing: 16 },
        breakpoints: {
            "(min-width: 640px)": { slides: { perView: 2, spacing: 20 } },
            "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
        },
        // `rel` is the index within the real list, not the cloned track keen builds for looping
        slideChanged: (instance) => setCurrent(instance.track.details.rel),
    });

    if (items.length === 0) return null;

    return (
        <div className="flex flex-col gap-8">
            <FadeIn direction="right" delay={200} className="relative">
                <div ref={sliderRef} className="keen-slider">
                    {items.map((item) => (
                        <div key={item.name} className="keen-slider__slide">
                            <PersonCard item={item} />
                        </div>
                    ))}
                </div>

                <NavButton
                    direction="prev"
                    onClick={() => slider.current?.prev()}
                    className="absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2"
                />
                <NavButton
                    direction="next"
                    onClick={() => slider.current?.next()}
                    className="absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2"
                />
            </FadeIn>

            <div className="flex items-center justify-center gap-2">
                {items.map((item, dot) => (
                    <button
                        key={item.name}
                        type="button"
                        aria-label={`ไปที่ ${item.name}`}
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

export default PeopleSlide;
