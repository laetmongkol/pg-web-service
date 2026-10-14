import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import { HEADING_GRADIENT_DARK_CLASSNAME } from "../_shared/styles";

import TestimonialCarousel, { Testimonial } from "./components/testimonial-carousel";


interface TestimonialsSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const REVIEW_KEYS = ["review1", "review2", "review3", "review4", "review5", "review6"] as const;

/** review1..6 — value is the quote, attribute1 the reviewer's role, plus the avatar picture. */
function getReviews(data: Record<string, TranslateContentResponseDto>): Testimonial[] {
    return REVIEW_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        const pictureAttributes = extractAttributes<PictureAttributes>(item);
        return [{ key, quote: item.value, role: item.attribute1 ?? "", avatar: pictureAttributes?.mediaStorageKey ?? "" }];
    });
}

const TestimonialsSection = ({ data }: TestimonialsSectionProps) => {
    if (!data) return null;
    const reviews = getReviews(data);

    return (
        <section id="testimonials" className="w-full pt-8 pb-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <FadeIn>
                    <h2
                        className={cn(
                            HEADING_GRADIENT_DARK_CLASSNAME,
                            "w-fit font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl",
                        )}
                    >
                        {data?.title1?.value}
                        {data?.title2?.value}
                    </h2>
                </FadeIn>
                <FadeIn delay={100} className="mt-5 text-sm leading-relaxed text-(--text-body-on-dark) sm:text-base">
                    {data?.description?.value}
                </FadeIn>
            </div>

            <FadeIn delay={200} className="mx-auto mt-10 max-w-7xl px-4 sm:px-8 lg:mt-14">
                <TestimonialCarousel items={reviews} />
            </FadeIn>
        </section>
    );
};

export default TestimonialsSection;
