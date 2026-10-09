"use client";

import { useState } from "react";

import { useKeenSlider } from "keen-slider/react";

import cn from "@/lib/tw-merge";

import FillImage from "@/components/fill-image.component";

import { buildLoopSlides, createAutoplay } from "../../../_shared/keen-autoplay";

import "keen-slider/keen-slider.min.css";

export interface TeamMember {
    key: string;
    name: string;
    role: string;
    /** Shown in a blue circle when there is no photo yet. */
    initials: string;
    photo?: string;
}

const autoplay = createAutoplay(4000);

/** A card this far off-screen or more is the peeking one and fades, like the design's 5th card. */
const FULLY_VISIBLE_PORTION = 0.98;

/** Looping row of team cards — 1.3 / 2.4 / 4.3 up; the partly visible card at the edge is faded. */
const TeamSlider = ({ members }: { members: TeamMember[] }) => {
    const slideData = buildLoopSlides(members);
    // one "0"/"1" per slide; a string so the per-frame detailsChanged only re-renders when a flag flips
    const [peekFlags, setPeekFlags] = useState("");

    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            slides: { perView: 1.3, spacing: 16 },
            breakpoints: {
                "(min-width: 640px)": { slides: { perView: 2.4, spacing: 20 } },
                "(min-width: 1024px)": { slides: { perView: 4.3, spacing: 20 } },
            },
            detailsChanged(slider) {
                const flags = slider.track.details.slides
                    .map((slide) => (slide.portion < FULLY_VISIBLE_PORTION ? "1" : "0"))
                    .join("");
                setPeekFlags((current) => (current === flags ? current : flags));
            },
        },
        [autoplay],
    );

    if (slideData.length === 0) return null;

    return (
        <div ref={sliderRef} className="keen-slider cursor-grab active:cursor-grabbing">
            {slideData.map(({ key, name, role, initials, photo }, index) => {
                const isPeeking = peekFlags[index] === "1";

                return (
                    <div key={`${key}-${index}`} className="keen-slider__slide">
                        <article
                            className={cn(
                                "flex h-full flex-col items-center rounded-3xl bg-(--surface-card) px-5 pb-8 pt-5 text-center",
                                "transition-opacity! duration-300!",
                                isPeeking ? "opacity-50" : "opacity-100",
                            )}
                        >
                            {photo ? (
                                <FillImage
                                    src={photo}
                                    alt={name}
                                    sizes="104px"
                                    draggable={false}
                                    wrapperClassName="size-26 overflow-hidden rounded-full"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="flex size-26 items-center justify-center rounded-full bg-(--icon-accent) text-xl font-semibold text-(--text-on-dark)">
                                    {initials}
                                </span>
                            )}
                            <h3 className="mt-10 text-sm font-bold text-(--text-on-light)">{name}</h3>
                            <p className="mt-4 text-xs text-(--text-on-light)">{role}</p>
                        </article>
                    </div>
                );
            })}
        </div>
    );
};

export default TeamSlider;
