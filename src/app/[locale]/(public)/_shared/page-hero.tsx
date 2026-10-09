import { ArrowUpRight } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import HeroBackdrop from "./hero-backdrop";

export const HERO_CTA_PRIMARY_CLASSNAME = cn(
    "inline-flex items-center justify-center gap-3 rounded-full px-8 py-3.5",
    "bg-(--button-on-dark) text-sm font-medium text-(--button-text) sm:text-base",
    "shadow-[var(--shadow-lg)]",
    BUTTON_SCALE_CLASSNAME,
);

export const HERO_CTA_SECONDARY_CLASSNAME = cn(
    "inline-flex items-center justify-center px-1 py-3.5",
    "text-sm font-medium text-(--text-body-on-dark) underline underline-offset-4 sm:text-base",
    "decoration-(--text-muted-on-dark) transition-colors hover:text-(--text-on-dark) hover:decoration-(--text-on-dark)",
);

interface PageHeroProps {
    /** The page's `hero` section — data?.eyebrow?.value, title1, title2, data?.description?.value, ctaPrimary, ctaSecondary, heroImg. */
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/**
 * Inner-page hero (about / services / contact): "• eyebrow", gradient headline, copy, CTAs and a
 * 3D illustration sitting on the glow at the bottom of the card. A button row without a value
 * (e.g. contact has no CTA) is simply not rendered.
 */
const PageHero = ({ data, language }: PageHeroProps) => {
    if (!data) return null;

    const titleLines = [data?.title1?.value, data?.title2?.value].filter(Boolean);
    const heroPictureAttributes = extractAttributes<PictureAttributes>(data?.heroImg);

    return (
        // 16:8 stays the target height (as a min-height: card width ÷ 2, capped at 1080px), but the card
        // may grow past it when the copy + a usable illustration don't fit — e.g. iPad Pro landscape,
        // where 16:8 of 1032px is only ~500px and the illustration was squeezed to nothing.
        <HeroBackdrop cardClassName="lg:aspect-auto lg:min-h-[min(calc((100vw-2rem)/2),1080px)]">
            <div className="flex flex-1 flex-col items-center px-4 pt-[calc(var(--navbar-height)+2.5rem)] text-center sm:px-8 lg:pt-[calc(var(--navbar-height)+3.5rem)]">
                <FadeIn className="flex items-center gap-2.5 text-sm text-(--text-on-dark) sm:text-base">
                    <span aria-hidden className="size-1.5 rounded-full bg-(--surface-card)" />
                    {data?.eyebrow?.value}
                </FadeIn>

                <FadeIn delay={100}>
                    <h1
                        className={cn(
                            "mt-5 max-w-4xl font-bold",
                            "bg-[image:var(--gradient-heading-on-dark)] bg-clip-text text-transparent",
                            "text-3xl leading-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.25]",
                        )}
                    >
                        {titleLines.map((line) => (
                            <span key={line} className="block">
                                {line}
                            </span>
                        ))}
                    </h1>
                </FadeIn>

                <FadeIn
                    delay={200}
                    className="mt-5 max-w-3xl whitespace-pre-line text-xs leading-relaxed text-(--text-body-on-dark) sm:text-sm"
                >
                    {data?.description?.value}
                </FadeIn>

                {data?.ctaPrimary?.value || data?.ctaSecondary?.value ? (
                    <FadeIn delay={300} className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                        {data?.ctaPrimary?.value ? (
                            <LinkCustom
                                href={`/${language}/${data?.ctaPrimary?.linkUrl}`}
                                className={HERO_CTA_PRIMARY_CLASSNAME}
                            >
                                {data?.ctaPrimary?.value}
                                <ArrowUpRight size={20} strokeWidth={2} aria-hidden />
                            </LinkCustom>
                        ) : null}
                        {data?.ctaSecondary?.value ? (
                            <LinkCustom
                                href={`/${language}/${data?.ctaSecondary?.linkUrl}`}
                                className={HERO_CTA_SECONDARY_CLASSNAME}
                            >
                                {data?.ctaSecondary?.value}
                            </LinkCustom>
                        ) : null}
                    </FadeIn>
                ) : null}

                {/* the illustration takes whatever height is left and sits on the bottom glow */}
                <FadeIn
                    delay={400}
                    className="relative mt-8 aspect-[16/10] w-full max-w-2xl sm:aspect-[16/9] lg:mt-6 lg:aspect-auto lg:min-h-[18rem] lg:flex-1 xl:min-h-[12rem]"
                >
                    <FillImage
                        src={heroPictureAttributes?.mediaStorageKey ?? ""}
                        alt={heroPictureAttributes?.mediaAltText ?? ""}
                        priority
                        sizes="(max-width: 1024px) 90vw, 720px"
                        wrapperClassName="absolute inset-0"
                        className="object-contain object-bottom"
                    />
                </FadeIn>
            </div>
        </HeroBackdrop>
    );
};

export default PageHero;
