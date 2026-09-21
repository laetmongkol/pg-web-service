import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

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

const CARD_MEDIA_CLASSNAME = "relative aspect-[4/3] w-full overflow-hidden rounded-2xl";

/** Hidden until the card is hovered or keyboard-focused, so it reads as a state, not a variant. */
const OVERLAY_CLASSNAME = cn(
    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
    "group-hover:opacity-100 group-focus-within:opacity-100",
    "motion-reduce:transition-none",
);

const OurMissionSection = () => {
    return (
        <section
            id="our-mission"
            className={cn("w-full bg-(--surface-default)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <FadeIn className="flex flex-col items-center text-center">
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

                    <p className={cn("mt-6 max-w-4xl text-(--text-secondary)", "text-xs md:text-sm")}>
                        {DESCRIPTION}
                    </p>
                </FadeIn>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {MISSIONS.map((mission, index) => {
                        return (
                            <FadeIn
                                key={mission.title}
                                delay={index * 100}
                                className="group flex flex-col gap-4"
                            >
                                <div className={CARD_MEDIA_CLASSNAME}>
                                    {mission.image ? (
                                        <FillImage
                                            src={mission.image}
                                            alt={mission.title}
                                            width={800}
                                            height={600}
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            wrapperClassName="h-full w-full"
                                            className={cn(
                                                "h-full w-full object-cover",
                                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                                            )}
                                        />
                                    ) : (
                                        <div
                                            aria-hidden
                                            className="h-full w-full bg-[image:var(--brand-gradient-silver)]"
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
                                                "bg-(--color-primary-400)/60 px-3 py-1 backdrop-blur-xs",
                                                "text-[11px] font-medium text-(--text-invert)",
                                            )}
                                        >
                                            <span className="size-1.5 shrink-0 rounded-full bg-(--text-invert)" />
                                            {mission.badge}
                                        </span>
                                        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1 text-start">
                                            <span className="text-2xl font-bold text-(--text-invert)">
                                                {mission.value}
                                            </span>
                                            <span className="text-[11px] text-(--text-invert)/80">
                                                {mission.caption}
                                            </span>
                                        </div>
                                    </div>
                                </div>

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
