import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PillLabel from "../../_shared/pill-label";
import { HEADING_GRADIENT_DARK_CLASSNAME, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

const ITEM_KEYS = Array.from({ length: 12 }, (_, index) => `item${index + 1}`);

/** item1..12 — one capability chip per row value. */
function getItems(data: Record<string, TranslateContentResponseDto>): { key: string; label: string }[] {
    return ITEM_KEYS.flatMap((key) => {
        const label = data?.[key]?.value;
        return label ? [{ key, label }] : [];
    });
}

interface CapabilitiesSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const CapabilitiesSection = ({ data }: CapabilitiesSectionProps) => {
    if (!data) return null;
    const items = getItems(data);

    return (
        <section id="capabilities" className="w-full py-16 text-(--text-on-dark) sm:py-20 lg:py-24">
            <div className={cn(SECTION_CONTAINER_CLASSNAME, "flex flex-col items-center text-center")}>
                <FadeIn>
                    <PillLabel tone="dark">{data?.label?.value}</PillLabel>
                </FadeIn>
                <FadeIn delay={80}>
                    <h2
                        className={cn(
                            HEADING_GRADIENT_DARK_CLASSNAME,
                            "mt-5 font-bold text-4xl leading-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]",
                        )}
                    >
                        <span className="block">{data?.title1?.value}</span>
                        <span className="block">{data?.title2?.value}</span>
                    </h2>
                </FadeIn>
                <FadeIn delay={140} className="mt-5 max-w-4xl text-sm sm:text-base">
                    {data?.description?.value}
                </FadeIn>

                <FadeIn delay={200} className="mt-10 lg:mt-14">
                    <ul className="flex max-w-3xl flex-wrap justify-center gap-3">
                        {items.map(({ key, label: item }) => (
                            <li
                                key={key}
                                className={cn(
                                    "rounded-xl border border-(--border-on-dark) bg-(--glass-on-dark) px-5 py-3 text-sm font-semibold backdrop-blur-sm",
                                )}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>
        </section>
    );
};

export default CapabilitiesSection;
