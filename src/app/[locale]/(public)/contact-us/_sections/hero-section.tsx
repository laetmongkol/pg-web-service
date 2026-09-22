import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

interface HeroSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const HeroSection = ({ data }: HeroSectionProps) => {
    if (!data) return null;

    const banner = extractAttributes<PictureAttributes>(data?.bgImg);

    return (
        <section
            id="hero"
            className={cn(
                "relative flex w-full flex-col overflow-hidden",
                // the radial wash in the design: page grey at the rim, near-white in the middle
                "bg-(--surface-page)",
                "lg:max-h-[1080px] aspect-square lg:aspect-[16/8] pt-(--navbar-height)",
            )}
        >
            {banner?.mediaStorageKey ? (
                <FillImage
                    src={banner.mediaStorageKey}
                    alt={banner?.mediaAltText ?? ""}
                    width={banner?.width}
                    height={banner?.height}
                    priority
                    wrapperClassName="absolute inset-0 h-full w-full"
                    className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                />
            ) : null}

            {/* the copy sits over a photo, so it carries its own contrast rather than relying on one */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-(--color-primary-400)/55"
            />

            <div className="absolute inset-0 z-10 flex">
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center",
                        "px-4 pt-(--navbar-height) sm:px-8",
                    )}
                >
                    <FadeIn>
                        <span className="text-xs text-(--text-invert)/80 md:text-sm">
                            {data?.eyebrow?.value}
                        </span>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <h1
                            className={cn(
                                "mt-4 font-bold text-balance text-(--text-invert)",
                                "text-3xl leading-tight sm:text-5xl lg:text-6xl",
                            )}
                        >
                            {data?.title?.value}
                        </h1>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <p
                            className={cn(
                                "mt-6 max-w-2xl text-(--text-invert)/85",
                                "text-xs leading-relaxed md:text-sm",
                            )}
                        >
                            {data?.description?.value}
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
