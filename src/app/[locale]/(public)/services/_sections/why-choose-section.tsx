import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import { PIP_MOCK_IMAGE, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import { SERVICES_MOCK } from "./services-mock";

const MOCK = SERVICES_MOCK.whyChoose;

interface WhyChooseSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** White card with the phone photo breaking out of its top edge, copy and three stats on the right. */
const WhyChooseSection = ({ data }: WhyChooseSectionProps) => {
    const title1 = data?.title1?.value || MOCK.title1;
    const title2 = data?.title2?.value || MOCK.title2;
    const description = data?.description?.value || MOCK.description;

    return (
        <section id="why-choose-us" className="w-full pb-16 pt-24 sm:pb-20 lg:pb-24 lg:pt-36">
            <FadeIn className={SECTION_CONTAINER_CLASSNAME}>
                <div className="relative grid rounded-[2rem] bg-(--surface-card) sm:rounded-[2.5rem] lg:grid-cols-2">
                    {/* the photo pokes ~5rem above the card on desktop */}
                    <div className="relative -mt-16 h-80 overflow-hidden rounded-t-[2rem] sm:h-[26rem] lg:-mt-20 lg:h-auto lg:min-h-[34rem] lg:rounded-none lg:rounded-bl-[2.5rem]">
                        <FillImage
                            src={PIP_MOCK_IMAGE}
                            alt={`${title1} ${title2}`}
                            sizes="(max-width: 1024px) 100vw, 600px"
                            wrapperClassName="absolute inset-0"
                            className="object-cover object-top"
                        />
                    </div>

                    <div className="flex flex-col justify-center px-6 py-10 text-(--text-on-light) sm:px-12 lg:py-16 lg:pl-6 lg:pr-16">
                        <h2
                            className={cn(
                                "font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1.25]",
                                "bg-[image:var(--gradient-heading-on-light)] bg-clip-text text-transparent",
                            )}
                        >
                            <span className="block">{title1}</span>
                            <span className="block">{title2}</span>
                        </h2>
                        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed sm:text-base">{description}</p>

                        <ul className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
                            {MOCK.stats.map(({ value, label }) => (
                                <li key={value} className="flex flex-col">
                                    <span className="text-2xl font-bold sm:text-[2rem]">{value}</span>
                                    <span className="mt-1.5 text-[0.6875rem] leading-snug">{label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
};

export default WhyChooseSection;
