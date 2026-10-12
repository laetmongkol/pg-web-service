import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PillLabel from "../../_shared/pill-label";
import { HEADING_GRADIENT_LIGHT_CLASSNAME, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

const STAT_KEYS = ["stat1", "stat2", "stat3", "stat4"] as const;

type HistoryStat = {
    key: string;
    value: string;
    label: string;
};

/** stat1..4 — value is the figure, attribute1 the label under it. */
function getStats(data: Record<string, TranslateContentResponseDto>): HistoryStat[] {
    return STAT_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];
        return [{ key, value: item.value, label: item.attribute1 ?? "" }];
    });
}

interface HistorySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const HistorySection = ({ data }: HistorySectionProps) => {
    if (!data) return null;
    const stats = getStats(data);

    return (
        <section id="our-history" className="w-full py-16 sm:py-20 lg:py-24">
            <div
                className={cn(
                    SECTION_CONTAINER_CLASSNAME,
                    "grid items-center gap-10 text-(--text-on-light) lg:grid-cols-[1.2fr_1fr] lg:gap-16",
                )}
            >
                <div>
                    <FadeIn>
                        <PillLabel>{data?.label?.value}</PillLabel>
                    </FadeIn>
                    <FadeIn delay={80}>
                        <h2
                            className={cn(
                                HEADING_GRADIENT_LIGHT_CLASSNAME,
                                "mt-6 w-fit font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem]",
                            )}
                        >
                            {data?.title?.value}
                        </h2>
                    </FadeIn>
                    <FadeIn delay={140} className="mt-6 max-w-xl text-sm leading-relaxed">
                        {data?.description?.value}
                    </FadeIn>
                </div>

                <FadeIn delay={180}>
                    <ul className="grid grid-cols-2 gap-4 sm:gap-5">
                        {stats.map(({ key, value, label: statLabel }) => (
                            <li
                                key={key}
                                className="flex min-h-36 flex-col items-center justify-center rounded-2xl bg-(--surface-card) px-4 py-6 text-center sm:min-h-40"
                            >
                                <span className="text-xl font-medium sm:text-2xl lg:text-[1.75rem]">{value}</span>
                                <span className="mt-3 whitespace-pre-line text-xs leading-snug sm:text-sm">
                                    {statLabel}
                                </span>
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>
        </section>
    );
};

export default HistorySection;
