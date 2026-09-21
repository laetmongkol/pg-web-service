import { ChartNoAxesCombined, Expand, UserRoundPlus, Wrench, type LucideIcon } from "lucide-react";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

const EYEBROW = "Our Journey";

const TITLE_PARTS = [
    { text: "เส้นทาง", highlight: false },
    { text: "ความสำเร็จ", highlight: true },
    { text: "ของเรา", highlight: false },
];

interface JourneyStep {
    icon: LucideIcon;
    title: string;
    body: string;
}

const STEPS: JourneyStep[] = [
    {
        icon: Wrench,
        title: "ก่อตั้งบริษัท",
        body: "เริ่มต้นด้วยทีมงานขนาดเล็กที่มีวิสัยทัศน์กว้างไกลในการพลิกโฉมวงการที่ปรึกษา",
    },
    {
        icon: Expand,
        title: "ขยายฐานลูกค้า",
        body: "ขยายการให้บริการสู่องค์กรระดับองค์กรข้ามชาติ สร้างผลกระทบเชิงบวกในหลายอุตสาหกรรม",
    },
    {
        icon: UserRoundPlus,
        title: "ขยายขีดความสามารถ",
        body: "ต่อยอดองค์ความรู้และพัฒนากระบวนการทำงานด้วยเทคโนโลยีและเครื่องมือที่ทันสมัย",
    },
    {
        icon: ChartNoAxesCombined,
        title: "เติบโตอย่างไม่หยุดยั้ง",
        body: "ได้รับความไว้วางใจจากแบรนด์และองค์กรชั้นนำในหลากหลาย",
    },
];

const CONNECTOR_GAP = "calc(50% + 3rem)";

const CONNECTOR_CLASSNAME = cn(
    "pointer-events-none absolute inset-y-0 my-auto hidden h-0 lg:block",
    "border-t border-dashed border-(--color-primary-50)",
);

const OurJourney = () => {
    return (
        <section
            id="our-journey"
            className={cn("w-full bg-(--surface-page)", "pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-28")}
        >
            <div className={cn("mx-auto max-w-7xl", "px-4 sm:px-8")}>
                <div className="flex flex-col items-center text-center">
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full",
                                "border border-(--border-default) bg-(--surface-default)",
                                "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                            )}
                        >
                            <span className="bg-(--color-primary) size-1.5 shrink-0 rounded-full" />
                            {EYEBROW}
                        </span>
                    </FadeIn>

                    <FadeIn delay={90}>
                        <h2
                            className={cn(
                                "mt-8 font-bold text-balance text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {TITLE_PARTS.map(({ text, highlight }) => (
                                <span
                                    key={text}
                                    className={highlight ? "text-(--color-secondary-800)" : undefined}
                                >
                                    {text}
                                </span>
                            ))}
                        </h2>
                    </FadeIn>
                </div>

                <ol
                    className={cn(
                        "mt-10 grid grid-cols-1 gap-6",
                        "sm:mt-12 sm:grid-cols-2 sm:gap-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-0",
                    )}
                >
                    {STEPS.map(({ icon: Icon, title, body }, index) => (
                        <li key={title}>
                            <FadeIn
                                delay={index * 110}
                                className={cn(
                                    "flex h-full gap-4 text-left",
                                    "sm:flex-col sm:items-center sm:gap-0 sm:text-center",
                                )}
                            >
                                <div className="relative flex w-10 shrink-0 justify-center sm:w-full sm:shrink">
                                    {index < STEPS.length - 1 && (
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "pointer-events-none absolute top-12 -bottom-6 left-1/2 w-0 -translate-x-1/2",
                                                "border-l border-dashed border-(--color-primary-50) sm:hidden",
                                            )}
                                        />
                                    )}

                                    {index > 0 && (
                                        <span
                                            aria-hidden
                                            className={cn(CONNECTOR_CLASSNAME, "left-0")}
                                            style={{ right: CONNECTOR_GAP }}
                                        />
                                    )}
                                    {index < STEPS.length - 1 && (
                                        <span
                                            aria-hidden
                                            className={cn(CONNECTOR_CLASSNAME, "right-0")}
                                            style={{ left: CONNECTOR_GAP }}
                                        />
                                    )}

                                    <span
                                        className={cn(
                                            "relative flex size-10 shrink-0 items-center justify-center self-start",
                                            "rounded-xl sm:size-20 sm:self-auto sm:rounded-2xl",
                                            "border border-(--border-default) bg-(--surface-default)",
                                            "text-(--text-primary)",
                                        )}
                                    >
                                        <Icon className="size-5 sm:size-8" strokeWidth={1.5} />
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1 sm:flex-none sm:contents">
                                    <h3
                                        className={cn(
                                            "font-semibold text-(--text-primary)",
                                            "text-sm sm:mt-6 md:text-base",
                                        )}
                                    >
                                        {title}
                                    </h3>

                                    <p
                                        className={cn(
                                            "mt-2 text-(--text-secondary) sm:mt-4 sm:max-w-[19rem]",
                                            "text-xs leading-loose md:text-sm",
                                        )}
                                    >
                                        {body}
                                    </p>
                                </div>
                            </FadeIn>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default OurJourney;
