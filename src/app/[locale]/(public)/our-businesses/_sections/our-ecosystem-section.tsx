import { Building2, LayoutGrid, TrendingUp, type LucideIcon } from "lucide-react";

import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { renderNowrapText } from "@/lib/ui/text-utils";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";

interface OurEcosystemSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** attributes on `stat*` — the number itself is the row value. */
interface EcosystemStatAttributes {
    icon?: string;
    label?: string;
}

const ECOSYSTEM_ICONS: Record<string, LucideIcon> = {
    Building2,
    LayoutGrid,
    TrendingUp,
};

const resolveEcosystemIcon = (icon?: string | null): LucideIcon =>
    (icon && ECOSYSTEM_ICONS[icon]) || Building2;

const OurEcosystemSection = ({ data }: OurEcosystemSectionProps) => {
    if (!data) return null;

    const stats = convertObjectToArrayByPrefix<EcosystemStatAttributes>(data, "stat");

    return (
        <section
            id="our-businesses-content"
            className="w-full bg-(--surface-page)"
        >
            <FadeIn
                className={cn(
                    "flex flex-col lg:flex-row lg:items-center",
                    "max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
                    "py-16 gap-12 lg:gap-16",
                )}
            >
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-4",
                        "items-center text-center",
                    )}
                >
                    <span
                        className={cn(
                            "text-(--color-secondary) border border-(--color-secondary)",
                            "px-4 py-1 rounded-full text-center font-bold",
                            "text-xs tracking-wide",
                        )}
                    >
                        {data?.badge?.value}
                    </span>
                    <h2
                        className={cn(
                            "font-bold leading-tight",
                            "text-xl sm:text-3xl",
                        )}
                    >
                        <span className="text-(--color-secondary)">{data?.title1?.value}</span>
                        <span className="text-(--text-primary) whitespace-nowrap">{data?.title2?.value}</span>
                    </h2>
                    <p
                        className={cn(
                            "text-(--text-secondary) text-xs sm:text-base",
                            "max-w-md",
                        )}
                    >
                        <span className="block">{data?.descriptionLead?.value}</span>
                        {renderNowrapText(data?.description?.value)}
                    </p>
                </div>

                <div
                    className={cn(
                        "flex flex-1 items-start justify-evenly",
                        "gap-2 sm:gap-4",
                    )}
                >
                    {stats.map((item) => {
                        const Icon = resolveEcosystemIcon(item.attributes?.icon);
                        return (
                            <div
                                key={item.key}
                                className="flex flex-col items-center gap-2 text-center"
                            >
                                <Icon
                                    className={cn(
                                        "text-(--color-secondary) size-12 shrink-0",
                                        "bg-(--surface-default) rounded-xl p-3 shadow-sm",
                                    )}
                                    strokeWidth={1.6}
                                />
                                <CountUpNumber
                                    value={item.value ?? ""}
                                    className="text-2xl font-bold text-(--text-primary) sm:text-3xl"
                                />
                                <span
                                    className={cn(
                                        "text-(--text-secondary)",
                                        "whitespace-nowrap",
                                        "text-xs sm:text-sm",
                                    )}
                                >
                                    {item.attributes?.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </FadeIn>
        </section>
    );
};

export default OurEcosystemSection;
