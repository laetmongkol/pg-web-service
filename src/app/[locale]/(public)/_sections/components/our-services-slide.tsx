"use client";

import { ArrowRight, MousePointerClick, PenLine, Search, Sparkles } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import LinkCustom from "@/components/link-custom.component";

import SectionNavButton from "./section-nav-button";

import "keen-slider/keen-slider.min.css";

import type { ReactNode } from "react";

/** Icons live here, not in the section: a server component cannot hand a component across. */
const SERVICE_ICONS = {
    consulting: Search,
    strategy: MousePointerClick,
    branding: Sparkles,
    content: PenLine,
} as const;

export type ServiceIconName = keyof typeof SERVICE_ICONS;

export type OurServiceSlideItem = {
    icon: ServiceIconName;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
};

interface OurServicesSlideProps {
    items: OurServiceSlideItem[];
    /** Badge + heading block — sits opposite the arrows on desktop. */
    header: ReactNode;
}

const ServiceCard = ({ item }: { item: OurServiceSlideItem }) => {
    const Icon = SERVICE_ICONS[item.icon];

    return (
        <LinkCustom
            href={item.href}
            className={cn(
                "group flex h-full flex-col gap-6 rounded-2xl p-6 transition-colors duration-300",
                "border border-(--border-default) bg-(--surface-elevated) text-(--text-primary)",
                // the filled card in the design is the hover state, so it is styled here, not by index
                "hover:bg-(--text-primary) hover:text-(--text-invert)",
            )}
        >
            <Icon aria-hidden strokeWidth={1.4} className="size-8 shrink-0" />

            <p className="mt-6 text-lg font-bold">{item.title}</p>

            <p
                className={cn(
                    "flex-1 whitespace-pre-line text-sm leading-relaxed",
                    "text-(--text-secondary) group-hover:text-(--text-invert)/75",
                )}
            >
                {item.description}
            </p>

            <span className="flex items-center gap-2 text-sm font-medium">
                {item.linkLabel}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
        </LinkCustom>
    );
};

const OurServicesSlide = ({ items, header }: OurServicesSlideProps) => {
    // The four cards fill the row at lg, so keen would have nothing to page through. Running the
    // list twice gives the loop something to rotate into: the visitor only ever sees the same four
    // services cycling past.
    const slides = [...items, ...items];

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: { perView: 1.15, spacing: 16 },
        breakpoints: {
            "(min-width: 640px)": { slides: { perView: 2.2, spacing: 20 } },
            "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
        },
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
                {slides.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        aria-hidden={index >= items.length}
                        className="keen-slider__slide"
                    >
                        <ServiceCard item={item} />
                    </div>
                    ))}
                </div>
            </FadeIn>
        </div>
    );
};

export default OurServicesSlide;
