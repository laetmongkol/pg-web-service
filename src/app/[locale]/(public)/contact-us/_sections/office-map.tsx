import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import { COMPANY_LEGAL_NAME } from "@/shared/constants/company.constants";

interface OfficeMapProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const OfficeMap = ({ data }: OfficeMapProps) => {
    if (!data) return null;

    /**
     * Google has no listing for the company itself, so the embed queries the building it sits in.
     * Querying the place by name drops its pin and brings up Google's own place card, which is why
     * nothing is drawn over the map here.
     */
    const query = [data?.placeName?.value, data?.placeAddress?.value].filter(Boolean).join(" ");
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=th&z=17&output=embed`;

    return (
        <section id="office-map" className="w-full bg-(--surface-elevated) pb-16 sm:pb-20 lg:pb-24 lg:pt-10">
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <FadeIn delay={100} className="overflow-hidden rounded-2xl border border-(--border-default)">
                    <iframe
                        src={mapSrc}
                        title={`แผนที่ ${COMPANY_LEGAL_NAME}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="block aspect-[4/3] w-full border-0 sm:aspect-[21/9]"
                    />
                </FadeIn>
            </div>
        </section>
    );
};

export default OfficeMap;
