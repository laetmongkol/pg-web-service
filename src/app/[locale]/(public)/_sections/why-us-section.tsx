import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";

import SectionEyebrow from "../_shared/section-eyebrow";
import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../_shared/styles";
import WhyUsShowcase, { WhyUsItem } from "./components/why-us-showcase";


interface WhyUsSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const REASON_KEYS = ["reason1", "reason2", "reason3", "reason4", "reason5", "reason6"] as const;

/** reason1..6 — value is the list label, attribute1 the shorter line-broken label for the photo card. */
function getReasons(data: Record<string, TranslateContentResponseDto>): WhyUsItem[] {
    return REASON_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];
        return [{ title: item.value, cardTitle: item.attribute1 || item.value }];
    });
}

const WhyUsSection = ({ data }: WhyUsSectionProps) => {
    if (!data) return null;
    const reasons = getReasons(data);
    const whyPictureAttributes = extractAttributes<PictureAttributes>(data?.whyImg);

    return (
        <section id="why-us" className="w-full pt-8 pb-16 lg:py-14">
            <FadeIn className="mx-auto max-w-7xl px-4 text-(--text-on-light) sm:px-8">
                <WhyUsShowcase
                    items={reasons}
                    image={whyPictureAttributes?.mediaStorageKey ?? ""}
                    imageAlt={whyPictureAttributes?.mediaAltText ?? ""}
                    intro={
                        <>
                            <SectionEyebrow>{data?.eyebrow?.value}</SectionEyebrow>
                            <h2 className={cn(HEADING_GRADIENT_LIGHT_CLASSNAME, "mt-3 w-fit text-3xl font-bold leading-tight sm:text-4xl")}>
                                <span className="block">{data?.title1?.value}</span>
                                <span className="block">{data?.title2?.value}</span>
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{data?.description?.value}</p>
                        </>
                    }
                />
            </FadeIn>
        </section>
    );
};

export default WhyUsSection;
