import { ArrowUpRight, Briefcase, Calendar, Globe, type LucideIcon } from "lucide-react";

import { convertObjectToArrayByPrefix, extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface AboutUsProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `stat*` — icon name + label; the number itself is the row value. */
interface StatAttributes {
    icon?: string;
    label?: string;
}

const ABOUT_US_ICONS: Record<string, LucideIcon> = {
    Calendar,
    Briefcase,
    Globe,
};

const resolveAboutUsIcon = (icon?: string | null): LucideIcon =>
    (icon && ABOUT_US_ICONS[icon]) || Calendar;

const AboutUs = ({ data, language }: AboutUsProps) => {
    if (!data) return null;

    const stats = convertObjectToArrayByPrefix<StatAttributes>(data, "stat");
    const picture = extractAttributes<PictureAttributes>(data?.image);
    const moreHref = `/${language}/${data?.moreButton?.linkUrl ?? ""}`;

    return (
        <section id="about-us" className={cn("flex flex-col max-w-7xl mx-auto pt-30 px-6 sm:px-12 md:px-16",
            "pb-16 gap-8"
        )}>
            <div className={cn(
                "flex flex-col lg:flex-row gap-8 whitespace-pre-line",
                "items-center"
            )}>
                <FadeIn className={cn(
                    "flex flex-col gap-8 items-center",
                    "lg:items-start lg:w-1/2"
                )}>
                    <FadeIn delay={100} className={cn(
                        "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                    )}>
                        {data?.badge?.value}
                    </FadeIn>

                    <h2 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl text-center leading-tight",
                        "lg:text-start"
                    )}>
                        {data?.title1?.value}
                        <p className="text-(--color-secondary)">
                            {data?.title2?.value}
                        </p>
                    </h2>

                    <FadeIn delay={200} className={cn(
                        "text-(--text-secondary)",
                        "text-base sm:text-lg text-center",
                        "lg:text-start"
                    )}>
                        {data?.description?.value}
                    </FadeIn>

                    <LinkCustom href={moreHref} className="hidden lg:block group hover:underline text-(--color-secondary)">
                        <FadeIn delay={300} className="text-xl font-medium text-(--color-secondary) flex items-center gap-2">
                            {data?.moreButton?.value}
                            <ArrowUpRight className="size-6 inline-block border border-(--color-secondary) rounded-full p-1 w-9 h-9 group-hover:scale-105 transition-all duration-300" />
                        </FadeIn>
                    </LinkCustom>

                    <div className={cn(
                        "flex flex-col gap-7 w-full",
                        "md:flex-row md:justify-between"
                    )}>
                        {stats.map((item, index) => {
                            const Icon = resolveAboutUsIcon(item.attributes?.icon);
                            return (
                                <FadeIn key={item.key} delay={index * 150} className="flex flex-row items-center gap-4">
                                    <Icon className="size-8 shrink-0 text-(--color-secondary) bg-(--surface-50) p-3 rounded-xl w-13 h-13" strokeWidth={1.5} />
                                    <span className="flex flex-col gap-1">
                                        <CountUpNumber
                                            value={item.value ?? ""}
                                            className="text-xl font-bold text-(--text-primary)"
                                        />
                                        <span className="text-sm font-medium text-(--text-secondary)">{item.attributes?.label}</span>
                                    </span>
                                </FadeIn>
                            );
                        })}
                    </div>
                </FadeIn>

                {/* image caption */}
                <FadeIn delay={200} direction="right" className={cn(
                    "relative rounded-3xl overflow-hidden",
                    "lg:w-1/2"
                )}>
                    <FillImage
                        src={picture?.mediaStorageKey ?? ""}
                        alt={picture?.mediaAltText ?? "About Us"}
                        width={picture?.width}
                        height={picture?.height}
                        wrapperClassName="aspect-square md:aspect-4/3"
                        className={cn(
                            "object-cover"
                        )}
                    />
                    <div className={cn(
                        "absolute flex flex-col lg:items-center justify-center p-5 gap-4 bottom-0 w-full bg-(--surface-invert)/50 backdrop-blur-sm rounded-b-3xl",
                        "lg:flex-row"
                    )}>
                        <span className={cn(
                            "text-(--text-invert)",
                            "flex flex-row lg:flex-col lg:items-start items-center gap-3"
                        )}>
                            <CountUpNumber
                                value={data?.highlightValue?.value ?? ""}
                                className={cn("text-3xl lg:text-2xl font-bold")}
                            />
                            <span className={cn("text-base lg:text-xs")}>{data?.highlightLabel?.value}</span>
                        </span>
                        <span
                            aria-hidden
                            className={cn(
                                "shrink-0 bg-(--text-invert)/30",
                                "h-px w-full",
                                "lg:h-12 lg:w-px"
                            )}
                        />
                        <p className={cn(
                            "text-(--text-invert)",
                            "text-sm"
                        )}>{data?.highlightQuote?.value}</p>
                    </div>
                </FadeIn>
                <LinkCustom href={moreHref} className="lg:hidden block group hover:underline text-(--color-secondary)">
                    <span className="text-xl font-medium text-(--color-secondary) flex items-center gap-2">
                        {data?.moreButton?.value}
                        <ArrowUpRight className="size-6 inline-block border border-(--color-secondary) rounded-full p-1 w-9 h-9 group-hover:scale-105 transition-all duration-300" />
                    </span>
                </LinkCustom>
            </div>
        </section>
    )
}

export default AboutUs;
