import { ArrowDown } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

interface HeroSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const HeroSection = ({ data }: HeroSectionProps) => {
    if (!data) return null;

    const banner = extractAttributes<PictureAttributes>(data?.bgImg);
    const bannerImage = banner?.mediaStorageKey ?? "";
    const bannerAlt = banner?.mediaAltText ?? "About us banner";

    return (
        <section
            id="hero"
            className={cn(
                "relative flex w-full flex-col",
                "bg-(--surface-page)",
                "lg:max-h-[1080px] aspect-4/5 lg:aspect-[16/8] pt-(--navbar-height)",
            )}
        >
            <div className="absolute inset-0 w-full">
                <FillImage
                    src={bannerImage}
                    alt={bannerAlt}
                    width={banner?.width}
                    height={banner?.height}
                    priority
                    wrapperClassName="h-full w-full"
                    className={cn(
                        "h-full w-full object-cover",
                        "object-[80%_center] lg:object-center",
                        BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                    )}
                />
            </div>
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 z-1",
                    "bg-gradient-to-b from-(--color-primary)/45 via-(--color-primary)/15 to-(--color-primary)/45",
                )}
            />

            <FadeIn className="absolute inset-0 z-10">
                <div
                    className={cn(
                        "mx-auto grid h-full w-full max-w-screen-2xl",
                        "px-4 sm:px-12 md:px-16",
                    )}
                >
                    <div
                        className={cn(
                            "col-start-1 row-start-1 flex flex-col items-center justify-center text-center",
                            "gap-4 sm:gap-6",
                        )}
                    >
                        <span
                            className={cn(
                                "font-light tracking-wide text-(--text-invert)",
                                "text-xs md:text-sm lg:text-base",
                            )}
                        >
                            {data?.eyebrow?.value}
                        </span>
                        <h1
                            className={cn(
                                "font-bold text-(--text-invert) text-balance",
                                "text-2xl leading-snug sm:text-4xl sm:leading-tight lg:text-5xl xl:text-6xl",
                            )}
                        >
                            <span className="block">{data?.title1?.value}</span>
                            <span className="block">{data?.title2?.value}</span>
                        </h1>
                        <p
                            className={cn(
                                "text-(--text-invert)/85",
                                "text-xs leading-relaxed md:text-sm",
                            )}
                        >
                            {data?.subTitle?.value}
                        </p>
                    </div>

                    <a
                        href="#our-history"
                        className={cn(
                            "col-start-1 row-start-1 self-end justify-self-center",
                            "hidden w-fit flex-col items-center gap-2 pb-10 lg:flex lg:pb-14",
                            "text-(--text-invert)/75 hover:text-(--text-invert) transition-colors",
                            "text-xs tracking-wide",
                        )}
                    >
                        <span className="flex h-8 w-5.5 items-center justify-center rounded-full border border-current">
                            <ArrowDown className="size-3.5 animate-bounce" strokeWidth={1.5} />
                        </span>
                        {data?.scrollDown?.value}
                    </a>
                </div>
            </FadeIn>
        </section>
    );
};

export default HeroSection;
