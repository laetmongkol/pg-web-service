import { ArrowUpRight } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface ContactSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const ContactSection = ({ data, language }: ContactSectionProps) => {
    if (!data) return null;

    const picture = extractAttributes<PictureAttributes>(data?.bgImg);

    return (
        <section className="w-full bg-(--surface-page)">
            <FadeIn
                className={cn(
                    "max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
                    "pb-20 lg:pb-28",
                )}
            >
                <div
                    className={cn(
                        "relative overflow-hidden rounded-3xl",
                        "lg:aspect-[5/2]",
                    )}
                >
                    <FillImage
                        src={picture?.mediaStorageKey ?? ""}
                        alt={picture?.mediaAltText ?? ""}
                        sizes="(max-width: 1024px) 100vw, 1152px"
                        wrapperClassName="absolute inset-0"
                        className={cn(
                            "object-cover object-right",
                            BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                        )}
                    />
                    <div
                        aria-hidden
                        className={cn(
                            "absolute inset-0",
                            "bg-(--surface-default)/88",
                            "lg:bg-transparent",
                            "lg:bg-linear-to-r lg:from-(--surface-default) lg:from-20%",
                            "lg:via-(--surface-default)/85 lg:via-55% lg:to-(--surface-default)/20",
                        )}
                    />

                    <div
                        className={cn(
                            "relative flex flex-col items-center justify-center gap-5 text-center",
                            "px-6 py-14 sm:px-10 lg:px-6",
                            "lg:h-full lg:w-1/2 lg:py-0",
                        )}
                    >
                        <h2
                            className={cn(
                                "font-bold text-(--text-primary) leading-tight",
                                "text-xl sm:text-3xl",
                            )}
                        >
                            {data?.title?.value}
                        </h2>
                        <p
                            className={cn(
                                "text-(--text-secondary)",
                                "text-xs sm:text-base",
                                "max-w-md",
                                "whitespace-normal lg:whitespace-pre-line",
                            )}
                        >
                            {data?.description1?.value}
                            <span className="whitespace-nowrap">{data?.descriptionNowrap?.value}</span>
                            {data?.description2?.value}
                        </p>
                        <LinkCustom href={`/${language}/${data?.ctaButton?.linkUrl ?? ""}`} className="w-fit">
                            <span
                                className={cn(
                                    "flex items-center gap-2 rounded-full",
                                    "bg-(--color-primary) text-(--text-invert)",
                                    "px-6 py-3 text-xs font-medium sm:text-base",
                                    "hover:opacity-90 transition-opacity",
                                )}
                            >
                                {data?.ctaButton?.value}
                                <ArrowUpRight className="size-4 sm:size-5" strokeWidth={2} />
                            </span>
                        </LinkCustom>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
};

export default ContactSection;
