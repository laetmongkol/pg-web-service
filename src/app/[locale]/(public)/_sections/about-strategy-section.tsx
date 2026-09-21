import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

const EYEBROW = "Sriwilai Bangkok";
const TITLE = "เราเชื่อว่ากลยุทธ์ที่ดี ต้องนำไปใช้ได้จริง";

const DESCRIPTION_LINES = "ประกอบกิจการให้บริการด้านการวางแผนกลยุทธ์การตลาดออนไลน์แบบครบวงจร สำหรับธุรกิจในยุคดิจิทัล ครอบคลุมตั้งแต่การวิเคราะห์ธุรกิจและกลุ่มเป้าหมาย การวางแผนและกำหนดทิศทางการตลาด การสร้างแบรนด์และการสื่อสาร การผลิตคอนเทนต์ ตลอดจนการวางแผนและบริหารสื่อโฆษณาออนไลน์ทุกรูปแบบ เพื่อช่วยเพิ่มการรับรู้ สร้างโอกาสทางธุรกิจ เข้าถึงกลุ่มลูกค้าได้อย่างมีประสิทธิภาพ และสนับสนุนการเติบโตของธุรกิจอย่างยั่งยืน";

const STATS = [
    { value: "20+", label: "ทีมงานผู้เชี่ยวชาญ" },
    { value: "99%", label: "ความพึงพอใจจากลูกค้า" },
    { value: "10+", label: "โปรเจกต์ที่ส่งมอบแล้ว" },
    { value: "3", label: "รางวัลการันตี" },
];

/** CMS media key for the office photo that closes the panel. */
const OFFICE_IMAGE = "/api/app/image/contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png";
const OFFICE_ALT = "สำนักงาน Sriwilai Consulting & Marketing Agency";
const OFFICE_WIDTH = 1536;
const OFFICE_HEIGHT = 1024;

const AboutStrategySection = () => {
    return (
        <section
            id="about-us"
            className={cn("w-full bg-(--surface-default)", "py-16 sm:py-20 lg:py-24")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                {/* one rounded panel: copy and stats on top, the photo bleeding to its bottom edge */}
                <div
                    className={cn(
                        "flex flex-col items-center overflow-hidden rounded-3xl bg-(--surface-page)",
                        "px-4 pt-12 sm:px-10 sm:pt-16",
                    )}
                >
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full",
                                "border border-(--border-default) bg-(--surface-elevated)",
                                "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                            )}
                        >
                            <span className="bg-(--text-primary) size-1.5 shrink-0 rounded-full" />
                            {EYEBROW}
                        </span>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <h2
                            className={cn(
                                "mt-8 text-center font-bold text-balance text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {TITLE}
                        </h2>
                    </FadeIn>

                    <FadeIn
                        delay={200}
                        className={cn(
                            "mt-8 max-w-5xl text-center whitespace-pre-line text-(--text-secondary)",
                            "text-xs leading-loose md:text-sm",
                        )}
                    >
                        {DESCRIPTION_LINES}
                    </FadeIn>

                    <dl className="mt-12 grid w-full grid-cols-2 gap-8 lg:grid-cols-4">
                        {STATS.map((stat, index) => (
                            <FadeIn
                                key={stat.label}
                                delay={300 + index * 100}
                                className="flex flex-col items-center gap-2 text-center"
                            >
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="flex flex-col items-center gap-2">
                                    <CountUpNumber
                                        value={stat.value}
                                        className={cn(
                                            "font-bold text-(--text-primary)",
                                            "text-2xl sm:text-3xl lg:text-4xl",
                                        )}
                                    />
                                    <span className="text-xs text-(--text-secondary)">{stat.label}</span>
                                </dd>
                            </FadeIn>
                        ))}
                    </dl>

                    <FadeIn delay={200} className="mt-12 w-full">
                        <FillImage
                            src={OFFICE_IMAGE}
                            alt={OFFICE_ALT}
                            width={OFFICE_WIDTH}
                            height={OFFICE_HEIGHT}
                            sizes="(max-width: 1024px) 100vw, 1200px"
                            wrapperClassName="w-full overflow-hidden rounded-t-2xl"
                            className={cn(
                                "h-[220px] w-full object-cover sm:h-[360px] lg:h-[460px]",
                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                            )}
                        />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default AboutStrategySection;
