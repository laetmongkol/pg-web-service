import { FaMicrosoft } from "react-icons/fa6";
import { SiGooglemeet, SiMeta, SiZoom } from "react-icons/si";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import DragMarquee from "./components/drag-marquee";

import type { IconType } from "react-icons";

const TITLE = "Trusted Partner";

/**
 * `image` is the CMS media key for the full wordmark (mark + name as one artwork), which is what
 * the design shows. Until one is uploaded the row falls back to the brand mark from react-icons —
 * the glyph only, since there is no wordmark to draw. `width` / `height` are the artwork's own
 * pixels and only cap the srcset; the row height and `object-contain` decide what is drawn.
 */
interface Partner {
    name: string;
    image: string;
    width: number;
    height: number;
    /** Fallback mark, used while `image` is empty. */
    Icon: IconType;
    /** Brand colour for the fallback mark. */
    iconClassName: string;
}

const PARTNERS: Partner[] = [
    { name: "Meta", image: "", width: 400, height: 160, Icon: SiMeta, iconClassName: "text-[#0081FB]" },
    { name: "Google Meet", image: "", width: 400, height: 160, Icon: SiGooglemeet, iconClassName: "text-[#00AC47]" },
    { name: "Microsoft", image: "", width: 400, height: 160, Icon: FaMicrosoft, iconClassName: "text-[#F25022]" },
    { name: "Zoom", image: "", width: 400, height: 160, Icon: SiZoom, iconClassName: "text-[#0B5CFF]" },
];

/** Four logos only span ~700px, so each half of the track repeats them to fill a wide screen. */
const COPIES_PER_HALF = 3;

/** Row height — every logo locks to this and keeps its own ratio. */
const ROW_HEIGHT = "h-8 sm:h-10";

const PartnerRow = () => (
    <div className="flex w-max items-center">
        {PARTNERS.map(({ name, image, width, height, Icon, iconClassName }) => (
            <span key={name} className="mx-8 flex shrink-0 items-center sm:mx-12">
                {image ? (
                    <FillImage
                        src={image}
                        alt={name}
                        width={width}
                        height={height}
                        sizes="200px"
                        /* eager: an unloaded logo measures 0 wide and would collapse the track */
                        loading="eager"
                        draggable={false}
                        wrapperClassName={cn("w-auto shrink-0", ROW_HEIGHT)}
                        /* aspect-auto drops the ratio implied by width/height so the real file decides */
                        className="aspect-auto h-full w-auto max-w-none object-contain"
                    />
                ) : (
                    <>
                        <Icon aria-hidden className={cn("size-8 shrink-0 sm:size-10", iconClassName)} />
                        {/* the mark carries the brand; the name stays for screen readers only */}
                        <span className="sr-only">{name}</span>
                    </>
                )}
            </span>
        ))}
    </div>
);

const TrustedPartnerSection = () => {
    return (
        <section
            id="trusted-partner"
            className={cn("w-full bg-(--surface-elevated)", "py-12 sm:py-16")}
        >
            <FadeIn className={cn("mx-auto flex max-w-7xl flex-col items-center", "px-4 sm:px-8")}>
                <span className="text-xs text-(--text-secondary)">{TITLE}</span>

                <DragMarquee copiesPerHalf={COPIES_PER_HALF} className="mt-8">
                    <PartnerRow />
                </DragMarquee>
            </FadeIn>
        </section>
    );
};

export default TrustedPartnerSection;
