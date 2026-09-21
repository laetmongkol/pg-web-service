import { ArrowDown } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import SparkleDecoration, { type SparkleSpec } from "./components/sparkle-decoration";

const EYEBROW = "Sriwilai Bangkok";
const TITLE_LINE_1 = "พาธุรกิจของคุณ";
const TITLE_LINE_2 = "ไปข้างหน้าอย่างมั่นคง";
const DESCRIPTION =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus imperdiet sed id elementum. Quam vel aliquam sit vulputate. Faucibus nec gravida ipsum.";

const SECONDARY_CTA = { label: "ดูบริการของเรา", path: "services" };
const PRIMARY_CTA = { label: "ติดต่อปรึกษา", path: "contact-us" };

const SCROLL_HINT = "Scroll Down to explore";
/** The next section down — the anchor the scroll hint jumps to. */
const SCROLL_TARGET = "#trusted-partner";

/**
 * Optional cut-out figure under the copy (the walking person in the design). Left empty until the
 * artwork is uploaded: the hero keeps its proportions either way, it just loses the figure.
 */
const FIGURE_IMAGE = "/api/app/image/contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png";
const FIGURE_ALT = "Sriwilai consultant";
const FIGURE_WIDTH = 420;
const FIGURE_HEIGHT = 560;

const SPARKLES: SparkleSpec[] = [
    { className: "left-[8%] top-[14%]", size: 18 },
    { className: "left-[38%] top-[8%]", size: 22 },
    { className: "right-[12%] top-[20%]", size: 16 },
    { className: "left-[10%] bottom-[16%]", size: 24 },
    { className: "right-[8%] bottom-[12%]", size: 28 },
];

const CTA_BASE_CLASSNAME = cn(
    "flex items-center justify-center rounded-full px-8 py-3.5",
    "text-sm font-medium transition-transform duration-300 hover:scale-105",
);

interface HeroSectionProps {
    language: string;
}

const HeroSection = ({ language }: HeroSectionProps) => {
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
                        <span className="text-xs text-(--text-secondary) md:text-sm">{EYEBROW}</span>
                    </FadeIn>
                    <FadeIn delay={100}>
                        <h1
                            className={cn(
                                "mt-6 font-bold text-balance text-(--text-primary)",
                                "text-3xl leading-tight sm:text-5xl lg:text-6xl lg:leading-[1.15]",
                            )}
                        >
                            <span className="block">{TITLE_LINE_1}</span>
                            <span className="block">{TITLE_LINE_2}</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={200}
                        className={cn(
                            "mt-8 text-(--text-secondary)",
                            "text-xs leading-relaxed md:text-sm",
                        )}
                    >
                        {DESCRIPTION}
                    </FadeIn>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <FadeIn delay={300}>
                            <LinkCustom
                                href={`/${language}/${SECONDARY_CTA.path}`}
                                className={cn(
                                    CTA_BASE_CLASSNAME,
                                    "border border-(--border-strong) bg-(--surface-elevated) text-(--text-primary)",
                                )}
                            >

                                {SECONDARY_CTA.label}
                            </LinkCustom>
                        </FadeIn>
                        <FadeIn delay={400}>
                            <LinkCustom
                                href={`/${language}/${PRIMARY_CTA.path}`}
                                className={cn(CTA_BASE_CLASSNAME, "bg-(--text-primary) text-(--text-invert)")}
                            >
                                {PRIMARY_CTA.label}
                            </LinkCustom>
                        </FadeIn>
                    </div>

                    {FIGURE_IMAGE ? (
                        // mt-auto belongs on the flex child itself — the FadeIn wrapper is that
                        // child now, so parking it here is what pushes the figure back to the
                        // bottom of the leftover space, just above the scroll hint
                        <FadeIn delay={500} className="mt-auto w-[200px] pt-12 sm:w-[280px]">
                            <FillImage
                                src={FIGURE_IMAGE}
                                alt={FIGURE_ALT}
                                width={FIGURE_WIDTH}
                                height={FIGURE_HEIGHT}
                                sizes="(max-width: 640px) 200px, 280px"
                                wrapperClassName="w-full"
                                className={cn("h-auto w-full object-contain", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
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
                            <span
                                className={cn(
                                    "flex size-7 items-center justify-center rounded-full",
                                    "border border-(--border-strong)",
                                )}
                            >
                                <ArrowDown className="size-3.5 animate-bounce" strokeWidth={1.6} />
                            </span>
                        </FadeIn>
                        <FadeIn delay={700}>
                            {SCROLL_HINT}
                        </FadeIn>
                    </a>
                </div>
            </div>
        </section >
    );
};

export default HeroSection;
