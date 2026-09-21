import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

type ContentSections = Record<string, Record<string, TranslateContentResponseDto>>;

interface OurValueProps {
    data?: ContentSections;
}

const EYEBROW = "Our Value";

const TITLE_PARTS = [
    { text: "ค่านิยม", highlight: false },
    { text: "ขององกรณ์เรา", highlight: true },
];

interface ValueCard {
    title: string;
    body: string;
    image: { section: string; key: string };
    labelBelow?: boolean;
}

const VALUES: ValueCard[] = [
    {
        title: "ความโปร่งใส",
        body: "เราทำงานด้วยความซื่อสัตย์ ตรวจสอบได้และยึดมั่นในจริยธรรมสูงสุด",
        image: { section: "6", key: "visionImage" },
    },
    {
        title: "ความเชี่ยวชาญ",
        body: "ทีมที่ปรึกษาที่เข้าใจธุรกิจจากภายในและลงมือทำจริงเคียงข้างคุณ",
        image: { section: "7", key: "image1" },
        labelBelow: true,
    },
    {
        title: "ความสำเร็จของลูกค้า",
        body: "เราวัดความสำเร็จของเราจากผลลัพธ์ที่ลูกค้าได้รับ",
        image: { section: "7", key: "image2" },
    },
    {
        title: "นวัตกรรม",
        body: "มองหาวิธีใหม่ที่ทำให้ธุรกิจเติบโตได้เร็วและยั่งยืน",
        image: { section: "6", key: "missionImage" },
        labelBelow: true,
    },
];

const HOVER_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!";

const cornerClasses = (index: number, total: number, labelBelow: boolean) => {
    const first = index === 0;
    const last = index === total - 1;

    return cn(
        first || labelBelow ? "lg:rounded-tl-[3.75rem]" : "lg:rounded-tl-none",
        last || labelBelow ? "lg:rounded-tr-[3.75rem]" : "lg:rounded-tr-none",
        first || !labelBelow ? "lg:rounded-bl-[3.75rem]" : "lg:rounded-bl-none",
        last || !labelBelow ? "lg:rounded-br-[3.75rem]" : "lg:rounded-br-none",
    );
};

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

                <ul
                    className={cn(
                        "mt-10 grid grid-cols-2 gap-4",
                        "sm:mt-12 lg:mt-16 lg:grid-cols-4 lg:gap-1",
                    )}
                >
                    {cards.map(({ title, body, picture, labelBelow }, index) => (
                        <li key={title}>
                            <FadeIn
                                delay={index * 110}
                                className={cn(
                                    "flex h-full flex-col gap-2.5 lg:gap-8",
                                    !labelBelow && "lg:flex-col-reverse",
                                )}
                            >
                                <div
                                    className={cn(
                                        "group relative aspect-square w-full overflow-hidden lg:aspect-3/4",
                                        "rounded-xl lg:rounded-[2.5rem]",
                                        cornerClasses(index, cards.length, !!labelBelow),
                                        "shadow-[0_8px_20px_-8px_rgb(0_0_0/0.18)]",
                                        "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                                    )}
                                >
                                    <FillImage
                                        src={picture.src}
                                        alt={picture.alt}
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        wrapperClassName="absolute inset-0 h-full w-full"
                                        className={cn(
                                            "h-full w-full object-cover object-center",
                                            "transition-[scale,filter]! duration-700! motion-reduce:transition-none!",
                                            HOVER_EASE,
                                            "group-hover:scale-105 group-hover:blur-[3px]",
                                        )}
                                    />

                                    <div
                                        className={cn(
                                            "absolute inset-x-0 bottom-0 px-3 pt-10 pb-3 text-center",
                                            "bg-linear-to-t from-(--color-primary)/70 to-transparent",
                                            "lg:inset-0 lg:flex lg:items-center lg:justify-center lg:px-6 lg:pt-0 lg:pb-0",
                                            "lg:bg-none lg:bg-(--color-primary)/45 lg:backdrop-blur-[2px]",
                                            "lg:opacity-0 lg:group-hover:opacity-100",
                                            "transition-opacity! duration-500! motion-reduce:transition-none!",
                                            HOVER_EASE,
                                        )}
                                    >
                                        <p
                                            className={cn(
                                                "text-(--text-invert)",
                                                "text-[0.625rem] leading-relaxed sm:text-xs lg:text-sm lg:leading-loose",
                                                "lg:translate-y-2 lg:opacity-0",
                                                "transition-[opacity,translate]! duration-500! lg:group-hover:delay-150",
                                                HOVER_EASE,
                                                "lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                                                "motion-reduce:translate-y-0 motion-reduce:transition-none!",
                                            )}
                                        >
                                            {body}
                                        </p>
                                    </div>
                                </div>

                                <h3
                                    className={cn(
                                        "text-center font-medium text-(--text-primary)",
                                        "text-xs sm:text-sm md:text-base",
                                    )}
                                >
                                    {title}
                                </h3>
                            </FadeIn>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default OurValue;
