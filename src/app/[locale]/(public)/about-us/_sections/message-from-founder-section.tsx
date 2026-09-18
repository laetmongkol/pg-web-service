import { convertObjectToValuesByPrefix, extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

interface MessageFromFounderSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const MessageFromFounderSection = ({ data }: MessageFromFounderSectionProps) => {
    if (!data) return null;

    const paragraphs = convertObjectToValuesByPrefix(data, "paragraph");
    const picture = extractAttributes<PictureAttributes>(data?.image);

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16",
        )}>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
                <FadeIn className={cn(
                    "flex flex-col gap-6",
                    "items-center text-center",
                    "lg:w-1/2 lg:items-start lg:text-start",
                )}>
                    <FadeIn delay={100} className={cn(
                        "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                        "text-xs tracking-wide",
                    )}>
                        {data?.badge?.value}
                    </FadeIn>

                    <h2 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl leading-tight",
                    )}>
                        {data?.title1?.value}
                        <span className="text-(--color-secondary)">{data?.title2?.value}</span>
                    </h2>

                    <FadeIn delay={200} className={cn(
                        "flex flex-col gap-5",
                        "text-(--text-secondary)",
                        "text-sm sm:text-base leading-relaxed",
                    )}>
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph.key}>{paragraph.value}</p>
                        ))}
                    </FadeIn>

                    <FadeIn delay={300} className="flex flex-col gap-1">
                        <span className="font-bold text-(--text-primary)">{data?.founderName?.value}</span>
                        <span className="text-sm text-(--text-secondary)">{data?.founderRole?.value}</span>
                    </FadeIn>
                </FadeIn>

                <FadeIn direction="right" delay={200} className="w-full overflow-hidden rounded-3xl lg:w-1/2">
                    <FillImage
                        src={picture?.mediaStorageKey ?? ""}
                        alt={picture?.mediaAltText ?? ""}
                        width={picture?.width}
                        height={picture?.height}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        draggable={false}
                        wrapperClassName="aspect-4/3 w-full"
                        className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                    />
                </FadeIn>
            </div>
        </section>
    );
};

export default MessageFromFounderSection;
