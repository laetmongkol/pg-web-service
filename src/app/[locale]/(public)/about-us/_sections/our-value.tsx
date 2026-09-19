import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

type ContentSections = Record<string, Record<string, TranslateContentResponseDto>>;

interface OurValueProps {
    /** The whole AboutUs content map — the cards borrow artwork from the sections
     *  that already carry media, until this one gets CMS fields of its own. */
    data?: ContentSections;
}

const EYEBROW = "Our Value";

const TITLE_PARTS = [
    { text: "ค่านิยม", highlight: false },
    { text: "ขององกรณ์เรา", highlight: true },
];

interface ValueCard {
    title: string;
    /** Shown over the blurred photo on hover — one entry per line. */
    lines: string[];
    /** Which CMS section + field the photo comes from. */
    image: { section: string; key: string };
    /** Puts the label under the card and drops it half a step, for the zigzag. */
    labelBelow?: boolean;
}

const VALUES: ValueCard[] = [
    {
        title: "ความโปร่งใส",
        lines: ["เราทำงานด้วยความซื่อสัตย์ ตรวจสอบได้", "และยึดมั่นในจริยธรรมสูงสุด"],
        image: { section: "6", key: "visionImage" },
    },
    {
        title: "ความเชี่ยวชาญ",
        // Placeholder copy — only the first card's text came with the design.
        lines: ["ทีมที่ปรึกษาที่เข้าใจธุรกิจจากภายใน", "และลงมือทำจริงเคียงข้างคุณ"],
        image: { section: "7", key: "image1" },
        labelBelow: true,
    },
    {
        title: "ความสำเร็จของลูกค้า",
        // Placeholder copy — only the first card's text came with the design.
        lines: ["เราวัดความสำเร็จของเรา", "จากผลลัพธ์ที่ลูกค้าได้รับ"],
        image: { section: "7", key: "image2" },
    },
    {
        title: "นวัตกรรม",
        // Placeholder copy — only the first card's text came with the design.
        lines: ["มองหาวิธีใหม่ที่ทำให้ธุรกิจ", "เติบโตได้เร็วและยั่งยืน"],
        image: { section: "6", key: "missionImage" },
        labelBelow: true,
    },
];

const OurValue = ({ data }: OurValueProps) => {
    const cards = VALUES.map((card) => {
        const attributes = extractAttributes<PictureAttributes>(
            data?.[card.image.section]?.[card.image.key],
        );

        return {
            ...card,
            picture: {
                src: attributes?.mediaStorageKey ?? "",
                alt: attributes?.mediaAltText || card.title,
            },
        };
    });

    return (
        <section
            id="our-value"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
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

                    <ul
                        className={cn(
                            "mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5",
                        )}
                    >
                        {cards.map(({ title, lines, picture, labelBelow }) => (
                            <li
                                key={title}
                                className={cn(
                                    "flex gap-5",
                                    labelBelow ? "flex-col-reverse lg:mt-12" : "flex-col",
                                )}
                            >
                                <h3
                                    className={cn(
                                        "text-center font-medium text-(--text-primary)",
                                        "text-sm md:text-base",
                                    )}
                                >
                                    {title}
                                </h3>

                                <div
                                    className={cn(
                                        "group relative aspect-3/4 w-full overflow-hidden rounded-[2.5rem]",
                                        // silver wash behind the photo — what shows while the CMS image is missing
                                        "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                                    )}
                                >
                                    <FillImage
                                        src={picture.src}
                                        alt={picture.alt}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        wrapperClassName="absolute inset-0 h-full w-full"
                                        className={cn(
                                            "h-full w-full object-cover object-center",
                                            // scale hides the transparent fringe a blur leaves at the edges
                                            "transition duration-500 group-hover:scale-105 group-hover:blur-[3px]",
                                        )}
                                    />

                                    <div
                                        className={cn(
                                            "absolute inset-0 flex items-center justify-center px-6 text-center",
                                            "bg-(--color-primary)/45 backdrop-blur-[2px]",
                                            "opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                                        )}
                                    >
                                        <p
                                            className={cn(
                                                "whitespace-pre-line text-(--text-invert)",
                                                "text-xs leading-loose md:text-sm",
                                            )}
                                        >
                                            {lines.join("\n")}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </FadeIn>
        </section>
    );
};

export default OurValue;
