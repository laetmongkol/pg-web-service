import { ArrowUpRight, Mouse } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface HeroSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const HeroSection = ({ data, language }: HeroSectionProps) => {
    if (!data) return null;

    const banner = extractAttributes<PictureAttributes>(data?.bgImg);
    const bannerImage = banner?.mediaStorageKey ?? "";
    const bannerAlt = banner?.mediaAltText ?? "Home banner";

    return (
        <section
            className={cn(
                // below lg the frame is a square — a fixed 1080px is far taller than a phone or tablet screen
                "relative mt-(--navbar-height) lg:mt-0 flex aspect-square w-full flex-col lg:aspect-auto lg:h-[1080px]",
                "overflow-hidden bg-(--color-primary)",
            )}
            id="hero"
        >
            <div className="absolute inset-0 hidden w-full lg:block">
                <FillImage
                    src={bannerImage}
                    alt={bannerAlt}
                    width={banner?.width}
                    height={banner?.height}
                    sizes="100vw"
                    wrapperClassName="h-full w-full"
                    className={cn(
                        "h-full w-full object-cover object-right",
                        BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                    )}
                />
            </div>
            <div className="absolute inset-0 block w-full lg:hidden">
                <FillImage
                    src={bannerImage}
                    alt={bannerAlt}
                    width={banner?.width}
                    height={banner?.height}
                    sizes="100vw"
                    wrapperClassName="h-full w-full"
                    className={cn(
                        "h-full w-full object-cover object-center",
                        BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                    )}
                />
            </div>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t sm:bg-gradient-to-r from-(--color-primary)/50 to-transparent" />

            <FadeIn className="absolute inset-0 z-10">
                <div
                    className={cn(
                        "mx-auto grid h-full w-full max-w-screen-2xl",
                        "px-4 sm:px-12 md:px-16",
                    )}
                >
                    <div
                        className={cn(
                            "col-start-1 row-start-1 -mt-16 flex flex-col justify-center gap-4 sm:-mt-24 sm:gap-8",
                            "text-center items-center",
                            "sm:text-start sm:items-start",
                        )}
                    >
                        <span
                            className={cn(
                                "font-light text-(--text-invert) flex flex-wrap items-center justify-center gap-2",
                                "text-xs md:text-sm lg:text-base",
                                "sm:justify-start",
                            )}
                        >
                            <span className="bg-(--color-secondary) size-2 shrink-0 inline-block" />
                            {data?.eyebrow?.value}
                        </span>
                        <h1
                            className={cn(
                                "font-bold leading-snug",
                                "text-xl sm:text-5xl sm:leading-tight xl:text-6xl",
                            )}
                        >
                            <span className="block text-(--text-invert)">
                                {data?.title1?.value}
                            </span>
                            <span className="block text-(--color-secondary)">
                                {data?.title2?.value}
                            </span>
                        </h1>
                        <p
                            className={cn(
                                "text-(--text-invert) whitespace-pre-line",
                                "text-xs md:text-sm lg:text-base",
                            )}
                        >
                            {data?.subTitle?.value}
                        </p>

                        <LinkCustom href={`/${language}/${data?.ctaButton?.linkUrl ?? ""}`} className="w-fit">
                            <span
                                className={cn(
                                    "font-medium text-(--text-invert) flex items-center gap-2",
                                    "bg-(--surface-default)/15 border border-(--surface-default)/12 rounded-full backdrop-blur-xs",
                                    "hover:bg-(--surface-default)/30 hover:scale-105 transition-all duration-300",
                                    "text-sm px-5 py-3 lg:text-base lg:px-6 lg:py-4 xl:text-xl xl:px-8 xl:py-6",
                                )}
                            >
                                {data?.ctaButton?.value}
                                <ArrowUpRight className="inline-block size-6 xl:size-8" />
                            </span>
                        </LinkCustom>
                    </div>

                    <a
                        href="#about-us"
                        className={cn(
                            "col-start-1 row-start-1 self-end",
                            "justify-self-center sm:justify-self-start",
                            "mb-16 flex w-fit flex-col items-center gap-2 sm:mb-24 pb-6 lg:pb-32",
                            "hidden sm:flex",
                            "text-(--text-invert)/75",
                            "text-xs tracking-wide hover:text-(--text-invert) transition-colors",
                        )}
                    >
                        <Mouse className="size-6 animate-bounce" strokeWidth={1.4} />
                        {data?.scrollDown?.value}
                    </a>
                </div>
            </FadeIn>
        </section>
    );
};

export default HeroSection;
