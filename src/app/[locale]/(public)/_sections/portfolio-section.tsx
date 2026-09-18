import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PortfolioMarquee, { type PortfolioMarqueeItem } from "./components/portfolio-marquee";

interface PortfolioSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const PortfolioSection = ({ data }: PortfolioSectionProps) => {
    if (!data) return null;

    const portfolio: PortfolioMarqueeItem[] = convertObjectToArrayByPrefix<PictureAttributes>(data, "image")
        .map((item) => ({ image: item.attributes?.mediaStorageKey ?? "" }))
        .filter((item) => item.image !== "");

    const half = Math.ceil(portfolio.length / 2);
    const topRow = portfolio.slice(0, half);
    const bottomRow = portfolio.slice(half);

    return (
        <section className={cn("flex flex-col overflow-hidden", "py-16 gap-8")}>
            <FadeIn className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16", "gap-8 items-center")}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                )}>
                    {data?.badge?.value}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight"
                )}>
                    <span className="text-(--color-secondary)">
                        {data?.titleHighlight?.value}
                    </span>
                    {data?.titleRest?.value}
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center"
                )}>
                    {data?.description?.value}
                </FadeIn>
            </FadeIn>

            {/* full-bleed: the section is unconstrained, only the header above is centred */}
            <FadeIn delay={300} className="flex flex-col gap-5 sm:gap-10">
                <PortfolioMarquee items={topRow} speed={35} />
                <PortfolioMarquee items={bottomRow} speed={28} reverse />
            </FadeIn>
        </section>
    );
};

export default PortfolioSection;
