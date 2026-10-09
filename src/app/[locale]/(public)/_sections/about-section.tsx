import { ArrowUpRight, BadgeCheck, Brain, Users } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import SectionEyebrow from "../_shared/section-eyebrow";
import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../_shared/styles";


const STAT_KEYS = ["stat1", "stat2", "stat3"] as const;
const MINDSET_KEYS = ["mindset1", "mindset2", "mindset3"] as const;

/** One icon per stat row, in STAT_KEYS order. */
const STAT_ICONS = [Brain, Users, BadgeCheck];

type AboutStat = {
    key: string;
    value: string;
    label: string;
};

type Mindset = {
    key: string;
    title: string;
    description: string;
    image: string;
};

/** stat1..3 — value is the figure, attribute1 the label under it. */
function getStats(data: Record<string, TranslateContentResponseDto>): AboutStat[] {
    return STAT_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];
        return [{ key, value: item.value, label: item.attribute1 ?? "" }];
    });
}

/** mindset1..3 — value is the title, attribute1 the description, plus the row's picture. */
function getMindsets(data: Record<string, TranslateContentResponseDto>): Mindset[] {
    return MINDSET_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        const pictureAttributes = extractAttributes<PictureAttributes>(item);
        return [{
            key,
            title: item.value,
            description: item.attribute1 ?? "",
            image: pictureAttributes?.mediaStorageKey ?? "",
        }];
    });
}

interface AboutSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const AboutSection = ({ data, language }: AboutSectionProps) => {
    if (!data) return null;
    const stats = getStats(data);
    const mindsets = getMindsets(data);
    const aboutPictureAttributes = extractAttributes<PictureAttributes>(data?.aboutImg);

    return (
        <section id="about" className="w-full pb-16 pt-10 sm:pb-20 lg:pb-24">
            <div className="mx-auto max-w-7xl px-4 text-(--text-on-light) sm:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col items-start">
                        <FadeIn>
                            <SectionEyebrow>{data?.eyebrow?.value}</SectionEyebrow>
                        </FadeIn>
                        <FadeIn delay={80}>
                            <h2
                                className={cn(
                                    HEADING_GRADIENT_LIGHT_CLASSNAME,
                                    "mt-4 max-w-md font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.2]",
                                )}
                            >
                                {data?.title?.value}
                            </h2>
                        </FadeIn>
                        <FadeIn delay={140} className="mt-3 text-sm leading-relaxed sm:text-base">
                            {data?.description?.value}
                        </FadeIn>
                        <FadeIn delay={200} className="mt-7">
                            <LinkCustom
                                href={`/${language}/${data?.button?.linkUrl}`}
                                className={cn(
                                    "inline-flex items-center gap-4 rounded-full bg-(--button-on-light) px-8 py-2.5",
                                    "text-sm text-(--text-on-dark)",
                                    BUTTON_SCALE_CLASSNAME,
                                )}
                            >
                                {data?.button?.value}
                                <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
                            </LinkCustom>
                        </FadeIn>

                        <FadeIn delay={240} className="mt-8 w-full">
                            <ul className="grid grid-cols-3 gap-4">
                                {stats.map(({ key, value, label }, index) => {
                                    const Icon = STAT_ICONS[index] ?? BadgeCheck;
                                    return (
                                        <li key={key} className="flex flex-col items-start gap-3 sm:flex-row">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-(--icon-accent)/15 bg-(--icon-accent)/10">
                                                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                                            </span>
                                            <span className="flex flex-col">
                                                <span className="text-2xl font-bold leading-none sm:text-3xl">
                                                    {value}
                                                </span>
                                                <span className="mt-1.5 whitespace-pre-line text-xs leading-snug">{label}</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </FadeIn>
                    </div>

                    <FadeIn delay={150} direction="left">
                        <FillImage
                            src={aboutPictureAttributes?.mediaStorageKey ?? ""}
                            alt={aboutPictureAttributes?.mediaAltText ?? ""}
                            sizes="(max-width: 1024px) 100vw, 520px"
                            wrapperClassName="aspect-[407/394] w-full overflow-hidden rounded-[1.75rem]"
                            className="object-cover"
                        />
                    </FadeIn>
                </div>

                {/* Mindset */}
                <div className="mt-20 lg:mt-24">
                    <FadeIn>
                        <h3 className="text-2xl font-bold sm:text-3xl">{data?.mindsetTitle?.value}</h3>
                    </FadeIn>
                    <FadeIn delay={80} className="mt-2 text-sm sm:text-base">
                        {data?.mindsetDescription?.value}
                    </FadeIn>

                    <FadeIn delay={140} className="mt-10">
                        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-0">
                            {mindsets.map(({ key, title: itemTitle, description: itemDescription, image: itemImage }, index) => (
                                <li
                                    key={key}
                                    className={cn(
                                        "flex items-center gap-6 sm:px-6 lg:px-8",
                                        index > 0 && "sm:border-l sm:border-(--border-on-light)",
                                    )}
                                >
                                    <FillImage
                                        src={itemImage}
                                        alt=""
                                        sizes="80px"
                                        wrapperClassName="size-16 shrink-0 overflow-hidden rounded-2xl sm:size-[4.5rem]"
                                        className="object-contain"
                                    />
                                    <span className="flex flex-1 flex-col items-center text-center">
                                        <span className="text-base font-bold">{itemTitle}</span>
                                        <span className="mt-2 whitespace-pre-line text-xs leading-relaxed">{itemDescription}</span>
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
