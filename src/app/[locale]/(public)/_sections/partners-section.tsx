import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import DragMarquee from "../_shared/drag-marquee";
import { HOME_HEADING_GRADIENT_LIGHT_CLASSNAME, HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.partners;

const PartnerRow = ({ names }: { names: string[] }) => (
    <div className="flex w-max items-center">
        {names.map((name, index) => (
            <span
                key={`${name}-${index}`}
                className={cn(
                    "mx-2 flex w-40 shrink-0 items-center justify-center aspect-[29/9] sm:mx-2.5 sm:w-[12.5rem] sm:p-3",
                    "rounded-xl border border-(--border-on-light) bg-(--surface-card)",
                )}
            >
                {/* wide logo artwork fills the chip — no separate label */}
                <FillImage
                    src={HOME_MOCK_IMAGE}
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

interface PartnersSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const PartnersSection = ({ data }: PartnersSectionProps) => {
    const title1 = data?.title1?.value || MOCK.title1;
    const title2 = data?.title2?.value || MOCK.title2;
    const description = data?.description?.value || MOCK.description;

    return (
        <section id="partners" className="w-full pt-8 pb-14 sm:pt-12 lg:pb-20">
            <div
                className={cn(
                    "mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-8",
                    "lg:flex-row lg:items-end lg:justify-between",
                )}
            >
                <FadeIn>
                    <h2
                        className={cn(
                            HOME_HEADING_GRADIENT_LIGHT_CLASSNAME,
                            "font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.2]",
                        )}
                    >
                        <span className="block">{title1}</span>
                        <span className="block">{title2}</span>
                    </h2>
                </FadeIn>
                <FadeIn delay={100} className="max-w-md text-sm leading-relaxed text-(--text-on-light) lg:pb-2">
                    {description}
                </FadeIn>
            </div>

            <FadeIn delay={200} className="mt-10 flex flex-col gap-4 lg:mt-14">
                <DragMarquee copiesPerHalf={2}>
                    <PartnerRow names={MOCK.rows[0]} />
                </DragMarquee>
                {/* negative speed drifts the second row the other way */}
                <DragMarquee copiesPerHalf={2} speed={-18}>
                    <PartnerRow names={MOCK.rows[1]} />
                </DragMarquee>
            </FadeIn>
        </section>
    );
};

export default PartnersSection;
