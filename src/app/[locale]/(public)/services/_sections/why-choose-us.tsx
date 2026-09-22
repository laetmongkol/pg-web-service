import {
    ChartNoAxesColumn,
    Sparkles,
    SquareCheckBig,
    Target,
    type LucideIcon,
} from "lucide-react";

import {
    convertObjectToArrayByPrefix,
    extractAttributes,
    PictureAttributes,
} from "@/lib/cms/content-attributes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

/** attributes on `reason*` — the reason title is the row value. */
interface ReasonAttributes {
    icon?: string;
    body?: string;
}

/** Icons stay in code: a CMS row carries the key, never the component. */
const REASON_ICONS: Record<string, LucideIcon> = {
    Target,
    Sparkles,
    ChartNoAxesColumn,
    SquareCheckBig,
};

interface Reason {
    Icon: LucideIcon;
    title: string;
    body: string;
}


interface WhyChooseUsProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const WhyChooseUs = ({ data }: WhyChooseUsProps) => {
    if (!data) return null;

    const EYEBROW = data?.eyebrow?.value;
    const TITLE = data?.title?.value;
    const SUB_TITLE = data?.subTitle?.value;
    const cover = extractAttributes<PictureAttributes>(data?.coverImg);
    const PLACEHOLDER_IMAGE = cover?.mediaStorageKey ?? "";
    const IMAGE_ALT = cover?.mediaAltText ?? "";
    const IMAGE_WIDTH = cover?.width;
    const IMAGE_HEIGHT = cover?.height;
    const REASONS: Reason[] = convertObjectToArrayByPrefix<ReasonAttributes>(data, "reason").map(
        (reason) => ({
            Icon: REASON_ICONS[reason.attributes?.icon ?? ""] ?? Target,
            title: reason.value ?? "",
            body: reason.attributes?.body ?? "",
        }),
    );

    return (
        <section
            id="why-choose-us"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto max-w-7xl", "px-4 sm:px-8")}>
                <div className="flex flex-col items-center text-center">
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full",
                                "border border-(--border-default) bg-(--surface-default)",
                                "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                            )}
                        >
                            <span className="bg-(--color-primary) size-1.5 shrink-0 rounded-full" />
                            {EYEBROW}
                        </span>
                    </FadeIn>

                    <FadeIn delay={90}>
                        <h2
                            className={cn(
                                "mt-8 font-bold text-balance text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {TITLE}
                        </h2>
                    </FadeIn>

                    <FadeIn delay={180}>
                        <p
                            className={cn(
                                "mt-6 max-w-3xl text-(--text-secondary)",
                                "text-xs leading-relaxed md:text-sm",
                            )}
                        >
                            {SUB_TITLE}
                        </p>
                    </FadeIn>
                </div>

                <div
                    className={cn(
                        "mt-12 grid grid-cols-1 gap-8",
                        "lg:mt-16 lg:grid-cols-[1.4fr_1fr] lg:gap-10",
                    )}
                >
                    <FadeIn
                        className={cn(
                            "relative overflow-hidden rounded-3xl",
                            "aspect-4/3 lg:aspect-auto lg:h-full",
                            "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                        )}
                    >
                        <FillImage
                            src={PLACEHOLDER_IMAGE}
                            alt={IMAGE_ALT}
                            width={IMAGE_WIDTH}
                            height={IMAGE_HEIGHT}
                            wrapperClassName="absolute inset-0 h-full w-full"
                            className={cn(
                                "h-full w-full object-cover",
                                "object-[70%_center]",
                            )}
                        />
                    </FadeIn>

                    <ul className="flex flex-col gap-4 lg:gap-6">
                        {REASONS.map(({ Icon, title, body }, index) => (
                            <li key={title} className="flex">
                                <FadeIn
                                    delay={index * 110}
                                    className={cn(
                                        "flex w-full items-center gap-4 rounded-2xl p-5 lg:p-6",
                                        "border border-(--border-default) bg-(--surface-default)",
                                        "shadow-[0_8px_20px_-16px_rgb(0_0_0/0.25)]",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex size-11 shrink-0 items-center justify-center rounded-full",
                                            "bg-(--surface-page) text-(--text-primary)",
                                        )}
                                    >
                                        <Icon className="size-5" strokeWidth={1.6} />
                                    </span>

                                    <div className="min-w-0">
                                        <h3
                                            className={cn(
                                                "font-semibold text-(--text-primary)",
                                                "text-sm md:text-base",
                                            )}
                                        >
                                            {title}
                                        </h3>
                                        <p
                                            className={cn(
                                                "mt-2 text-(--text-secondary)",
                                                "text-xs leading-relaxed",
                                            )}
                                        >
                                            {body}
                                        </p>
                                    </div>
                                </FadeIn>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
