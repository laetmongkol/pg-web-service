import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PartnerMarquee from "./components/partner-marquee";

interface PartnerSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const MARQUEE_ROWS = 3;

const PartnerSection = ({ data }: PartnerSectionProps) => {
    if (!data) return null;

    const partnerImages = convertObjectToArrayByPrefix<PictureAttributes>(data, "logo")
        .map((item) => item.attributes?.mediaStorageKey ?? "")
        .filter(Boolean);

    /** Dealt round-robin so the rows stay even however many partners there end up being. */
    const partnerRows = Array.from({ length: MARQUEE_ROWS }, (_, row) =>
        partnerImages.filter((_image, index) => index % MARQUEE_ROWS === row),
    );

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16"
        )}>
            {/* oversized corners on one diagonal — the shape from the mock */}
            <div className={cn("bg-(--text-invert) w-full",
                "rounded-3xl rounded-tl-[4rem] rounded-br-[4rem]",
                "lg:rounded-tl-[6rem] lg:rounded-br-[6rem]",
                "p-8 sm:p-10 lg:p-14",
                "flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-center"
            )}>
                <FadeIn direction="left" delay={100} className={cn("flex flex-col gap-6",
                    "items-center text-center",
                    "lg:w-1/2 lg:items-start lg:text-start"
                )}>
                    <FadeIn delay={100} className={cn("hidden lg:block",
                        "text-(--color-secondary) text-sm font-bold tracking-[0.25em]"
                    )}>
                        {data?.eyebrow?.value}
                    </FadeIn>

                    <h2 className={cn("font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl leading-tight"
                    )}>
                        {data?.title1?.value}
                        <p className="text-(--color-secondary)">
                            {data?.title2?.value}
                        </p>
                    </h2>

                    <FadeIn delay={200} className={cn("text-(--text-secondary) italic",
                        "text-sm sm:text-base leading-relaxed",
                        "lg:border-l-2 lg:border-(--color-secondary) lg:pl-5"
                    )}>
                        {data?.quote?.value}
                    </FadeIn>
                </FadeIn>

                {/* one element, two orientations: a rule above the grid, a spine beside it */}
                <div className={cn("shrink-0 bg-(--text-primary)/15",
                    "h-px w-full",
                    "lg:h-72 lg:w-px"
                )} />

                {/* three looping rows instead of a 3x3 grid — the partner list keeps growing,
                    and a fixed grid would either cut it off or stretch the card */}
                <FadeIn direction="right" delay={300} className="flex lg:w-1/2 flex-col lg:flex-1">
                    {partnerRows.map((row, index) => (
                        <div
                            key={`row-${index}`}
                            className={cn(
                                "py-5 sm:py-6",
                                // rows after the first carry the divider, so the line runs unbroken
                                index > 0 && "border-t border-(--text-primary)/15",
                            )}
                        >
                            <PartnerMarquee
                                items={row}
                                speed={26 + index * 6}
                                reverse={index % 2 === 1}
                            />
                        </div>
                    ))}
                </FadeIn>
            </div>
        </section>
    );
};

export default PartnerSection;
