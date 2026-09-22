import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

interface OurHistoryProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const OurHistory = ({ data }: OurHistoryProps) => {
    if (!data) return null;

    const EYEBROW = data?.eyebrow?.value;
    const SUB_TITLE = data?.subTitle?.value;
    const DESCRIPTION = data?.description?.value;
    // the highlighted words are their own rows, so a translator can move them inside the sentence
    const TITLE_PARTS = [
        { text: data?.titleLead?.value ?? "", highlight: false },
        { text: data?.titleHighlight1?.value ?? "", highlight: true },
        { text: data?.titleMid?.value ?? "", highlight: false },
        { text: data?.titleHighlight2?.value ?? "", highlight: true },
        { text: data?.titleTail?.value ?? "", highlight: false },
    ];

    return (
        <section
            id="our-history"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
        >
            <div
                className={cn(
                    "mx-auto flex max-w-7xl flex-col items-center text-center",
                    "px-4 sm:px-8",
                )}
            >
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
                        {TITLE_PARTS.map(({ text, highlight }) => (
                            <span
                                key={text}
                                className={highlight ? "text-(--color-secondary-800)" : undefined}
                            >
                                {text}
                            </span>
                        ))}
                    </h2>
                </FadeIn>

                <FadeIn delay={180}>
                    <p
                        className={cn(
                            "mt-8 max-w-3xl text-(--text-secondary)",
                            "text-xs leading-relaxed md:text-sm",
                        )}
                    >
                        {SUB_TITLE}
                    </p>
                </FadeIn>

                <FadeIn delay={270}>
                    <p
                        className={cn(
                            "mt-8 max-w-4xl text-(--text-secondary)",
                            "text-sm leading-loose md:text-base",
                        )}
                    >
                        {DESCRIPTION}
                    </p>
                </FadeIn>
            </div>
        </section>
    );
};

export default OurHistory;
