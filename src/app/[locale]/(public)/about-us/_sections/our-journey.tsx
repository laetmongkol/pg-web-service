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
            <FadeIn>
                <div className={cn("mx-auto max-w-7xl", "px-4 sm:px-8")}>
                    <div className="flex flex-col items-center text-center">
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
                    </div>

                    <ol
                        className={cn(
                            "mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:mt-20 lg:gap-x-0",
                            "lg:grid-cols-4",
                        )}
                    >
                        {STEPS.map(({ icon: Icon, title, body }, index) => (
                            <li key={title} className="flex flex-col items-center text-center">
                                <div className="relative flex w-full items-center justify-center">
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
                                            "relative flex size-20 shrink-0 items-center justify-center rounded-2xl",
                                            "border border-(--border-default) bg-(--surface-default)",
                                            "text-(--text-primary)",
                                        )}
                                    >
                                        <Icon className="size-8" strokeWidth={1.5} />
                                    </span>
                                </div>

                                <h3
                                    className={cn(
                                        "mt-6 font-semibold text-(--text-primary)",
                                        "text-sm md:text-base",
                                    )}
                                >
                                    {title}
                                </h3>

                                <p
                                    className={cn(
                                        "mt-4 max-w-[19rem] text-(--text-secondary)",
                                        "text-xs leading-loose md:text-sm",
                                    )}
                                >
                                    {body}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </FadeIn>
        </section>
    );
};

export default OurJourney;
