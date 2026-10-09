import { ArrowUpRight } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import SectionEyebrow from "../_shared/section-eyebrow";
import { HEADING_GRADIENT_DARK_CLASSNAME } from "../_shared/styles";
import WaveLines from "../_shared/wave-lines";


interface ServicesSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const SERVICE_KEYS = ["service1", "service2", "service3", "service4", "service5"] as const;

type ServiceItem = {
    key: string;
    title: string;
    image: string;
};

/** service1..5 — value is the (line-broken) service name, plus the row's picture. */
function getServices(data: Record<string, TranslateContentResponseDto>): ServiceItem[] {
    return SERVICE_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        const pictureAttributes = extractAttributes<PictureAttributes>(item);
        return [{ key, title: item.value, image: pictureAttributes?.mediaStorageKey ?? "" }];
    });
}

const ServicesSection = ({ data, language }: ServicesSectionProps) => {
    if (!data) return null;
    const services = getServices(data);

    return (
        <section
            id="services"
            className={cn(
                "relative isolate w-full overflow-hidden pb-16 pt-24 sm:pb-20 lg:pb-24 lg:pt-28",
                "bg-[image:var(--section-dark-gradient)]",
            )}
        >
            <WaveLines />

            <div className="mx-auto max-w-7xl px-4 text-(--text-on-dark) sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <FadeIn>
                            <SectionEyebrow className="text-(--text-body-on-dark)">{data?.eyebrow?.value}</SectionEyebrow>
                        </FadeIn>
                        <FadeIn delay={80}>
                            <h2 className={cn(HEADING_GRADIENT_DARK_CLASSNAME, "mt-3 w-fit text-3xl font-bold sm:text-4xl lg:text-[2.75rem]")}>
                                {data?.title?.value}
                            </h2>
                        </FadeIn>
                        <FadeIn delay={140} className="mt-3 text-sm">
                            {data?.subTitle?.value}
                        </FadeIn>
                    </div>

                    <FadeIn
                        delay={180}
                        className="flex flex-col items-start gap-5 sm:flex-row sm:items-center lg:gap-8"
                    >
                        <p className="text-xs leading-relaxed text-(--text-body-on-dark) sm:text-sm">{data?.description?.value}</p>
                        <LinkCustom
                            href={`/${language}/${data?.button?.linkUrl}`}
                            className={cn(
                                "inline-flex shrink-0 items-center gap-4 rounded-full border border-(--border-on-dark) px-6 py-2.5",
                                "text-sm hover:bg-(--surface-card) hover:text-(--section-dark)",
                                BUTTON_SCALE_CLASSNAME,
                            )}
                        >
                            {data?.button?.value}
                            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
                        </LinkCustom>
                    </FadeIn>
                </div>

                <FadeIn delay={220} className="mt-10 lg:mt-12">
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {services.map(({ key, title: item, image }) => (
                            <li
                                key={key}
                                className={cn(
                                    "flex flex-col items-center rounded-2xl px-3 pb-6 pt-3 text-center",
                                    "border border-(--border-on-dark) bg-(--glass-on-dark) backdrop-blur-sm",
                                )}
                            >
                                <FillImage
                                    src={image}
                                    alt=""
                                    sizes="(max-width: 640px) 45vw, 160px"
                                    wrapperClassName="aspect-[113/96] w-full max-w-36 overflow-hidden"
                                    className="object-contain"
                                />
                                <span className="mt-5 whitespace-pre-line text-sm font-bold leading-snug sm:text-base">{item}</span>
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>
        </section>
    );
};

export default ServicesSection;
