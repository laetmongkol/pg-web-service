import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import { SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

const STAT_KEYS = ["stat1", "stat2", "stat3"] as const;

type WhyChooseStat = {
    key: string;
    value: string;
    label: string;
};

/** stat1..3 — value is the figure, attribute1 the label under it. */
function getStats(data: Record<string, TranslateContentResponseDto>): WhyChooseStat[] {
    return STAT_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];
        return [{ key, value: item.value, label: item.attribute1 ?? "" }];
    });
}

interface WhyChooseSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** White card with the phone photo breaking out of its top edge, copy and three stats on the right. */
const WhyChooseSection = ({ data }: WhyChooseSectionProps) => {
    if (!data) return null;
    const stats = getStats(data);
    const photoPictureAttributes = extractAttributes<PictureAttributes>(data?.photo);

    return (
        <section id="why-choose-us" className="w-full pb-16 pt-24 sm:pb-20 lg:pb-24 lg:pt-36">
            <FadeIn className={SECTION_CONTAINER_CLASSNAME}>
                <div className="relative grid rounded-[2rem] bg-(--surface-card) sm:rounded-[2.5rem] lg:grid-cols-2">
                    {/* Cut-out hand + phone: the image layer starts ~5rem above the card so the phone pokes
                        out of the top edge, and sits on the card's bottom so the wrist runs into the
                        bottom-left corner — only that corner is clipped to the card's curve. */}
                    <div className="relative h-80 sm:h-[26rem] lg:h-auto lg:min-h-[28rem]">
                        <FillImage
                            src={photoPictureAttributes?.mediaStorageKey ?? ""}
                            alt={photoPictureAttributes?.mediaAltText ?? ""}
                            width={photoPictureAttributes?.width}
                            height={photoPictureAttributes?.height}
                            sizes="(max-width: 1024px) 100vw, 640px"
                            wrapperClassName={cn(
                                "absolute inset-x-0 bottom-0 -top-16 overflow-hidden lg:-top-20",
                                "lg:rounded-bl-[2.5rem]",
                            )}
                            className="object-contain object-bottom lg:object-left-bottom"
                        />
                    </div>

                    <div className="flex flex-col justify-center px-6 py-10 text-(--text-on-light) sm:px-12 lg:py-16 lg:pl-6 lg:pr-16">
                        <h2
                            className={cn(
                                "font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1.25]",
                                "bg-[image:var(--gradient-heading-on-light)] bg-clip-text text-transparent",
                            )}
                        >
                            <span className="block">{data?.title1?.value}</span>
                            <span className="block">{data?.title2?.value}</span>
                        </h2>
                        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed sm:text-base">{data?.description?.value}</p>

                        <ul className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
                            {stats.map(({ key, value, label }) => (
                                <li key={key} className="flex flex-col">
                                    <span className="text-2xl font-bold sm:text-[2rem]">{value}</span>
                                    <span className="mt-1.5 text-[0.6875rem] leading-snug">{label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
};

export default WhyChooseSection;
