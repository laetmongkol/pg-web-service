import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import AppLogo from "@/components/layout/logo";

import SubscribeForm from "./components/subscribe-form";

interface CtaSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const CtaSection = ({ data, language }: CtaSectionProps) => {
    if (!data) return null;

    const background = extractAttributes<PictureAttributes>(data?.bgImg);

    return (
        <section id="cta" className={cn("w-full bg-(--surface-elevated)", "py-16 sm:py-20 lg:py-24")}>
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <div
                    className={cn(
                        "relative overflow-hidden rounded-3xl",
                        // the artwork carries the panel; the colour only shows while it loads
                        "bg-(--surface-page)",
                        "px-6 py-12 sm:px-12 sm:py-16",
                    )}
                >
                    {background?.mediaStorageKey ? (
                        <FillImage
                            src={background.mediaStorageKey}
                            alt={background?.mediaAltText ?? ""}
                            width={background?.width}
                            height={background?.height}
                            draggable={false}
                            wrapperClassName="pointer-events-none absolute inset-0 h-full w-full"
                            className={cn(
                                "h-full w-full object-cover object-right",
                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                            )}
                        />
                    ) : null}

                    {/* the copy sits on the light side of the artwork, so the wash only veils the left */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-linear-to-r from-(--surface-elevated) via-(--surface-elevated)/85 to-(--surface-elevated)/40"
                    />

                    <div className="relative flex flex-col items-start gap-6">
                        {/* the brand PNG is the white mark; darken it for this light panel */}
                        <FadeIn delay={100}>
                            <AppLogo width={140} className="h-10 brightness-0 sm:h-12 dark:brightness-100" />
                        </FadeIn>
                        <FadeIn delay={200}>
                            <h2
                                className={cn(
                                    "font-bold text-balance text-(--text-primary)",
                                    "text-xl leading-snug sm:text-2xl lg:text-3xl",
                                )}
                            >
                                {data?.title?.value}
                            </h2>
                        </FadeIn>
                        <FadeIn delay={300} className="max-w-2xl text-xs text-(--text-secondary) md:text-sm">
                            {data?.description?.value}
                        </FadeIn>
                        <FadeIn delay={400}>
                            <SubscribeForm
                                placeholder={data?.emailPlaceholder?.value ?? ""}
                                submitLabel={data?.submitButton?.value ?? ""}
                                contactHref={`/${language}/${data?.submitButton?.linkUrl ?? ""}`}
                            />
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
