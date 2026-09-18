import { convertObjectToArrayByPrefix, convertObjectToValuesByPrefix, extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

interface HistorySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `stat*` — the number itself is the row value. */
interface HistoryStatAttributes {
    title?: string;
    description?: string;
}

const HistorySection = ({ data }: HistorySectionProps) => {
    if (!data) return null;

    const paragraphs = convertObjectToValuesByPrefix(data, "paragraph");
    const stats = convertObjectToArrayByPrefix<HistoryStatAttributes>(data, "stat");
    const picture = extractAttributes<PictureAttributes>(data?.image);

    return (
        <section id="history" className={cn("flex flex-col max-w-7xl mx-auto pt-30 px-6 sm:px-12 md:px-16",
            "pb-16 gap-8"
        )}>
            <FadeIn className={cn(
                "flex flex-col gap-4 items-center",
            )}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide"
                )}>
                    {data?.badge?.value}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {data?.title1?.value}
                    <span className="text-(--color-secondary)">
                        {data?.title2?.value}
                    </span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {data?.subTitle?.value}
                </FadeIn>
            </FadeIn>

            <div className={cn(
                "flex flex-col lg:flex-row gap-8 whitespace-pre-line",
                "items-center"
            )}>
                {/* image caption */}
                <FadeIn delay={200} direction="left" className={cn(
                    "relative rounded-3xl overflow-hidden w-full",
                    "lg:w-1/2"
                )}>
                    <FillImage
                        src={picture?.mediaStorageKey ?? ""}
                        alt={picture?.mediaAltText ?? ""}
                        width={picture?.width}
                        height={picture?.height}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        wrapperClassName="aspect-video lg:aspect-square"
                        className={cn(
                            "object-cover",
                            BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                        )}
                    />
                </FadeIn>

                <FadeIn className={cn(
                    "flex flex-col gap-8 items-center w-full",
                    "lg:items-start lg:w-1/2"
                )}>
                    <h3 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-2xl sm:text-3xl text-center leading-tight",
                        "lg:text-start"
                    )}>
                        {data?.heading1?.value}
                        <span className="block">
                            {data?.heading2?.value}
                        </span>
                    </h3>

                    <FadeIn delay={200} className={cn(
                        "flex flex-col gap-5",
                        "text-(--text-secondary)",
                        "text-base sm:text-lg text-center",
                        "lg:text-start"
                    )}>
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph.key}>{paragraph.value}</p>
                        ))}
                    </FadeIn>

                    <div className={cn(
                        "grid grid-cols-2 md:grid-cols-4 gap-4",
                    )}>
                        {stats.map((item, index) => (
                            <FadeIn key={item.key} delay={index * 150} className="flex flex-col gap-1">
                                <CountUpNumber
                                    value={item.value ?? ""}
                                    className="text-3xl font-bold text-(--color-secondary)"
                                />
                                <span className="text-base font-medium text-(--text-primary)">{item.attributes?.title}</span>
                                <span className="text-xs text-(--text-secondary)">{item.attributes?.description}</span>
                            </FadeIn>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

export default HistorySection;
