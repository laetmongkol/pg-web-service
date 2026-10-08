import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import TestimonialCarousel from "./components/testimonial-carousel";
import { HOME_HEADING_GRADIENT_CLASSNAME, HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.testimonials;

interface TestimonialsSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const TestimonialsSection = ({ data }: TestimonialsSectionProps) => {
    const title1 = data?.title1?.value || MOCK.title1;
    const title2 = data?.title2?.value || MOCK.title2;
    const description = data?.description?.value || MOCK.description;
    const items = MOCK.items.map((item) => ({ ...item, avatar: HOME_MOCK_IMAGE }));

    return (
        <section id="testimonials" className="w-full py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <FadeIn>
                    <h2
                        className={cn(
                            HOME_HEADING_GRADIENT_CLASSNAME,
                            "w-fit font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl",
                        )}
                    >
                        {title1}
                        {title2}
                    </h2>
                </FadeIn>
                <FadeIn delay={100} className="mt-5 text-sm leading-relaxed text-(--text-body-on-dark) sm:text-base">
                    {description}
                </FadeIn>
            </div>

            <FadeIn delay={200} className="mx-auto mt-10 max-w-7xl px-4 sm:px-8 lg:mt-14">
                <TestimonialCarousel items={items} />
            </FadeIn>
        </section>
    );
};

export default TestimonialsSection;
