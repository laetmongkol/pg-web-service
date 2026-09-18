import { Mouse } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { renderNowrapText } from "@/lib/ui/text-utils";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

interface BannerSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const BannerSection = ({ data }: BannerSectionProps) => {
    if (!data) return null;

    const banner = extractAttributes<PictureAttributes>(data?.bgImg);
    const bannerImage = banner?.mediaStorageKey ?? "";
    const bannerAlt = banner?.mediaAltText ?? "Contact Us banner";

    return (
        <section
            className={cn(
                // below lg the frame is a square — a fixed 1080px is far taller than a phone or tablet screen
                "relative mt-(--navbar-height) lg:mt-0 flex aspect-square w-full flex-col lg:aspect-auto lg:h-[1080px]",
                "overflow-hidden bg-(--color-primary)",
            )}
            id="banner"
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
                    priority
                    className={cn(
                        "h-full w-full object-cover object-center",
                        BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                    )}
                />
            </div>

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
                            <span className="text-(--color-secondary)">{data?.title1?.value}</span>
                            <span className="text-(--text-invert)">{data?.title2?.value}</span>
                        </h1>
                        <p
                            className={cn(
                                "text-(--text-invert)/80",
                                "text-xs sm:text-sm lg:text-base",
                                "max-w-sm",
                            )}
                        >
                            {renderNowrapText(data?.description?.value)}
                        </p>
                    </div>
                    <a
                        href="#contact-us-content"
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

export default BannerSection;
