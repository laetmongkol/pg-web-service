import { ArrowDown } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import SparkleDecoration, { type SparkleSpec } from "./components/sparkle-decoration";

/** The next section down — the anchor the scroll hint jumps to. */
const SCROLL_TARGET = "#trusted-partner";

const SPARKLES: SparkleSpec[] = [
    { className: "left-[8%] top-[14%] animate-pulse [animation-duration:3s] [animation-delay:-0.8s]", size: 18 },
    { className: "left-[38%] top-[8%] animate-pulse [animation-duration:3s] [animation-delay:-0.6s]", size: 22 },
    { className: "right-[12%] top-[20%] animate-pulse [animation-duration:3s] [animation-delay:-0.4s]", size: 16 },
    { className: "left-[10%] bottom-[16%] animate-pulse [animation-duration:3s] [animation-delay:-0.2s]", size: 24 },
    { className: "right-[8%] bottom-[12%] animate-pulse [animation-duration:3s] [animation-delay:0s]", size: 28 },
];

const CTA_BASE_CLASSNAME = cn(
    "flex items-center justify-center rounded-full px-8 py-3.5",
    "text-sm font-medium transition-transform! duration-180! hover:scale-110",
);

interface HeroSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const HeroSection = ({ data, language }: HeroSectionProps) => {
    if (!data) return null;

    const figure = extractAttributes<PictureAttributes>(data?.figureImg);
    const figureImage = figure?.mediaStorageKey ?? "";

    return (
        <section
            id="hero"
            className={cn(
                "relative flex w-full flex-col",
                // the radial wash in the design: page grey at the rim, near-white in the middle
                "bg-(--surface-page)",
                "lg:max-h-[1080px] aspect-square lg:aspect-[16/8] pt-(--navbar-height)",
            )}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-radial-[at_50%_35%] from-(--surface-elevated) via-(--surface-elevated) to-(--surface-page) to-90%"
            />
            <SparkleDecoration sparkles={SPARKLES} />

            <div className="relative z-10 flex flex-1 flex-col">
                <div
                    className={cn(
                        "mx-auto flex w-full flex-1 flex-col items-center text-center",
                        "px-4 py-16 sm:px-8 sm:py-20",
                    )}
                >
                    <FadeIn>
                        <span className="text-xs text-(--text-secondary) md:text-sm">
                            {data?.eyebrow?.value}
                        </span>
                    </FadeIn>
                    <FadeIn delay={100}>
                        <h1
                            className={cn(
                                "mt-6 font-bold text-balance text-(--text-primary)",
                                "text-3xl leading-tight sm:text-5xl lg:text-6xl lg:leading-[1.15]",
                            )}
                        >
                            <span className="block">{data?.title1?.value}</span>
                            <span className="block">{data?.title2?.value}</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={200}
                        className={cn(
                            "mt-8 text-(--text-secondary)",
                            "text-xs leading-relaxed md:text-sm",
                        )}
                    >
                        {data?.description?.value}
                    </FadeIn>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <FadeIn delay={300}>
                            <LinkCustom
                                href={`/${language}/${data?.ctaSecondary?.linkUrl ?? ""}`}
                                className={cn(
                                    CTA_BASE_CLASSNAME,
                                    "border border-(--border-strong) bg-(--surface-elevated) text-(--text-primary)",
                                )}
                            >
                                {data?.ctaSecondary?.value}
                            </LinkCustom>
                        </FadeIn>
                        <FadeIn delay={400}>
                            <LinkCustom
                                href={`/${language}/${data?.ctaPrimary?.linkUrl ?? ""}`}
                                className={cn(CTA_BASE_CLASSNAME, "bg-(--text-primary) text-(--text-invert)")}
                            >
                                {data?.ctaPrimary?.value}
                            </LinkCustom>
                        </FadeIn>
                    </div>

                    {figureImage ? (
                        // mt-auto belongs on the flex child itself — the FadeIn wrapper is that
                        // child now, so parking it here is what pushes the figure back to the
                        // bottom of the leftover space, just above the scroll hint
                        <FadeIn delay={500} className="mt-auto w-30 pt-12 sm:w-30">
                            <FillImage
                                src={figureImage}
                                alt={figure?.mediaAltText ?? ""}
                                width={figure?.width}
                                height={figure?.height}
                                wrapperClassName="w-full"
                                className={cn("h-auto w-30 object-contain rotate-y-180", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                                unoptimized
                            />
                        </FadeIn>
                    ) : (
                        // keeps the spacing while the figure is missing
                        <div aria-hidden className="mt-auto h-24 pt-12 sm:h-32" />
                    )}

                    <a
                        href={SCROLL_TARGET}
                        className={cn(
                            "mt-6 flex flex-col items-center gap-2",
                            "text-[11px] tracking-wide text-(--text-secondary)",
                            "transition-colors hover:text-(--text-primary)",
                        )}
                    >
                        <FadeIn delay={600}>
                            <span className="flex h-8 w-5.5 items-center justify-center rounded-full border border-current">
                                <ArrowDown className="size-3.5 animate-bounce" strokeWidth={1.5} />
                            </span>
                        </FadeIn>
                        <FadeIn delay={700}>
                            {data?.scrollDown?.value}
                        </FadeIn>
                    </a>
                </div>
            </div>
        </section >
    );
};

export default HeroSection;
