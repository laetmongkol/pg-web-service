import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PillLabel from "../../_shared/pill-label";
import { HEADING_GRADIENT_LIGHT_CLASSNAME, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import { ABOUT_MOCK } from "./about-mock";

const MOCK = ABOUT_MOCK.history;

interface HistorySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const HistorySection = ({ data }: HistorySectionProps) => {
    const label = data?.label?.value || MOCK.label;
    const title = data?.title?.value || MOCK.title;
    const description = data?.description?.value || MOCK.description;

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
                        <PillLabel>{label}</PillLabel>
                    </FadeIn>
                    <FadeIn delay={80}>
                        <h2
                            className={cn(
                                HEADING_GRADIENT_LIGHT_CLASSNAME,
                                "mt-6 w-fit font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem]",
                            )}
                        >
                            {title}
                        </h2>
                    </FadeIn>
                    <FadeIn delay={140} className="mt-6 max-w-xl text-sm leading-relaxed">
                        {description}
                    </FadeIn>
                </div>

                <FadeIn delay={180}>
                    <ul className="grid grid-cols-2 gap-4 sm:gap-5">
                        {MOCK.stats.map(({ value, label: statLabel }) => (
                            <li
                                key={value}
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
