import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import OurImpactMosaic, { type MosaicPicture, type MosaicStat } from "./components/our-impact-mosaic";

interface OurImpactSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `stat*` — the number itself is the row value. */
interface ImpactStatAttributes {
    label?: string;
}

const OurImpactSection = ({ data }: OurImpactSectionProps) => {
    if (!data) return null;

    const stats: MosaicStat[] = convertObjectToArrayByPrefix<ImpactStatAttributes>(data, "stat").map((item) => ({
        value: item.value ?? "",
        label: item.attributes?.label ?? "",
    }));

    const pictures: MosaicPicture[] = convertObjectToArrayByPrefix<PictureAttributes>(data, "image").map((item) => ({
        src: item.attributes?.mediaStorageKey ?? "",
        alt: item.attributes?.mediaAltText ?? "",
        width: item.attributes?.width,
        height: item.attributes?.height,
    }));

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16 gap-10",
        )}>
            <FadeIn className="flex flex-col gap-4 items-center">
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

            <FadeIn delay={300}>
                <OurImpactMosaic
                    videoTitle={data?.videoTitle?.value}
                    expandLabel={data?.expandLabel?.value}
                    collapseLabel={data?.collapseLabel?.value}
                    stats={stats}
                    pictures={pictures}
                />
            </FadeIn>
        </section>
    );
};

export default OurImpactSection;
