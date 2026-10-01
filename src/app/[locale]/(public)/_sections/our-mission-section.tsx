import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import TapRevealMedia from "./components/tap-reveal-media";

/** attributes on `mission*` — picture plus the overlay copy; the card title is the row value. */
interface MissionAttributes extends PictureAttributes {
    description?: string;
    badge?: string;
    value?: string;
    caption?: string;
}

const CARD_MEDIA_CLASSNAME = "relative aspect-[4/3] w-full overflow-hidden rounded-2xl";

// Same motion as Our Value on the about page. `base-transitions.css` sets `transition-property`
// on `*` outside any layer, so the transition utilities need `!` to win.
// Revealed on hover / keyboard focus; below `lg` (touch) a tap toggles it via `TapRevealMedia`.
// Variants are spelled out in full so Tailwind's scanner picks them up.
const HOVER_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!";

/** Hidden until revealed, so it reads as a state, not a variant. */
const OVERLAY_CLASSNAME = cn(
    "pointer-events-none absolute inset-0 opacity-0",
    "transition-opacity! duration-500! motion-reduce:transition-none!",
    HOVER_EASE,
    "group-hover:opacity-100 group-has-focus-visible:opacity-100",
    "max-lg:group-data-[active=true]/media:opacity-100",
);

/** Copy rises in after the scrim (delay on the way in only), so the reveal feels layered. */
const OVERLAY_CONTENT_CLASSNAME = cn(
    "translate-y-2 opacity-0",
    "transition-[opacity,translate]! duration-500!",
    HOVER_EASE,
    "group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150",
    "group-has-focus-visible:translate-y-0 group-has-focus-visible:opacity-100 group-has-focus-visible:delay-150",
    "max-lg:group-data-[active=true]/media:translate-y-0 max-lg:group-data-[active=true]/media:opacity-100",
    "max-lg:group-data-[active=true]/media:delay-150",
    "motion-reduce:translate-y-0 motion-reduce:transition-none!",
);

const MEDIA_ZOOM_CLASSNAME = cn(
    "transition-[scale,filter]! duration-700! motion-reduce:transition-none!",
    HOVER_EASE,
    "group-hover:scale-105 group-hover:blur-[3px]",
    "group-has-focus-visible:scale-105 group-has-focus-visible:blur-[3px]",
    "max-lg:group-data-[active=true]/media:scale-105 max-lg:group-data-[active=true]/media:blur-[3px]",
);

interface OurMissionSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const OurMissionSection = ({ data }: OurMissionSectionProps) => {
    if (!data) return null;

    const missions = convertObjectToArrayByPrefix<MissionAttributes>(data, "mission");

    return (
        <section
            id="our-mission"
            className={cn("w-full bg-(--surface-elevated)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <div className="flex flex-col items-center text-center">
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full",
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
                                "mt-8 font-bold text-balance whitespace-pre-line text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {data?.titleLead?.value}
                            <span className="text-(--color-secondary-800)">
                                {data?.titleHighlight?.value}
                            </span>
                            {data?.titleTail?.value}
                        </h2>
                    </FadeIn>

                    <FadeIn
                        delay={200}
                        className={cn("mt-6 max-w-4xl text-(--text-secondary)", "text-xs md:text-sm")}
                    >
                        {data?.description?.value}
                    </FadeIn>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {missions.map((mission, index) => (
                        <FadeIn
                            key={mission.key}
                            delay={300 + index * 100}
                            className="group flex flex-col gap-4"
                        >
                            <TapRevealMedia
                                className={CARD_MEDIA_CLASSNAME}
                                label={mission.value ?? undefined}
                            >
                                {mission.attributes?.mediaStorageKey ? (
                                    <FillImage
                                        src={mission.attributes.mediaStorageKey}
                                        alt={mission.attributes?.mediaAltText ?? mission.value ?? ""}
                                        width={mission.attributes?.width}
                                        height={mission.attributes?.height}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        wrapperClassName="h-full w-full"
                                        className={cn(
                                            "h-full w-full object-cover",
                                            MEDIA_ZOOM_CLASSNAME,
                                            BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                                        )}
                                    />
                                ) : (
                                    <div
                                        aria-hidden
                                        className={cn(
                                            "h-full w-full bg-[image:var(--brand-gradient-silver)]",
                                            MEDIA_ZOOM_CLASSNAME,
                                        )}
                                    />
                                )}

                                {/* the darkened, captioned state in the design is the hover,
                                    so it sits on every card and fades in rather than being
                                    baked into the first one */}
                                <div className={OVERLAY_CLASSNAME}>
                                    <div
                                        aria-hidden
                                        className="absolute inset-0 bg-linear-to-t from-(--color-primary-400) via-(--color-primary-400)/30 to-transparent"
                                    />
                                    <span
                                        className={cn(
                                            "absolute top-4 left-4 flex items-center gap-2 rounded-full",
                                            OVERLAY_CONTENT_CLASSNAME,
                                            "bg-(--color-primary-400)/60 px-3 py-1 backdrop-blur-xs",
                                            "text-[11px] font-medium text-(--text-invert)",
                                        )}
                                    >
                                        <span className="size-1.5 shrink-0 rounded-full bg-(--text-invert)" />
                                        {mission.attributes?.badge}
                                    </span>
                                    <div
                                        className={cn(
                                            "absolute inset-x-4 bottom-4 flex flex-col gap-1 text-start",
                                            OVERLAY_CONTENT_CLASSNAME,
                                        )}
                                    >
                                        <span className="text-2xl font-bold text-(--text-invert)">
                                            {mission.attributes?.value}
                                        </span>
                                        <span className="text-[11px] text-(--text-invert)/80">
                                            {mission.attributes?.caption}
                                        </span>
                                    </div>
                                </div>
                            </TapRevealMedia>

                            <div className="flex flex-col gap-2">
                                <h3 className="font-bold text-(--text-primary)">{mission.value}</h3>
                                <p className="text-xs text-(--text-secondary) md:text-sm">
                                    {mission.attributes?.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurMissionSection;
