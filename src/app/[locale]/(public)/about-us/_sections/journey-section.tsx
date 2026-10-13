import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import PillLabel from "../../_shared/pill-label";
import { HEADING_GRADIENT_DARK_CLASSNAME, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

/**
 * Node centres on the desktop curve, as % of the timeline box — same order as MILESTONE_KEYS.
 * The path below runs through these points in a 1000×480 viewBox (x × 10, y × 4.8).
 */
const NODE_POSITIONS = [
    { left: 9, top: 50 },
    { left: 30, top: 38 },
    { left: 56, top: 30 },
    { left: 73, top: 4 },
];
const CURVE_PATH =
    "M0,200 C40,225 70,245 90,240 C150,235 230,190 300,182 C400,170 480,170 560,144 C630,120 670,40 730,20 C790,4 860,0 920,0";

const Node = () => (
    <span className="flex size-12 items-center justify-center rounded-full bg-(--surface-card) lg:size-14">
        <span className="size-4 rounded-full bg-(--section-dark) lg:size-5" />
    </span>
);

interface JourneySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const MILESTONE_KEYS = ["milestone1", "milestone2", "milestone3", "milestone4"] as const;

/** The three photos under the timeline, the middle one raised. */
const PHOTO_KEYS = ["photo1", "photo2", "photo3"] as const;

type Milestone = {
    key: string;
    year: string;
    title: string;
    description: string;
};

/** milestone1..4 — value is the year, attribute1 the title, attribute2 the description. */
function getMilestones(data: Record<string, TranslateContentResponseDto>): Milestone[] {
    return MILESTONE_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];
        return [{ key, year: item.value, title: item.attribute1 ?? "", description: item.attribute2 ?? "" }];
    });
}

const JourneySection = ({ data }: JourneySectionProps) => {
    if (!data) return null;
    const milestones = getMilestones(data);

    return (
        <section id="our-journey" className="w-full overflow-hidden py-16 text-(--text-on-dark) sm:py-20 lg:py-24">
            <div className={SECTION_CONTAINER_CLASSNAME}>
                <FadeIn>
                    <PillLabel tone="dark">{data?.label?.value}</PillLabel>
                </FadeIn>
                <FadeIn delay={80}>
                    <h2
                        className={cn(
                            HEADING_GRADIENT_DARK_CLASSNAME,
                            "mt-5 w-fit font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem]",
                        )}
                    >
                        {data?.title?.value}
                    </h2>
                </FadeIn>
                <FadeIn delay={140} className="mt-5 whitespace-pre-line text-sm leading-relaxed sm:text-base">
                    {data?.description?.value}
                </FadeIn>

                {/* Desktop: milestones ride a rising curve */}
                <FadeIn delay={200} className="relative mt-4 hidden h-[30rem] lg:block">
                    <svg
                        aria-hidden
                        viewBox="0 0 1000 480"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full overflow-visible"
                        fill="none"
                    >
                        <path
                            d={CURVE_PATH}
                            stroke="var(--line-accent)"
                            strokeWidth={3}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    {milestones.map(({ key, title: itemTitle, description: itemDescription, year }, index) => {
                        const position = NODE_POSITIONS[index];
                        if (!position) return null;
                        return (
                            <div
                                key={key}
                                className="absolute"
                                style={{ left: `${position.left}%`, top: `${position.top}%` }}
                            >
                                <div className="w-fit -translate-x-1/2 -translate-y-1/2">
                                    <Node />
                                </div>
                                <div className="mt-6 w-64 -translate-x-6">
                                    <p className="text-3xl font-bold">{year}</p>
                                    <p className="mt-4 text-lg font-bold">{itemTitle}</p>
                                    <p className="mt-2 whitespace-pre-line text-sm leading-snug text-(--text-body-on-dark)">
                                        {itemDescription}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </FadeIn>

                {/* Mobile / tablet: vertical line with dots */}
                <FadeIn delay={200} className="mt-10 lg:hidden">
                    <ol className="relative flex flex-col gap-8 border-l-2 border-(--line-accent) pl-7">
                        {milestones.map(({ key, year, title: itemTitle, description: itemDescription }) => (
                            <li key={key} className="relative">
                                <span
                                    aria-hidden
                                    className="absolute -left-[2.3rem] top-1 flex size-4 items-center justify-center rounded-full bg-(--surface-card)"
                                >
                                    <span className="size-1.5 rounded-full bg-(--section-dark)" />
                                </span>
                                <p className="text-2xl font-bold">{year}</p>
                                <p className="mt-1 text-base font-bold">{itemTitle}</p>
                                <p className="mt-1.5 whitespace-pre-line text-sm leading-snug text-(--text-body-on-dark)">
                                    {itemDescription}
                                </p>
                            </li>
                        ))}
                    </ol>
                </FadeIn>

                {/* Three photos, the middle one raised */}
                <FadeIn delay={120} className="mt-14 grid grid-cols-3 items-end gap-3 sm:gap-6 lg:mt-10 lg:gap-9">
                    {PHOTO_KEYS.map((key, index) => (
                        <FillImage
                            draggable={false}
                            key={key}
                            src={extractAttributes<PictureAttributes>(data?.[key])?.mediaStorageKey ?? ""}
                            alt={extractAttributes<PictureAttributes>(data?.[key])?.mediaAltText ?? ""}
                            sizes="(max-width: 1024px) 33vw, 400px"
                            wrapperClassName={cn(
                                "w-full overflow-hidden rounded-2xl sm:rounded-3xl",
                                index === 1 ? "aspect-[317/315] -translate-y-6 sm:-translate-y-8" : "aspect-[317/315]",
                            )}
                            className="object-cover"
                        />
                    ))}
                </FadeIn>
            </div>
        </section>
    );
};

export default JourneySection;
