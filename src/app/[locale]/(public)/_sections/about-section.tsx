import { ArrowUpRight, BadgeCheck, Brain, Users } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import SectionEyebrow from "../_shared/section-eyebrow";
import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../_shared/styles";
import { HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.about;

/** One icon per stat, in MOCK.stats order. */
const STAT_ICONS = [Brain, Users, BadgeCheck];

interface AboutSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const AboutSection = ({ data, language }: AboutSectionProps) => {
    const eyebrow = data?.eyebrow?.value || MOCK.eyebrow;
    const title = data?.title?.value || MOCK.title;
    const description = data?.description?.value || MOCK.description;
    const button = data?.button?.value || MOCK.button;
    const buttonLink = data?.button?.linkUrl || MOCK.buttonLink;
    const mindsetTitle = data?.mindsetTitle?.value || MOCK.mindsetTitle;
    const mindsetDescription = data?.mindsetDescription?.value || MOCK.mindsetDescription;

    return (
        <section id="about" className="w-full pb-16 pt-10 sm:pb-20 lg:pb-24">
            <div className="mx-auto max-w-7xl px-4 text-(--text-on-light) sm:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col items-start">
                        <FadeIn>
                            <SectionEyebrow>{eyebrow}</SectionEyebrow>
                        </FadeIn>
                        <FadeIn delay={80}>
                            <h2
                                className={cn(
                                    HEADING_GRADIENT_LIGHT_CLASSNAME,
                                    "mt-4 max-w-md font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.2]",
                                )}
                            >
                                {title}
                            </h2>
                        </FadeIn>
                        <FadeIn delay={140} className="mt-3 text-sm leading-relaxed sm:text-base">
                            {description}
                        </FadeIn>
                        <FadeIn delay={200} className="mt-7">
                            <LinkCustom
                                href={`/${language}/${buttonLink}`}
                                className={cn(
                                    "inline-flex items-center gap-4 rounded-full bg-(--button-on-light) px-8 py-2.5",
                                    "text-sm text-(--text-on-dark)",
                                    BUTTON_SCALE_CLASSNAME,
                                )}
                            >
                                {button}
                                <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
                            </LinkCustom>
                        </FadeIn>

                        <FadeIn delay={240} className="mt-8 w-full">
                            <ul className="grid grid-cols-3 gap-4">
                                {MOCK.stats.map(({ value, label }, index) => {
                                    const Icon = STAT_ICONS[index] ?? BadgeCheck;
                                    return (
                                        <li key={label} className="flex flex-col items-start gap-3 sm:flex-row">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-(--icon-accent)/15 bg-(--icon-accent)/10">
                                                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                                            </span>
                                            <span className="flex flex-col">
                                                <span className="text-2xl font-bold leading-none sm:text-3xl">
                                                    {value}
                                                </span>
                                                <span className="mt-1.5 text-xs leading-snug">{label}</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </FadeIn>
                    </div>

                    <FadeIn delay={150} direction="left">
                        <FillImage
                            src={HOME_MOCK_IMAGE}
                            alt={title}
                            sizes="(max-width: 1024px) 100vw, 520px"
                            wrapperClassName="aspect-[407/394] w-full overflow-hidden rounded-[1.75rem]"
                            className="object-cover"
                        />
                    </FadeIn>
                </div>

                {/* Mindset */}
                <div className="mt-20 lg:mt-24">
                    <FadeIn>
                        <h3 className="text-2xl font-bold sm:text-3xl">{mindsetTitle}</h3>
                    </FadeIn>
                    <FadeIn delay={80} className="mt-2 text-sm sm:text-base">
                        {mindsetDescription}
                    </FadeIn>

                    <FadeIn delay={140} className="mt-10">
                        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-0">
                            {MOCK.mindsets.map(({ title: itemTitle, description: itemDescription }, index) => (
                                <li
                                    key={itemTitle}
                                    className={cn(
                                        "flex items-center gap-6 sm:px-6 lg:px-8",
                                        index > 0 && "sm:border-l sm:border-(--border-on-light)",
                                    )}
                                >
                                    <FillImage
                                        src={HOME_MOCK_IMAGE}
                                        alt=""
                                        sizes="80px"
                                        wrapperClassName="size-16 shrink-0 overflow-hidden rounded-2xl sm:size-[4.5rem]"
                                        className="object-cover"
                                    />
                                    <span className="flex flex-1 flex-col items-center text-center">
                                        <span className="text-base font-bold">{itemTitle}</span>
                                        <span className="mt-2 text-xs leading-relaxed">{itemDescription}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
