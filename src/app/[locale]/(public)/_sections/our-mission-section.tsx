import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import MissionCardMedia from "./components/mission-card-media";

const EYEBROW = "We & Our Mission";

const TITLE_PARTS = [
    { text: "“เราเป็นพาร์ทเนอร์ทางธุรกิจของคุณ\nเพื่อสร้าง", highlight: false },
    { text: "การเติบโตที่ยั่งยืน", highlight: true },
    { text: "ร่วมกัน”", highlight: false },
];

const DESCRIPTION =
    "มุ่งมั่นส่งมอบกลยุทธ์และโซลูชันทางการตลาดที่สร้างผลลัพธ์ได้จริง เพื่อให้ธุรกิจของคุณเติบโตอย่างแข็งแกร่งและยั่งยืน";

const PHOTO = "/api/app/image/contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png";

/**
 * `image` is a CMS media key; the cards are laid out for photos but render a brand-silver panel
 * while one is missing, so an unfilled slot never collapses the row. `badge` / `value` / `caption`
 * are the overlay the design puts on the photo — every card carries its own and shows it on hover.
 */
const MISSIONS = [
    {
        title: "เข้าใจธุรกิจ",
        description: "เราเริ่มจากการเข้าใจธุรกิจ เป้าหมาย และความต้องการอย่างแท้จริง",
        image: PHOTO,
        badge: "Understand",
        value: "92%",
        caption: "ของลูกค้ามีความพึงพอใจในการทำธุรกิจอย่างต่อเนื่อง",
    },
    {
        title: "วางกลยุทธ์",
        description: "เปลี่ยน Insight ให้เป็นกลยุทธ์การตลาดที่ชัดเจนและเหมาะกับแต่ละธุรกิจ",
        image: PHOTO,
        badge: "Strategy",
        value: "3 เท่า",
        caption: "การเข้าถึงกลุ่มเป้าหมายที่เพิ่มขึ้นหลังปรับกลยุทธ์",
    },
    {
        title: "เติบโตไปด้วยกัน",
        description: "ลงมือทำ วัดผล และพัฒนาอย่างต่อเนื่อง เพื่อสร้างการเติบโตที่ยั่งยืน",
        image: PHOTO,
        badge: "Grow",
        value: "40%",
        caption: "ยอดขายเฉลี่ยที่เติบโตขึ้นหลังทำงานร่วมกัน",
    },
];

const OurMissionSection = () => {
    return (
        <section
            id="our-mission"
            className={cn("w-full bg-(--surface-default)", "py-16 sm:py-20 lg:py-28")}
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
                            {EYEBROW}
                        </span>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <h2
                            className={cn(
                                "mt-8 font-bold text-balance whitespace-pre-line text-(--text-primary)",
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

                    <FadeIn
                        delay={200}
                        className={cn("mt-6 max-w-4xl text-(--text-secondary)", "text-xs md:text-sm")}
                    >
                        {DESCRIPTION}
                    </FadeIn>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {MISSIONS.map((mission, index) => {
                        return (
                            <FadeIn
                                key={mission.title}
                                delay={300 + index * 100}
                                className="group flex flex-col gap-4"
                            >
                                <MissionCardMedia
                                    image={mission.image}
                                    title={mission.title}
                                    badge={mission.badge}
                                    value={mission.value}
                                    caption={mission.caption}
                                />

                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-(--text-primary)">{mission.title}</h3>
                                    <p className="text-xs text-(--text-secondary) md:text-sm">
                                        {mission.description}
                                    </p>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OurMissionSection;
