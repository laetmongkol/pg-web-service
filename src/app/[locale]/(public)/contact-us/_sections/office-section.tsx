import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import { SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import ContactForm from "./components/contact-form";

const HOURS_KEYS = ["hours1", "hours2", "hours3", "hours4", "hours5", "hours6", "hours7"] as const;

/** hours1..7 — value is the day range, attribute1 the opening time. */
function getHours(data: Record<string, TranslateContentResponseDto>): { key: string; day: string; time: string }[] {
    return HOURS_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];
        return [{ key, day: item.value, time: item.attribute1 ?? "" }];
    });
}

interface OfficeSectionProps {
    /** `office` section — title, address, mapQuery, hoursTitle, hours1..7. */
    data?: Record<string, TranslateContentResponseDto>;
    /** `form` section — copy for the message form on the right. */
    formData?: Record<string, TranslateContentResponseDto>;
}

/** Office details, opening hours and map on the left; the message form on the right. */
const OfficeSection = ({ data, formData }: OfficeSectionProps) => {
    if (!data) return null;
    const hours = getHours(data);
    const mapQuery = data?.mapQuery?.value;
    const mapSrc = mapQuery
        ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&hl=th&z=17&output=embed`
        : "";

    return (
        <section id="contact-form" className="w-full pt-16 pb-16 text-(--text-on-dark) lg:pb-24 lg:pt-24">
            <div className={cn(SECTION_CONTAINER_CLASSNAME, "grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-10")}>
                <FadeIn className="flex flex-col">
                    <h2 className="text-xl font-bold sm:text-[1.375rem]">{data?.title?.value}</h2>
                    <p className="mt-3 text-sm text-(--text-body-on-dark)">{data?.address?.value}</p>

                    <div className="mt-7 border-t border-(--border-on-dark) pt-7">
                        <h3 className="text-[0.6875rem] font-semibold tracking-[0.08em] text-(--label-on-dark)">
                            {data?.hoursTitle?.value}
                        </h3>
                        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                            {hours.map(({ key, day, time }) => (
                                <div key={key} className="flex items-center justify-between gap-4">
                                    <dt className="text-(--text-muted-on-dark)">{day}</dt>
                                    <dd className="font-semibold">{time}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {mapSrc ? (
                        <div className="mt-8 min-h-72 flex-1 overflow-hidden rounded-[1.75rem] bg-(--glass-on-dark)">
                            <iframe
                                src={mapSrc}
                                title={data?.title?.value ?? ""}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                                className="block size-full min-h-72 border-0"
                            />
                        </div>
                    ) : null}
                </FadeIn>

                <FadeIn delay={120}>
                    <ContactForm data={formData} />
                </FadeIn>
            </div>
        </section>
    );
};

export default OfficeSection;
