import { Eye, Target } from "lucide-react";

import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import { PIP_MOCK_IMAGE, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import { ABOUT_MOCK } from "./about-mock";

const MOCK = ABOUT_MOCK.missionVision;

const ICONS = { mission: Target, vision: Eye };

/** Glass tiles orbiting the centre one, as % of the orbit box. */
const ORBIT_TILES = [
    { left: 26, top: 16 },
    { left: 73, top: 16 },
    { left: 13, top: 66 },
    { left: 86, top: 60 },
    { left: 42, top: 88 },
];

const OrbitIllustration = () => (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem]">
        {[100, 75, 50].map((size) => (
            <span
                key={size}
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--border-on-light)"
                style={{ width: `${size}%`, height: `${size}%` }}
            />
        ))}
        <FillImage
            src={PIP_MOCK_IMAGE}
            alt=""
            sizes="96px"
            wrapperClassName="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl sm:size-24"
            className="object-cover"
        />
        {ORBIT_TILES.map(({ left, top }) => (
            <span
                key={`${left}-${top}`}
                className="absolute size-14 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl sm:size-20"
                style={{ left: `${left}%`, top: `${top}%` }}
            >
                <FillImage
                    src={PIP_MOCK_IMAGE}
                    alt=""
                    sizes="80px"
                    wrapperClassName="size-full"
                    className="object-cover"
                />
            </span>
        ))}
    </div>
);

interface MissionVisionSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const MissionVisionSection = ({ data }: MissionVisionSectionProps) => (
    <section id="mission-and-vision" className="w-full py-16 sm:py-20 lg:py-28">
        <div className={cn(SECTION_CONTAINER_CLASSNAME, "grid items-center gap-12 lg:grid-cols-2 lg:gap-16")}>
            <FadeIn>
                <OrbitIllustration />
            </FadeIn>

            <div className="flex flex-col gap-6 sm:gap-8">
                {MOCK.items.map(({ icon, title, description }, index) => {
                    const Icon = ICONS[icon];
                    const itemTitle = data?.[`${icon}Title`]?.value || title;
                    const itemDescription = data?.[`${icon}Description`]?.value || description;

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

export default MissionVisionSection;
