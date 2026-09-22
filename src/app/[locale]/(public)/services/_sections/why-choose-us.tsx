import {
    ChartNoAxesColumn,
    Sparkles,
    SquareCheckBig,
    Target,
    type LucideIcon,
} from "lucide-react";

import { BACKEND_IMAGE_PREFIX } from "@/lib/media/image-loader";
import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

const PLACEHOLDER_IMAGE = `${BACKEND_IMAGE_PREFIX}gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp`;

const EYEBROW = "Why Choose us";

const TITLE = "ทำไมลูกค้าเลือกเรา";

const SUB_TITLE =
    "เราเชื่อว่าความสำเร็จมาจากความเข้าใจลึกซึ้ง การทำงานร่วมกัน และการตัดสินใจที่มีประสิทธิภาพ";

const IMAGE_ALT = "ทีมที่ปรึกษาของศรีวิไลทำงานร่วมกับลูกค้า";

interface Reason {
    Icon: LucideIcon;
    title: string;
    body: string;
}

const REASONS: Reason[] = [
    {
        Icon: Target,
        title: "เข้าใจธุรกิจก่อนเริ่มงาน",
        body: "เราให้ความสำคัญกับการเข้าใจธุรกิจ เป้าหมาย และความท้าทายอย่างลึกซึ้ง",
    },
    {
        Icon: Sparkles,
        title: "ผสานกลยุทธ์และความคิดสร้างสรรค์",
        body: "ทำงานร่วมกันแบบไร้รอยต่อเพื่อส่งมอบผลลัพธ์ที่เป็นเลิศและมีมิติ",
    },
    {
        Icon: ChartNoAxesColumn,
        title: "ขับเคลื่อนด้วยข้อมูลจริง",
        body: "วิเคราะห์ผลอย่างโปร่งใสและนำข้อมูลมาปรับปรุงแคมเปญสม่ำเสมอ",
    },
    {
        Icon: SquareCheckBig,
        title: "ดูแลครบ จบในที่เดียว",
        body: "ตั้งแต่การวางแผน สร้างสรรค์ จนถึงการลงมือทำ",
    },
];

const WhyChooseUs = () => {
    return (
        <section
            id="why-choose-us"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
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
                            {TITLE}
                        </h2>
                    </FadeIn>

                    <FadeIn delay={180}>
                        <p
                            className={cn(
                                "mt-6 max-w-3xl text-(--text-secondary)",
                                "text-xs leading-relaxed md:text-sm",
                            )}
                        >
                            {SUB_TITLE}
                        </p>
                    </FadeIn>
                </div>

                <div
                    className={cn(
                        "mt-12 grid grid-cols-1 gap-8",
                        "lg:mt-16 lg:grid-cols-[1.4fr_1fr] lg:gap-10",
                    )}
                >
                    <FadeIn
                        className={cn(
                            "relative overflow-hidden rounded-3xl",
                            "aspect-4/3 lg:aspect-auto lg:h-full",
                            "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                        )}
                    >
                        <FillImage
                            src={PLACEHOLDER_IMAGE}
                            alt={IMAGE_ALT}
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            wrapperClassName="absolute inset-0 h-full w-full"
                            className={cn(
                                "h-full w-full object-cover",
                                "object-[70%_center]",
                            )}
                        />
                    </FadeIn>

                    <ul className="flex flex-col gap-4 lg:gap-6">
                        {REASONS.map(({ Icon, title, body }, index) => (
                            <li key={title} className="flex">
                                <FadeIn
                                    delay={index * 110}
                                    className={cn(
                                        "flex w-full items-center gap-4 rounded-2xl p-5 lg:p-6",
                                        "border border-(--border-default) bg-(--surface-default)",
                                        "shadow-[0_8px_20px_-16px_rgb(0_0_0/0.25)]",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex size-11 shrink-0 items-center justify-center rounded-full",
                                            "bg-(--surface-page) text-(--text-primary)",
                                        )}
                                    >
                                        <Icon className="size-5" strokeWidth={1.6} />
                                    </span>

                                    <div className="min-w-0">
                                        <h3
                                            className={cn(
                                                "font-semibold text-(--text-primary)",
                                                "text-sm md:text-base",
                                            )}
                                        >
                                            {title}
                                        </h3>
                                        <p
                                            className={cn(
                                                "mt-2 text-(--text-secondary)",
                                                "text-xs leading-relaxed",
                                            )}
                                        >
                                            {body}
                                        </p>
                                    </div>
                                </FadeIn>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
