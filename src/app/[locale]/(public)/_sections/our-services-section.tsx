import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import OurServicesSlide, { type OurServiceSlideItem } from "./components/our-services-slide";

interface OurServicesSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `service*` — picture + body copy; the card title is the row value. */
interface ServiceAttributes extends PictureAttributes {
    description?: string;
}

const OurServicesSection = ({ data }: OurServicesSectionProps) => {
    if (!data) return null;

    const services: OurServiceSlideItem[] = convertObjectToArrayByPrefix<ServiceAttributes>(data, "service").map((item) => ({
        image: item.attributes?.mediaStorageKey ?? "",
        title: item.value ?? "",
        description: item.attributes?.description ?? "",
    }));

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 ",
            "py-16 gap-8"
        )}>
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
                    <p><span className="text-(--color-secondary)">
                        {data?.titleHighlight1?.value}
                    </span>
                        {data?.titleRest1?.value}
                    </p>
                    <p><span className="text-(--color-secondary)">
                        {data?.titleHighlight2?.value}
                    </span>
                        {data?.titleRest2?.value}
                    </p>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center"
                )}>
                    {data?.description?.value}
                </FadeIn>
            </FadeIn>
            <FadeIn delay={300} className="-mx-6 overflow-hidden px-6 py-4 sm:-mx-12 sm:px-12">
                <OurServicesSlide items={services} />
            </FadeIn>
        </section>
    )
}

export default OurServicesSection;
