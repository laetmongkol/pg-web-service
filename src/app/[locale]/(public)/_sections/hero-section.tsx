import { ArrowUpRight } from "lucide-react";
import { Montserrat } from "next/font/google";

import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import LinkCustom from "@/components/link-custom.component";

import HeroBackdrop from "../_shared/hero-backdrop";
import { HERO_CTA_PRIMARY_CLASSNAME, HERO_CTA_SECONDARY_CLASSNAME } from "../_shared/page-hero";

// Watermark face — closest match to the design's wide geometric lettering.
const watermarkFont = Montserrat({ subsets: ["latin"], weight: "600", display: "swap" });

interface HeroSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const HeroSection = ({ data, language }: HeroSectionProps) => {
    if (!data) return null;

    return (
        <HeroBackdrop
            cardClassName="min-h-[36rem] aspect-[3/4] sm:aspect-[4/3]"
            decoration={
                <>
                    {/* Outline watermark. Drawn with an SVG filter (dilate − original) instead of
                        -webkit-text-stroke: variable fonts have overlapping contours inside each
                        glyph, and text-stroke traces those as stray lines. */}
                    <svg aria-hidden className="absolute size-0">
                        <filter id="hero-watermark-outline">
                            <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="grown" />
                            <feComposite in="grown" in2="SourceAlpha" operator="out" result="edge" />
                            <feFlood style={{ floodColor: "var(--text-on-dark)" }} floodOpacity="0.5" />
                            <feComposite in2="edge" operator="in" result="stroke" />
                            <feFlood style={{ floodColor: "var(--text-on-dark)" }} floodOpacity="0.08" />
                            <feComposite in2="SourceAlpha" operator="in" result="fill" />
                            <feMerge>
                                <feMergeNode in="fill" />
                                <feMergeNode in="stroke" />
                            </feMerge>
                        </filter>
                    </svg>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex select-none justify-center overflow-hidden"
                    >
                        <span
                            className={cn(
                                watermarkFont.className,
                                "translate-y-[16%] whitespace-nowrap tracking-[0.04em]",
                                "text-[clamp(2rem,10.6vw,12rem)] leading-none text-(--text-on-dark)",
                                "[filter:url(#hero-watermark-outline)]",
                            )}
                        >
                            PIP EVOLUTION
                        </span>
                    </div>
                </>
            }
        >
            <div
                className={cn(
                    "mx-auto flex w-full flex-1 flex-col items-center justify-center p-4 text-center sm:p-8",
                )}
            >
                <FadeIn delay={100}>
                    <h1
                        className={cn(
                            "max-w-4xl font-bold",
                            "bg-[image:var(--gradient-heading-on-dark)] bg-clip-text text-transparent",
                            "text-3xl leading-tight sm:text-5xl lg:text-6xl lg:leading-[1.15]",
                        )}
                    >
                        <span className="block">{data?.title1?.value}</span>
                        <span className="block">{data?.title2?.value}</span>
                    </h1>
                </FadeIn>

                <FadeIn
                    delay={200}
                    className={cn("mt-5 max-w-md whitespace-pre-line text-(--text-body-on-dark)", "text-sm leading-relaxed sm:text-base")}
                >
                    {data?.description?.value}
                </FadeIn>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                    <FadeIn delay={300}>
                        <LinkCustom
                            href={`/${language}/${data?.ctaPrimary?.linkUrl}`}
                            className={HERO_CTA_PRIMARY_CLASSNAME}
                        >
                            {data?.ctaPrimary?.value}
                            <ArrowUpRight size={18} strokeWidth={2.25} aria-hidden />
                        </LinkCustom>
                    </FadeIn>
                    <FadeIn delay={400}>
                        <LinkCustom
                            href={`/${language}/${data?.ctaSecondary?.linkUrl}`}
                            className={HERO_CTA_SECONDARY_CLASSNAME}
                        >
                            {data?.ctaSecondary?.value}
                        </LinkCustom>
                    </FadeIn>
                </div>
            </div>
        </HeroBackdrop>
    );
};

export default HeroSection;
