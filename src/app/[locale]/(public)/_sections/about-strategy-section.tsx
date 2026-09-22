import {
    convertObjectToArrayByPrefix,
    extractAttributes,
    PictureAttributes,
} from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

/** attributes on `stat*` — the number itself is the row value. */
interface StatAttributes {
    label?: string;
}

interface AboutStrategySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const AboutStrategySection = ({ data }: AboutStrategySectionProps) => {
    if (!data) return null;

    const stats = convertObjectToArrayByPrefix<StatAttributes>(data, "stat");
    const office = extractAttributes<PictureAttributes>(data?.officeImg);

    return (
        <section
            id="about-us"
            className={cn("w-full bg-(--surface-default)", "py-16 sm:py-20 lg:py-24")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                {/* one rounded panel: copy and stats on top, the photo bleeding to its bottom edge */}
                <div
                    className={cn(
                        "flex flex-col items-center overflow-hidden rounded-3xl bg-(--surface-page)",
                        "px-4 pt-12 sm:px-10 sm:pt-16",
                    )}
                >
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full",
                                "border border-(--border-default) bg-(--surface-elevated)",
                                "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                            )}
                        >
                            <span className="bg-(--text-primary) size-1.5 shrink-0 rounded-full" />
                            {data?.badge?.value}
                        </span>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <h2
                            className={cn(
                                "mt-8 text-center font-bold text-balance text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {data?.title?.value}
                        </h2>
                    </FadeIn>

                    <FadeIn
                        delay={200}
                        className={cn(
                            "mt-8 max-w-5xl text-center whitespace-pre-line text-(--text-secondary)",
                            "text-xs leading-loose md:text-sm",
                        )}
                    >
                        {data?.description?.value}
                    </FadeIn>

                    <dl className="mt-12 grid w-full grid-cols-2 gap-8 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <FadeIn
                                key={stat.key}
                                delay={300 + index * 100}
                                className="flex flex-col items-center gap-2 text-center"
                            >
                                <dt className="sr-only">{stat.attributes?.label}</dt>
                                <dd className="flex flex-col items-center gap-2">
                                    <CountUpNumber
                                        value={stat.value}
                                        className={cn(
                                            "font-bold text-(--text-primary)",
                                            "text-2xl sm:text-3xl lg:text-4xl",
                                        )}
                                    />
                                    <span className="text-xs text-(--text-secondary)">
                                        {stat.attributes?.label}
                                    </span>
                                </dd>
                            </FadeIn>
                        ))}
                    </dl>

                    {office?.mediaStorageKey ? (
                        <FadeIn delay={700} className="mt-12 w-full">
                            <FillImage
                                src={office.mediaStorageKey}
                                alt={office?.mediaAltText ?? ""}
                                width={office?.width}
                                height={office?.height}
                                wrapperClassName="w-full overflow-hidden rounded-t-2xl"
                                className={cn(
                                    "h-[220px] w-full object-cover sm:h-[360px] lg:h-[460px]",
                                    BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                                )}
                            />
                        </FadeIn>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default AboutStrategySection;
