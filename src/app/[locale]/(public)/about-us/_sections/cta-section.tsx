import { ArrowUpRight } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface CtaSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const CtaSection = ({ data, language }: CtaSectionProps) => {
    if (!data) return null;

    const picture = extractAttributes<PictureAttributes>(data?.bgImg);

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16",
        )}>
            <div className="relative overflow-hidden rounded-3xl">
                <FillImage
                    src={picture?.mediaStorageKey ?? ""}
                    alt={picture?.mediaAltText ?? ""}
                    width={picture?.width}
                    height={picture?.height}
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    draggable={false}
                    wrapperClassName="aspect-4/3 sm:aspect-16/9 lg:aspect-[21/9] w-full"
                    className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                />
                {/* the art is light on the left, so the copy side needs its own scrim */}
                <div className="absolute inset-0" />

                <div className={cn(
                    "absolute inset-0 grid grid-cols-1 lg:grid-cols-2",
                )}>
                    <span aria-hidden className="hidden lg:block" />

                    <FadeIn delay={100} className={cn(
                        "flex flex-col justify-center gap-5",
                        "items-center text-center p-5",
                    )}>
                        <h2 className={cn(
                            "font-bold text-(--text-invert)",
                            "text-2xl sm:text-3xl lg:text-4xl leading-tight",
                        )}>
                            {data?.title?.value}
                        </h2>

                        <FadeIn delay={200} className="text-sm text-(--text-invert) sm:text-base">
                            {data?.subTitle?.value}
                        </FadeIn>

                        <LinkCustom href={`/${language}/${data?.ctaButton?.linkUrl ?? ""}`} className="w-fit">
                            <FadeIn delay={300} className={cn(
                                "font-medium text-(--text-invert) flex items-center gap-2",
                                "bg-(--surface-default)/15 border border-(--surface-default)/30 rounded-full backdrop-blur-xs",
                                "hover:bg-(--surface-default)/30 hover:scale-105 transition-all duration-300",
                                "text-base px-8 py-3",
                            )}>
                                {data?.ctaButton?.value}
                                <ArrowUpRight className="size-5 inline-block" />
                            </FadeIn>
                        </LinkCustom>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
