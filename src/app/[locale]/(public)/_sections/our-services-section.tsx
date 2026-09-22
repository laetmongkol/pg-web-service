import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import OurServicesSlide, {
    type OurServiceSlideItem,
    type ServiceIconName,
} from "./components/our-services-slide";

/** attributes on `service*` — icon key + body copy; the card title is the row value. */
interface ServiceAttributes {
    icon?: string;
    description?: string;
}

const SERVICE_ICON_FALLBACK: ServiceIconName = "consulting";
const SERVICE_ICON_NAMES: ServiceIconName[] = ["consulting", "strategy", "branding", "content"];

const resolveIcon = (icon?: string): ServiceIconName =>
    SERVICE_ICON_NAMES.find((name) => name === icon) ?? SERVICE_ICON_FALLBACK;

interface OurServicesSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const OurServicesSection = ({ data, language }: OurServicesSectionProps) => {
    if (!data) return null;

    const linkLabel = data?.ctaButton?.value ?? "";
    const href = `/${language}/${data?.ctaButton?.linkUrl ?? ""}`;

    const services: OurServiceSlideItem[] = convertObjectToArrayByPrefix<ServiceAttributes>(data, "service")
        .map((service) => ({
            icon: resolveIcon(service.attributes?.icon),
            title: service.value ?? "",
            description: service.attributes?.description ?? "",
            href,
            linkLabel,
        }));

    // passed into the slide so desktop can line the heading up with the arrows
    const header = (
        <div className="flex flex-col gap-4">
            <FadeIn>
                <span
                    className={cn(
                        "inline-flex w-fit items-center gap-2 rounded-full",
                        "border border-(--border-default) bg-(--surface-page)",
                        "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                    )}
                >
                    <span className="bg-(--text-primary) size-1.5 shrink-0 rounded-full" />
                    {data?.badge?.value}
                </span>
            </FadeIn>

            <FadeIn delay={100}>
                <h2
                    className={cn(
                        "font-bold text-(--text-primary)",
                        "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                    )}
                >
                    {data?.title?.value}
                </h2>
            </FadeIn>

            <FadeIn delay={200} className={cn("text-(--text-secondary)", "text-sm md:text-base")}>
                {data?.description?.value}
            </FadeIn>
        </div>
    );

    return (
        <section
            id="our-services"
            className={cn("w-full bg-(--surface-50) surface-noise", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <OurServicesSlide items={services} header={header} />
            </div>
        </section>
    );
};

export default OurServicesSection;
