import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import JourneyScroller, { type JourneyItem } from "./components/journey-scroller";
import { OurValueContent } from "./our-value-section";

interface JourneySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    /** OUR VALUE lives in its own CMS section but renders inside this one's pinned viewport. */
    valueData?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `milestone*` — the year is the row value. */
interface MilestoneAttributes {
    title?: string;
    description?: string;
}

const JourneySection = ({ data, valueData }: JourneySectionProps) => {
    if (!data) return null;

    const items: JourneyItem[] = convertObjectToArrayByPrefix<MilestoneAttributes>(data, "milestone").map((item) => ({
        year: item.value ?? "",
        title: item.attributes?.title ?? "",
        description: item.attributes?.description ?? "",
    }));

    const header = (
        <FadeIn className={cn(
            "flex flex-col gap-4 items-center",
            "lg:items-start",
        )}>
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                "text-xs tracking-wide",
            )}>
                {data?.badge?.value}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-3xl sm:text-4xl text-center leading-tight",
                "lg:text-start",
            )}>
                {data?.title1?.value}
                <span className="text-(--color-secondary)">
                    {data?.title2?.value}
                </span>
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-base sm:text-lg text-center max-w-3xl",
                "lg:text-start",
            )}>
                {data?.subTitle?.value}
            </FadeIn>
        </FadeIn>
    );

    return (
        <section className={cn(
            "flex flex-col w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
            // the desktop scroller carries its own vertical padding while pinned
            "pt-8 pb-16 gap-8 lg:py-0",
        )}>
            <JourneyScroller items={items} header={header} footer={<OurValueContent data={valueData} />} />
        </section>
    );
};

export default JourneySection;
