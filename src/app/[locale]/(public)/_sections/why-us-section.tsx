import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import cn from "@/lib/tw-merge";

import SectionEyebrow from "../_shared/section-eyebrow";
import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../_shared/styles";
import WhyUsShowcase from "./components/why-us-showcase";
import { HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.whyUs;

interface WhyUsSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const WhyUsSection = ({ data }: WhyUsSectionProps) => {
    const eyebrow = data?.eyebrow?.value || MOCK.eyebrow;
    const title1 = data?.title1?.value || MOCK.title1;
    const title2 = data?.title2?.value || MOCK.title2;
    const description = data?.description?.value || MOCK.description;

    return (
        <section id="why-us" className="w-full py-12 sm:py-14">
            <FadeIn className="mx-auto max-w-7xl px-4 text-(--text-on-light) sm:px-8">
                <WhyUsShowcase
                    items={MOCK.items}
                    image={HOME_MOCK_IMAGE}
                    imageAlt={title2}
                    intro={
                        <>
                            <SectionEyebrow>{eyebrow}</SectionEyebrow>
                            <h2 className={cn(HEADING_GRADIENT_LIGHT_CLASSNAME, "mt-3 w-fit text-3xl font-bold leading-tight sm:text-4xl")}>
                                <span className="block">{title1}</span>
                                <span className="block">{title2}</span>
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed">{description}</p>
                        </>
                    }
                />
            </FadeIn>
        </section>
    );
};

export default WhyUsSection;
