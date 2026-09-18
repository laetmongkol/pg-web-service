import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

interface OurPhilosophySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const QuoteMark = () => (
    <span
        aria-hidden
        className={cn(
            "inline-block italic -skew-x-12 font-bold",
            "leading-none text-(--color-secondary)",
            "text-2xl sm:text-4xl",
        )}
    >
        {"″"}
    </span>
);

const OurPhilosophySection = ({ data }: OurPhilosophySectionProps) => {
    if (!data) return null;

    return (
        <section className="w-full bg-(--surface-page)">
            <FadeIn
                className={cn(
                    "flex flex-col items-center text-center",
                    "max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
                    "py-20 lg:py-28 gap-8",
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

                <blockquote className="flex max-w-4xl flex-col items-center gap-5">
                    <QuoteMark />
                    <p
                        className={cn(
                            "font-medium text-(--text-primary)",
                            "text-base leading-relaxed",
                            "sm:text-xl lg:text-2xl lg:leading-snug",
                            "whitespace-normal lg:whitespace-pre-line",
                        )}
                    >
                        {data?.quote?.value}
                    </p>
                    <QuoteMark />
                </blockquote>
            </FadeIn>
        </section>
    );
};

export default OurPhilosophySection;
