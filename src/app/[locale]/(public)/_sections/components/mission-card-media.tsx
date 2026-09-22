import { type CSSProperties } from "react";

import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FillImage from "@/components/fill-image.component";

/**
 * Inline, not `transition-*` utilities: `src/styles/base-transitions.css` sets
 * `transition-property` on `*` outside any cascade layer, which beats every Tailwind
 * transition utility. Inline styles are the only thing that wins — and they still render
 * on the server, so this whole card stays a server component.
 */
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const FADE_TRANSITION: CSSProperties = {
    transitionProperty: "opacity",
    transitionDuration: "300ms",
    transitionTimingFunction: EASING,
};
/** Tailwind v4 translate utilities drive the `translate` property, not `transform`. */
const FADE_SLIDE_TRANSITION: CSSProperties = {
    transitionProperty: "opacity, translate",
    transitionDuration: "300ms",
    transitionDelay: "60ms",
    transitionTimingFunction: EASING,
};

/**
 * Which path a device gets is decided by its pointer, not its width — a tablet is wide enough
 * for `lg` and still has nothing to hover with. `group-hover` is already inert on touch
 * (Tailwind v4 wraps it in `hover: hover`), and the focus reveal is limited to fine pointers
 * because tapping the label focuses the checkbox: a focus-driven reveal there would pin the
 * card open and leave the second tap unable to close it.
 */
const REVEAL = cn(
    "pointer-events-none opacity-0",
    "group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 peer-checked:opacity-100",
);
const SLIDE = "group-hover:translate-y-0 pointer-fine:group-focus-within:translate-y-0 peer-checked:translate-y-0";

export interface MissionCardMediaProps {
    image?: string;
    title: string;
    badge: string;
    value: string;
    caption: string;
}

/**
 * Touch screens have no hover, so a hidden checkbox turns the overlay into a tap toggle there —
 * tap to show, tap again to hide. No JavaScript involved on either path.
 */
const MissionCardMedia = ({ image, title, badge, value, caption }: MissionCardMediaProps) => {
    const toggleId = `mission-reveal-${title.replace(/\s+/g, "-")}`;

    return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <input id={toggleId} type="checkbox" aria-label={title} className="peer sr-only" />

            {image ? (
                <FillImage
                    src={image}
                    alt={title}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    wrapperClassName="h-full w-full"
                    className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                />
            ) : (
                <div aria-hidden className="h-full w-full bg-[image:var(--brand-gradient-silver)]" />
            )}

            {/* the tap target exists wherever a touch pointer does, phone or tablet */}
            <label htmlFor={toggleId} className="absolute inset-0 z-1 hidden cursor-pointer any-pointer-coarse:block" />

            {/* the darkened, captioned state in the design is the hover, so it sits on every card
                and fades in rather than being baked into the first one */}
            <div
                aria-hidden
                style={FADE_TRANSITION}
                className={cn(
                    "absolute inset-0 bg-linear-to-t from-(--color-primary-400) via-(--color-primary-400)/30 to-transparent",
                    REVEAL,
                )}
            />
            <span
                style={FADE_SLIDE_TRANSITION}
                className={cn(
                    "absolute top-4 left-4 flex items-center gap-2 rounded-full",
                    "bg-(--color-primary-400)/60 px-3 py-1 backdrop-blur-xs",
                    "text-[11px] font-medium text-(--text-invert)",
                    "-translate-y-3",
                    REVEAL,
                    SLIDE,
                )}
            >
                <span className="size-1.5 shrink-0 rounded-full bg-(--text-invert)" />
                {badge}
            </span>
            <div
                style={FADE_SLIDE_TRANSITION}
                className={cn(
                    "absolute inset-x-4 bottom-4 flex flex-col gap-1 text-start",
                    "translate-y-3",
                    REVEAL,
                    SLIDE,
                )}
            >
                <span className="text-2xl font-bold text-(--text-invert)">{value}</span>
                <span className="text-[11px] text-(--text-invert)/80">{caption}</span>
            </div>
        </div>
    );
};

export default MissionCardMedia;
