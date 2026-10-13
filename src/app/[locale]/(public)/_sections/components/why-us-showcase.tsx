"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME, BUTTON_SCALE_SUBTLE_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FillImage from "@/components/fill-image.component";

export interface WhyUsItem {
    title: string;
    /** Shorter, line-broken label for the glass card on the photo. */
    cardTitle: string;
}

interface WhyUsShowcaseProps {
    items: WhyUsItem[];
    image: string;
    imageAlt: string;
    /** Server-rendered heading block, placed above the list in the right column. */
    intro: React.ReactNode;
}

const formatStep = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Photo with a glass card on the left, numbered list on the right. Picking a row (or the card's
 * arrow, which steps to the next one) swaps the number and label on the card.
 */
const WhyUsShowcase = ({ items, image, imageAlt, intro }: WhyUsShowcaseProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = items[activeIndex];

    if (!active) return null;

    return (
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative pb-6 pl-0 sm:pl-6">
                <FillImage
                    draggable={false}
                    src={image}
                    alt={imageAlt}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    wrapperClassName="aspect-[444/315] w-full overflow-hidden rounded-[1.75rem]"
                    className="object-cover grayscale"
                />

                <div
                    className={cn(
                        "absolute bottom-0 left-0 flex w-[min(100%,19rem)] items-center gap-4 rounded-[1.5rem] px-6 py-5 sm:w-[19rem]",
                        "border border-(--border-on-dark) bg-(--glass-on-light) text-(--text-on-dark) backdrop-blur-md",
                    )}
                >
                    {/* key restarts the fade so a new step visibly replaces the old one */}
                    <span key={activeIndex} className="flex flex-1 animate-[fade-up_400ms_ease-out] items-center [--fade-up-distance:8px] gap-4">
                        <span className="text-5xl font-light leading-none">{formatStep(activeIndex)}</span>
                        <span className="whitespace-pre-line text-base leading-snug">{active.cardTitle}</span>
                    </span>
                    <button
                        type="button"
                        aria-label="next"
                        onClick={() => setActiveIndex((current) => (current + 1) % items.length)}
                        className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full bg-(--surface-card) text-(--text-on-light)",
                            BUTTON_SCALE_CLASSNAME,
                        )}
                    >
                        <ChevronRight aria-hidden className="size-5" strokeWidth={2.25} />
                    </button>
                </div>
            </div>

            <div>
                {intro}
                <ul className="mt-6 flex flex-col gap-2.5">
                    {items.map(({ title }, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <li key={`${title}-${index}`}>
                                <button
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => setActiveIndex(index)}
                                    className={cn(
                                        "flex w-full items-center gap-5 rounded-full border border-(--border-on-light) bg-(--surface-card)/60 py-1.5 pl-2.5 pr-5 text-left",
                                        BUTTON_SCALE_SUBTLE_CLASSNAME,
                                        "text-sm text-(--text-on-light) hover:bg-(--surface-card)",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex h-7 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-(--text-on-dark)",
                                            "transition-colors! duration-300!",
                                            isActive ? "bg-(--button-on-light)" : "bg-(--button-on-light)/35",
                                        )}
                                    >
                                        {formatStep(index)}
                                    </span>
                                    {title}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default WhyUsShowcase;
