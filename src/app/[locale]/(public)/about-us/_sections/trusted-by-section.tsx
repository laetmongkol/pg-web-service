import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import PartnerMarquee from "@/app/[locale]/(public)/_sections/components/partner-marquee";
import FadeIn from "@/app/component/fade-in.components";

interface TrustedBySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const TrustedBySection = ({ data }: TrustedBySectionProps) => {
    if (!data) return null;

    const logos = convertObjectToArrayByPrefix<PictureAttributes>(data, "logo")
        .map((item) => item.attributes?.mediaStorageKey ?? "")
        .filter(Boolean);

    return (
        <section className={cn("flex flex-col overflow-hidden", "py-16 gap-8")}>
            <FadeIn className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16", "gap-4 items-center")}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {data?.badge?.value}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {data?.title1?.value}
                    <span className="text-(--color-secondary)">{data?.title2?.value}</span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {data?.subTitle?.value}
                </FadeIn>
            </FadeIn>

            {/* full-bleed: only the header above is centred, the logo row runs edge to edge */}
            <FadeIn delay={300}>
                <PartnerMarquee items={logos} />
            </FadeIn>
        </section>
    );
};

export default TrustedBySection;
