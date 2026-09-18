import { Globe, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";

import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

interface OurValueSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `value*` — the card title is the row value. */
interface ValueAttributes {
    icon?: string;
    description?: string;
}

const VALUE_ICONS: Record<string, LucideIcon> = {
    Sparkles,
    ShieldCheck,
    Globe,
    TrendingUp,
};

const resolveValueIcon = (icon?: string | null): LucideIcon =>
    (icon && VALUE_ICONS[icon]) || Sparkles;

/**
 * Header + cards without a `<section>` of its own, so the journey scroller can render it inside
 * its pinned viewport — the timeline alone left most of the screen empty while it scrolled.
 */
export const OurValueContent = ({ data }: { data?: Record<string, TranslateContentResponseDto> }) => {
    if (!data) return null;

    const items = convertObjectToArrayByPrefix<ValueAttributes>(data, "value");

    return (
        <div className="flex flex-col gap-6">
            <FadeIn className="flex flex-col gap-3 items-center">
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {data?.badge?.value}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-2xl sm:text-3xl text-center leading-tight",
                )}>
                    <span className="text-(--color-secondary)">{data?.titleHighlight1?.value}</span>
                    {data?.titleRest1?.value}
                    <span className="text-(--color-secondary)">{data?.titleHighlight2?.value}</span>
                    {data?.titleRest2?.value}
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-sm sm:text-base text-center max-w-3xl",
                )}>
                    {data?.subTitle?.value}
                </FadeIn>
            </FadeIn>

            <div className={cn(
                "grid gap-4",
                "sm:grid-cols-2 lg:grid-cols-4",
            )}>
                {items.map((item, index) => {
                    const Icon = resolveValueIcon(item.attributes?.icon);
                    return (
                        <FadeIn
                            key={item.key}
                            delay={index * 150}
                            className={cn(
                                "flex flex-col gap-3 h-full",
                                "rounded-2xl border border-(--border-default) bg-(--surface-elevated)",
                                "p-5",
                            )}
                        >
                            <Icon
                                className="size-9 shrink-0 rounded-xl bg-(--surface-page) p-2 text-(--color-secondary)"
                                strokeWidth={1.5}
                            />
                            <h3 className="text-sm font-bold text-(--text-primary) sm:text-base">
                                {item.value}
                            </h3>
                            <p className="text-xs text-(--text-secondary)">
                                {item.attributes?.description}
                            </p>
                        </FadeIn>
                    );
                })}
            </div>
        </div>
    );
};

const OurValueSection = ({ data }: OurValueSectionProps) => {
    return (
        <section className={cn(
            "flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
            "py-16 gap-10",
        )}>
            <OurValueContent data={data} />
        </section>
    );
};

export default OurValueSection;
