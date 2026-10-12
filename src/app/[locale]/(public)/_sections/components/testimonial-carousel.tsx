"use client";

import { useKeenSlider } from "keen-slider/react";
import { Quote, Star } from "lucide-react";

import FillImage from "@/components/fill-image.component";

import { buildLoopSlides, createAutoplay } from "../../_shared/keen-autoplay";

import "keen-slider/keen-slider.min.css";

export interface Testimonial {
    key: string;
    role: string;
    quote: string;
    avatar: string;
}

const STAR_COUNT = 5;
const autoplay = createAutoplay(5000);

/** Looping row of quote cards — 1 / 2 / 3 up; drag or wait for autoplay. */
const TestimonialCarousel = ({ items }: { items: Testimonial[] }) => {
    const slideData = buildLoopSlides(items, 6);

    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            slides: { perView: 1.1, spacing: 12 },
            breakpoints: {
                "(min-width: 640px)": { slides: { perView: 2, spacing: 12 } },
                "(min-width: 1024px)": { slides: { perView: 3, spacing: 12 } },
            },
        },
        [autoplay],
    );

    if (slideData.length === 0) return null;

    return (
        <div ref={sliderRef} className="keen-slider cursor-grab active:cursor-grabbing">
            {slideData.map(({ key, role, quote, avatar }, index) => (
                <div key={`${key}-${index}`} className="keen-slider__slide">
                    <article className="relative flex h-full min-h-56 flex-col rounded-2xl bg-(--surface-card) px-6 py-5 text-(--text-on-light)">
                        <Quote
                            aria-hidden
                            className="absolute right-6 top-5 size-7 rotate-180 fill-(--border-on-light) text-transparent"
                        />
                        <div className="flex items-center gap-3">
                            <FillImage
                                src={avatar}
                                alt=""
                                sizes="40px"
                                draggable={false}
                                wrapperClassName="size-9 shrink-0 overflow-hidden rounded-full"
                                className="object-cover"
                            />
                            <div className="flex flex-col">
                                <span className="text-[0.6875rem] text-(--text-on-light)">{role}</span>
                                <span className="mt-0.5 flex items-center gap-0.5" aria-label={`${STAR_COUNT} stars`}>
                                    {Array.from({ length: STAR_COUNT }, (_, star) => (
                                        <Star key={star} aria-hidden className="size-3.5 fill-(--color-rating) text-(--color-rating)" />
                                    ))}
                                </span>
                            </div>
                        </div>
                        <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-(--text-on-light)">
                            {quote}
                        </p>
                    </article>
                </div>
            ))}
        </div>
    );
};

export default TestimonialCarousel;
