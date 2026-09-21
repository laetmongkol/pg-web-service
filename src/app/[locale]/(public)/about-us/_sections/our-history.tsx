import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

const EYEBROW = "Our History";

const TITLE_PARTS = [
    { text: "“เราขับเคลื่อนการเติบโตด้วย", highlight: false },
    { text: "กลยุทธ์", highlight: true },
    { text: "และ", highlight: false },
    { text: "นวัตกรรม", highlight: true },
    { text: "”", highlight: false },
];

const SUB_TITLE = "จากจุดเริ่มต้น สู่การเดินทางที่สร้างคุณค่าและเติบโตไปพร้อมกับลูกค้า";

const DESCRIPTION =
    "ศรีวิไลก่อตั้งขึ้นจากความตั้งใจที่จะเป็นที่ปรึกษาที่เข้าใจธุรกิจจากภายใน ไม่ใช่แค่ผู้ส่งมอบ รายงานหรือแผนสวยงามที่วางบนหิ้ง เราทำงานเคียงข้างเจ้าของธุรกิจ และทีมผู้บริหาร เพื่อแปลงข้อมูลและความเข้าใจตลาดให้กลายเป็นแผนงานที่ลงมือทำได้จริงทีมของเราผสมผสานทักษะด้านกลยุทธ์ธุรกิจ การสร้างแบรนด์ และการตลาดดิจิทัลเข้าไว้ด้วยกัน เพื่อให้ทุกคำแนะนำ มีทั้งความแม่นยำเชิงตัวเลขและความเข้าใจในพฤติกรรมของผู้บริโภคอย่างแท้จริง";

const OurHistory = () => {
    return (
        <section
            id="our-history"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
        >
            <div
                className={cn(
                    "mx-auto flex max-w-7xl flex-col items-center text-center",
                    "px-4 sm:px-8",
                )}
            >
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

                <FadeIn delay={180}>
                    <p
                        className={cn(
                            "mt-8 max-w-3xl text-(--text-secondary)",
                            "text-xs leading-relaxed md:text-sm",
                        )}
                    >
                        {SUB_TITLE}
                    </p>
                </FadeIn>

                <FadeIn delay={270}>
                    <p
                        className={cn(
                            "mt-8 max-w-4xl text-(--text-secondary)",
                            "text-sm leading-loose md:text-base",
                        )}
                    >
                        {DESCRIPTION}
                    </p>
                </FadeIn>
            </div>
        </section>
    );
};

export default OurHistory;
