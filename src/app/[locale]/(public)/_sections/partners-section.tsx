import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import DragMarquee from "../_shared/drag-marquee";
import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../_shared/styles";

const PARTNER_KEYS = Array.from({ length: 12 }, (_, index) => `partner${index + 1}`);

interface PartnerLogo {
    name: string;
    image: string;
}

const PartnerRow = ({ logos }: { logos: PartnerLogo[] }) => (
    <div className="flex w-max items-center">
        {logos.map(({ name, image }, index) => (
            <span
                key={`${name}-${index}`}
                className={cn(
                    "mx-2 flex w-40 shrink-0 items-center justify-center aspect-[29/9] sm:mx-2.5 sm:w-[12.5rem] sm:p-3",
                    "rounded-xl border border-(--border-on-light) bg-(--surface-card)",
                )}
            >
                {/* wide logo artwork fills the chip — no separate label */}
                <FillImage
                    src={image}
                    alt={name}
                    sizes="160px"
                    /* eager: an unloaded logo measures 0 wide and would collapse the track */
                    loading="eager"
                    draggable={false}
                    wrapperClassName="w-full overflow-hidden rounded-sm aspect-[29/9]"
                    className="object-cover"
                />
            </span>
        ))}
    </div>
);

/** partner1..12 image rows — value is the brand name, the logo is the row's picture. */
function getPartnerLogos(data: Record<string, TranslateContentResponseDto>): PartnerLogo[] {
    return PARTNER_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        const pictureAttributes = extractAttributes<PictureAttributes>(item);
        return [{ name: item.value, image: pictureAttributes?.mediaStorageKey ?? "" }];
    });
}

interface PartnersSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const PartnersSection = ({ data }: PartnersSectionProps) => {
    if (!data) return null;
    const logos = getPartnerLogos(data);
    // two rows drifting in opposite directions
    const half = Math.ceil(logos.length / 2);
    const rows = [logos.slice(0, half), logos.slice(half)];

    return (
        <section id="partners" className="w-full pt-8 pb-16 lg:pt-12 lg:pb-20">
            <div
                className={cn(
                    "mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-8",
                    "lg:flex-row lg:items-end lg:justify-between",
                )}
            >
                <FadeIn>
                    <h2
                        className={cn(
                            HEADING_GRADIENT_LIGHT_CLASSNAME,
                            "font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.2]",
                        )}
                    >
                        <span className="block">{data?.title1?.value}</span>
                        <span className="block">{data?.title2?.value}</span>
                    </h2>
                </FadeIn>
                <FadeIn delay={100} className="max-w-md whitespace-pre-line text-sm leading-relaxed text-(--text-on-light) lg:pb-2">
                    {data?.description?.value}
                </FadeIn>
            </div>

            <FadeIn delay={200} className="mt-10 flex flex-col gap-4 lg:mt-14">
                <DragMarquee copiesPerHalf={2}>
                    <PartnerRow logos={rows[0]} />
                </DragMarquee>
                {/* negative speed drifts the second row the other way */}
                <DragMarquee copiesPerHalf={2} speed={-18}>
                    <PartnerRow logos={rows[1]} />
                </DragMarquee>
            </FadeIn>
        </section>
    );
};

export default PartnersSection;
