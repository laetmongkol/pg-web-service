import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import SubsidiariesScroller, { type SubsidiaryItem } from "./components/subsidiaries-scroller";

interface OurSubsidiariesSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `company*` — the English name is the row value, the site URL is link_url. */
interface SubsidiaryAttributes extends PictureAttributes {
    thaiName?: string;
    description?: string;
}

const OurSubsidiariesSection = ({ data }: OurSubsidiariesSectionProps) => {
    if (!data) return null;

    const subsidiaries: SubsidiaryItem[] = convertObjectToArrayByPrefix<SubsidiaryAttributes>(data, "company").map((item) => ({
        image: item.attributes?.mediaStorageKey ?? "",
        name: item.value ?? "",
        thaiName: item.attributes?.thaiName ?? "",
        description: item.attributes?.description ?? "",
        href: item.linkUrl ?? "",
    }));

    // passed into the scroller so desktop can pin it next to the track
    const header = (
        <FadeIn className="flex flex-col gap-8 items-center">
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
            )}>
                {data?.badge?.value}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-3xl sm:text-4xl text-center leading-tight"
            )}>
                <p className="text-(--color-secondary)">
                    {data?.title1?.value}
                </p>
                {data?.title2?.value}
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-base sm:text-lg text-center"
            )}>
                {data?.description?.value}
            </FadeIn>
        </FadeIn>
    );

    return (
        <section className={cn("flex flex-col px-6 sm:px-12 md:px-16 ",
            "py-16 gap-8"
        )}>
            <SubsidiariesScroller
                items={subsidiaries}
                header={header}
                moreLabel={data?.moreButton?.value}
                moreHref={data?.moreButton?.linkUrl}
            />
        </section>
    )
}

export default OurSubsidiariesSection;
