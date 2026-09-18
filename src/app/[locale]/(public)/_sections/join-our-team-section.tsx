import { ArrowUpRight } from "lucide-react";

import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import LinkCustom from "@/components/link-custom.component";

import JoinOurTeamVideo from "./components/join-our-team-video";

interface JoinOurTeamSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `benefit*` — the benefit title is the row value. */
interface BenefitAttributes {
    description?: string;
}

const JoinOurTeamSection = ({ data, language }: JoinOurTeamSectionProps) => {
    if (!data) return null;

    const benefits = convertObjectToArrayByPrefix<BenefitAttributes>(data, "benefit");

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16"
        )}>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
                <JoinOurTeamVideo className="lg:w-1/2" />

                <FadeIn className={cn("flex flex-col gap-6",
                    "items-center text-center",
                    "lg:w-1/2 lg:items-start lg:text-start"
                )}>
                    <FadeIn delay={100} className={cn(
                        "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                    )}>
                        {data?.badge?.value}
                    </FadeIn>

                    <h2 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl leading-tight"
                    )}>
                        {data?.title1?.value}
                        <span className="text-(--color-secondary)">
                            {data?.title2?.value}
                        </span>
                        <p>{data?.title3?.value}</p>
                    </h2>

                    <FadeIn delay={200} className={cn(
                        "text-(--text-secondary)",
                        "text-base sm:text-lg"
                    )}>
                        {data?.description?.value}
                    </FadeIn>

                    <FadeIn direction="right" delay={300} className="grid w-full gap-6 sm:grid-cols-2 sm:gap-x-8">
                        {benefits.map((benefit, index) => (
                            <FadeIn delay={index * 150} key={benefit.key} className="flex flex-row items-start gap-4 text-start">
                                <span className="text-xl font-bold text-(--color-secondary) tabular-nums">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="flex flex-col gap-1">
                                    <span className="font-bold text-(--text-primary)">
                                        {benefit.value}
                                    </span>
                                    <span className="text-sm text-(--text-secondary) leading-relaxed">
                                        {benefit.attributes?.description}
                                    </span>
                                </span>
                            </FadeIn>
                        ))}
                    </FadeIn>

                    <FadeIn delay={400} className="w-fit">
                        <LinkCustom href={`/${language}/${data?.ctaButton?.linkUrl ?? ""}`} className="w-fit">
                            <span className={cn(
                                "font-medium text-(--text-invert) flex items-center gap-2",
                                "bg-(--color-secondary) rounded-full",
                                "hover:scale-105 transition-transform duration-300",
                                "text-base px-8 py-3"
                            )}>
                                {data?.ctaButton?.value}
                                <ArrowUpRight className="size-5 inline-block" />
                            </span>
                        </LinkCustom>
                    </FadeIn>
                </FadeIn>
            </div>
        </section>
    );
};

export default JoinOurTeamSection;
