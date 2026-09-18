import { AlignVerticalJustifyEnd, Clock, Share2, TrendingUp, type LucideIcon } from "lucide-react";

import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

interface ConsiderationSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `item*` — the card title is the row value. */
interface ConsiderationAttributes {
    icon?: string;
    number?: string;
    description?: string;
}

const CONSIDERATION_ICONS: Record<string, LucideIcon> = {
    AlignVerticalJustifyEnd,
    TrendingUp,
    Share2,
    Clock,
};

const resolveConsiderationIcon = (icon?: string | null): LucideIcon =>
    (icon && CONSIDERATION_ICONS[icon]) || AlignVerticalJustifyEnd;

const ConsiderationSection = ({ data }: ConsiderationSectionProps) => {
    if (!data) return null;

    const items = convertObjectToArrayByPrefix<ConsiderationAttributes>(data, "item");

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
            "py-16 gap-8"
        )}>
            <FadeIn className={cn("flex flex-col gap-8",
                "items-center"
            )}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                )}>
                    {data?.badge?.value}
                </FadeIn>

                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight"
                )}>
                    {data?.title1?.value}
                    <span className="text-(--color-secondary)">
                        {data?.title2?.value}
                    </span>
                </h2>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full",
                    "items-center"
                )}>
                    {items.map((item, index)=>{
                        const Icon = resolveConsiderationIcon(item.attributes?.icon);
                        return (
                        <FadeIn key={item.key} delay={index * 150} className={cn("flex flex-col gap-4 bg-white p-8 rounded-3xl w-full border border-(--border-default)")}>
                            <Icon className={"text-(--color-secondary) size-12 w-12 h-12 bg-(--color-secondary)/10 rounded-xl p-3"} />
                            <span className={cn("text-(--text-primary) text-3xl font-bold")}>
                                {item.attributes?.number}
                            </span>
                            <span className={cn("text-(--text-primary) text-lg font-bold")}>
                                {item.value}
                            </span>
                            <span className={cn("w-1/10 h-0.5 bg-(--color-secondary)")}/>
                            <span className={cn("text-(--text-secondary) text-base")}>
                                {item.attributes?.description}
                            </span>
                        </FadeIn>
                        );
                    })}
                </div>
            </FadeIn>
        </section>
    )
};

export default ConsiderationSection;
