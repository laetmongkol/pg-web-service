import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import DragMarquee from "./components/drag-marquee";

/** A handful of logos only spans ~700px, so each half of the track repeats them on a wide screen. */
const COPIES_PER_HALF = 3;

/** Row height — every logo locks to this and keeps its own ratio. */
const ROW_HEIGHT = "h-8 sm:h-10";

interface TrustedPartnerSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const TrustedPartnerSection = ({ data }: TrustedPartnerSectionProps) => {
    if (!data) return null;

    // attributes on `partner*` — the picture; the brand name is the row value
    const partners = convertObjectToArrayByPrefix<PictureAttributes>(data, "partner");

    const partnerRow = (
        <div className="flex w-max items-center">
            {partners.map((partner) => (
                <span key={partner.key} className="mx-8 flex shrink-0 items-center sm:mx-12">
                    <FillImage
                        src={partner.attributes?.mediaStorageKey ?? ""}
                        alt={partner.attributes?.mediaAltText ?? partner.value ?? ""}
                        width={partner.attributes?.width}
                        height={partner.attributes?.height}
                        /* eager: an unloaded logo measures 0 wide and would collapse the track */
                        loading="eager"
                        draggable={false}
                        wrapperClassName={cn("w-auto shrink-0", ROW_HEIGHT)}
                        /* aspect-auto drops the ratio implied by width/height so the real file decides */
                        className="aspect-auto h-full w-auto max-w-none object-contain"
                    />
                </span>
            ))}
        </div>
    );

    return (
        <section
            id="trusted-partner"
            className={cn("w-full bg-(--surface-elevated)", "py-12 sm:py-16")}
        >
            <div className={cn("mx-auto flex max-w-7xl flex-col items-center", "px-4 sm:px-8")}>
                <FadeIn>
                    <span className="text-xs text-(--text-secondary)">{data?.title?.value}</span>
                </FadeIn>

                {partners.length > 0 ? (
                    <FadeIn delay={100} className="mt-8 w-full">
                        <DragMarquee copiesPerHalf={COPIES_PER_HALF}>{partnerRow}</DragMarquee>
                    </FadeIn>
                ) : null}
            </div>
        </section>
    );
};

export default TrustedPartnerSection;
