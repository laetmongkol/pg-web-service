import { ArrowUpRight } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import SectionEyebrow from "../_shared/section-eyebrow";
import { HEADING_GRADIENT_DARK_CLASSNAME } from "../_shared/styles";
import WaveLines from "../_shared/wave-lines";
import { HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.services;

interface ServicesSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const ServicesSection = ({ data, language }: ServicesSectionProps) => {
    const eyebrow = data?.eyebrow?.value || MOCK.eyebrow;
    const title = data?.title?.value || MOCK.title;
    const subTitle = data?.subTitle?.value || MOCK.subTitle;
    const description = data?.description?.value || MOCK.description;
    const button = data?.button?.value || MOCK.button;
    const buttonLink = data?.button?.linkUrl || MOCK.buttonLink;

    return (
        <section
            id="services"
            className={cn(
                "relative isolate w-full overflow-hidden pb-16 pt-24 sm:pb-20 lg:pb-24 lg:pt-28",
                "bg-[image:var(--section-dark-gradient)]",
            )}
        >
            <WaveLines />

            <div className="mx-auto max-w-7xl px-4 text-(--text-on-dark) sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <FadeIn>
                            <SectionEyebrow className="text-(--text-body-on-dark)">{eyebrow}</SectionEyebrow>
                        </FadeIn>
                        <FadeIn delay={80}>
                            <h2 className={cn(HEADING_GRADIENT_DARK_CLASSNAME, "mt-3 w-fit text-3xl font-bold sm:text-4xl lg:text-[2.75rem]")}>
                                {title}
                            </h2>
                        </FadeIn>
                        <FadeIn delay={140} className="mt-3 text-sm">
                            {subTitle}
                        </FadeIn>
                    </div>

                    <FadeIn
                        delay={180}
                        className="flex flex-col items-start gap-5 sm:flex-row sm:items-center lg:gap-8"
                    >
                        <p className="text-xs leading-relaxed text-(--text-body-on-dark) sm:text-sm">{description}</p>
                        <LinkCustom
                            href={`/${language}/${buttonLink}`}
                            className={cn(
                                "inline-flex shrink-0 items-center gap-4 rounded-full border border-(--border-on-dark) px-6 py-2.5",
                                "text-sm hover:bg-(--surface-card) hover:text-(--section-dark)",
                                BUTTON_SCALE_CLASSNAME,
                            )}
                        >
                            {button}
                            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
                        </LinkCustom>
                    </FadeIn>
                </div>

                <FadeIn delay={220} className="mt-10 lg:mt-12">
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {MOCK.items.map((item, index) => (
                            <li
                                key={index}
                                className={cn(
                                    "flex flex-col items-center rounded-2xl px-3 pb-6 pt-3 text-center",
                                    "border border-(--border-on-dark) bg-(--glass-on-dark) backdrop-blur-sm",
                                )}
                            >
                                <FillImage
                                    src={HOME_MOCK_IMAGE}
                                    alt=""
                                    sizes="(max-width: 640px) 45vw, 160px"
                                    wrapperClassName="aspect-[113/96] w-full max-w-36 overflow-hidden"
                                    className="object-cover"
                                />
                                <span className="mt-5 text-sm font-bold leading-snug sm:text-base">{item}</span>
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>
        </section>
    );
};

export default ServicesSection;
