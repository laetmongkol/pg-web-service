import { ArrowUpRight } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

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
            "py-16"
        )}>
            <div className="relative overflow-hidden rounded-3xl">
                <FillImage
                    src={picture?.mediaStorageKey ?? ""}
                    alt={picture?.mediaAltText ?? ""}
                    width={picture?.width}
                    height={picture?.height}
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    wrapperClassName="aspect-4/3 sm:aspect-16/9 lg:aspect-[21/8] w-full"
                    className="h-full w-full object-cover"
                />
                {/* the art is light on the left, so the copy side needs its own scrim */}
                <div className="absolute inset-0 bg-gradient-to-r from-(--color-primary-900)/70 via-(--color-primary-900)/60 to-(--color-primary-900)/85" />
                <div className="absolute inset-0 flex justify-center gap-6 grid grid-cols-1 lg:grid-cols-3">

                    <span className="hidden lg:block lg:col-span-1" />

                    <div className={cn("flex flex-col justify-center gap-6 lg:col-span-2",
                        "items-center text-center px-6 py-10",
                        "sm:px-12 lg:pr-16"
                    )}>
                        <FadeIn delay={100} className="flex flex-col gap-14 items-center text-center">
                            <h2 className={cn("font-bold text-(--text-invert)",
                                "text-2xl sm:text-3xl lg:text-4xl leading-relaxed"
                            )}>
                                {data?.title1?.value}
                                <p>{data?.title2?.value}</p>
                            </h2>
                            <div className="flex flex-col gap-6 items-center text-center">
                                <FadeIn delay={200} className={cn("hidden items-center gap-3 lg:flex",
                                    "text-(--text-invert)/70 text-xs tracking-[0.25em]"
                                )}>
                                    <span aria-hidden className="h-px w-10 bg-(--text-invert)/40" />
                                    {data?.caption?.value}
                                    <span aria-hidden className="h-px w-10 bg-(--text-invert)/40" />
                                </FadeIn>

                                <LinkCustom href={`/${language}/${data?.ctaButton?.linkUrl ?? ""}`} className="w-fit">
                                    <FadeIn delay={300} className={cn(
                                        "font-medium text-(--text-invert) flex items-center gap-2",
                                        "bg-(--surface-default)/15 border border-(--surface-default)/30 rounded-full backdrop-blur-xs",
                                        "hover:bg-(--surface-default)/30 hover:scale-105 transition-all duration-300",
                                        "text-base px-8 py-3"
                                    )}>
                                        {data?.ctaButton?.value}
                                        <ArrowUpRight className="size-5 inline-block" />
                                    </FadeIn>
                                </LinkCustom>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
