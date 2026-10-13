import { Eye, Target } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import { SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";


/** One card per row pair: `<key>Title` + `<key>Description`. */
const CARDS = [
    { key: "mission", Icon: Target },
    { key: "vision", Icon: Eye },
] as const;

/** Concentric rings with the single `illustration` image (the floating glass icons) laid over them. */
const OrbitIllustration = ({ data }: { data: Record<string, TranslateContentResponseDto> }) => {
    const illustrationPictureAttributes = extractAttributes<PictureAttributes>(data?.illustration);

    return (
        <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem]">
            {[100, 75, 50].map((size) => (
                <span
                    key={size}
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--border-on-light)"
                    style={{ width: `${size}%`, height: `${size}%` }}
                />
            ))}
            {/* a touch wider than the rings, like the design — icons sit on and just outside the outer ring */}
            <FillImage
                draggable={false}
                src={illustrationPictureAttributes?.mediaStorageKey ?? ""}
                alt={illustrationPictureAttributes?.mediaAltText ?? ""}
                width={illustrationPictureAttributes?.width}
                height={illustrationPictureAttributes?.height}
                sizes="(max-width: 640px) 90vw, 480px"
                wrapperClassName="absolute left-1/2 top-1/2 aspect-[6/5] w-[115%] -translate-x-1/2 -translate-y-1/2"
                className="object-contain"
            />
        </div>
    );
};

interface MissionVisionSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const MissionVisionSection = ({ data }: MissionVisionSectionProps) => {
    if (!data) return null;

    return (
    <section id="mission-and-vision" className="w-full py-16 sm:py-20 lg:py-28">
        <div className={cn(SECTION_CONTAINER_CLASSNAME, "grid items-center gap-12 lg:grid-cols-2 lg:gap-16")}>
            <FadeIn>
                <OrbitIllustration data={data} />
            </FadeIn>

            <div className="flex flex-col gap-6 sm:gap-8">
                {CARDS.map(({ key: icon, Icon }, index) => {
                    const itemTitle = data?.[`${icon}Title`]?.value;
                    const itemDescription = data?.[`${icon}Description`]?.value;

                    return (
                        <FadeIn
                            key={icon}
                            delay={120 + index * 100}
                            className={cn(
                                "rounded-[2rem] bg-(--surface-card) px-6 py-7 sm:rounded-[2.5rem] sm:px-10 sm:py-10",
                                "shadow-[var(--shadow-md)]",
                            )}
                        >
                            <div className="flex items-center gap-5">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--icon-accent) text-(--text-on-dark)">
                                    <Icon aria-hidden className="size-5" strokeWidth={2} />
                                </span>
                                <h3 className="text-2xl font-bold text-(--text-on-light) sm:text-[1.75rem]">
                                    {itemTitle}
                                </h3>
                            </div>
                            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-(--text-on-light) sm:pl-[3.75rem]">
                                {itemDescription}
                            </p>
                        </FadeIn>
                    );
                })}
            </div>
        </div>
    </section>
    );
};

export default MissionVisionSection;
