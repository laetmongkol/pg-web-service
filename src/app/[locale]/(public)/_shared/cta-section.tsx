import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import CtaCard from "./cta-card";

interface CtaSectionProps {
    /** The page's `cta` section — title1, title2, description, button (+ link), ctaImg. */
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** Closing CTA card, driven by any page's `cta` section. */
const CtaSection = ({ data, language }: CtaSectionProps) => {
    if (!data) return null;
    const ctaPictureAttributes = extractAttributes<PictureAttributes>(data?.ctaImg);

    return (
        <CtaCard
            title1={data?.title1?.value ?? ""}
            title2={data?.title2?.value ?? ""}
            description={data?.description?.value ?? ""}
            button={data?.button?.value ?? ""}
            href={`/${language}/${data?.button?.linkUrl ?? ""}`}
            image={ctaPictureAttributes?.mediaStorageKey ?? ""}
            imageAlt={ctaPictureAttributes?.mediaAltText ?? ""}
        />
    );
};

export default CtaSection;
