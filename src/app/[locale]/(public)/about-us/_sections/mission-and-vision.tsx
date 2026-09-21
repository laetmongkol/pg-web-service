import { Star } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

type ContentSections = Record<string, Record<string, TranslateContentResponseDto>>;

interface MissionAndVisionProps {
    data?: ContentSections;
}

const COVER_SECTION = "7";
const PEOPLE_SECTION = "9";

interface Picture {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

const toPicture = (dto: TranslateContentResponseDto | undefined, fallbackAlt: string): Picture => {
    const attributes = extractAttributes<PictureAttributes>(dto);

    return {
        src: attributes?.mediaStorageKey ?? "",
        alt: attributes?.mediaAltText || fallbackAlt,
        width: attributes?.width,
        height: attributes?.height,
    };
};

const EYEBROW = "Mission & Vision";

const TITLE_PARTS = [
    { text: "เปลี่ยนวิสัยทัศน์", highlight: false },
    { text: "ให้กลายเป็นความจริง", highlight: true },
];

const SUB_TITLE =
    "จากแนวคิดสู่ผลลัพธ์เราทำให้วิสัยทัศน์ของคุณเป็นจริงด้วยโซลูชันที่เป็นนวัตกรรมซึ่งทั้งทรงพลังและมีประสิทธิภาพ";

const COVER_ALT = "บรรยากาศการทำงานของทีม";

const PILLARS = [
    {
        title: "Our mission",
        body: "ยกระดับศักยภาพของธุรกิจผ่านกลยุทธ์ที่เฉียบคมและการวิเคราะห์ข้อมูลเชิงลึก เรามุ่งมั่นที่จะเป็นหุ้นส่วนเชิงกลยุทธ์ที่น่าเชื่อถือที่สุด สร้างความได้เปรียบทางการแข่งขันที่ยั่งยืนในทุกอุตสาหกรรม",
    },
    {
        title: "Our vision",
        body: "เป็นผู้นำด้านที่ปรึกษาธุรกิจระดับภูมิภาคที่กำหนดนิยามใหม่ของความสำเร็จด้วยนวัตกรรมทางความคิดและการปฏิบัติที่ส่งมอบผลลัพธ์ที่จับต้องได้ในระดับสากล",
    },
];

const MEDIA_CARDS = [
    { key: "image1", label: "บรรยากาศการทำงาน", progress: 45 },
    { key: "image2", label: "ความเชี่ยวชาญ", progress: 75 },
];

const REVIEW_AVATAR_KEYS = ["person1", "person2", "person3"];

const REVIEW_STARS = 5;

interface StatCard {
    title: string;
    value: string;
    lines: string[];
    review?: boolean;
}

const STATS: StatCard[] = [
    {
        title: "ทีมงานผู้เชี่ยวชาญ",
        value: "20+",
        lines: ["เรามีทีมงาน", "ผู้เชี่ยวชาญด้านต่างๆ", "พร้อมช่วยเหลือคุณ"],
    },
    {
        title: "ลูกค้าพึงพอใจทั่วโลก",
        value: "99%",
        lines: ["ลูกค้ายังคงใช้บริการ", "ของเราเพราะคุณภาพและ", "ผลลัพธ์ที่ได้"],
        review: true,
    },
    {
        title: "โปรเจกต์ที่ส่งมอบแล้ว",
        value: "10+",
        lines: ["ส่งมอบประสบการณ์", "ที่ดีให้แก่ทุกคน"],
    },
    {
        title: "รางวัล",
        value: "3",
        lines: ["ความเชี่ยวชาญที่", "นำไปสู่ผลลัพธ์ที่", "มีความหมาย"],
    },
];

const REVEAL_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!";

const PILLAR_DELAY = ["lg:group-hover:delay-200", "lg:group-hover:delay-300"];

const CARD_CLASSNAME = "flex min-h-45 flex-col rounded-2xl border border-(--border-default) p-5 sm:p-6";

const MissionAndVision = ({ data }: MissionAndVisionProps) => {
    const coverSection = data?.[COVER_SECTION];
    const peopleSection = data?.[PEOPLE_SECTION];

    const cover = toPicture(coverSection?.image1, COVER_ALT);
    const mediaCards = MEDIA_CARDS.map((card) => ({
        ...card,
        picture: toPicture(coverSection?.[card.key], card.label),
    }));
    const avatars = REVIEW_AVATAR_KEYS.map((key, index) =>
        toPicture(peopleSection?.[key], `ลูกค้า ${index + 1}`),
    );

    return (
        <section
            id="mission-and-vision"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-24")}
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

                        <p className={cn("mt-8 max-w-4xl text-(--text-secondary)", "text-xs md:text-sm")}>
                            {SUB_TITLE}
                        </p>
                    </div>

                    <hr className="mt-10 border-t border-(--border-default)" />

                    <div className="group relative mt-10 w-full">
                        <div
                            className={cn(
                                "relative w-full",
                                "aspect-4/3 sm:aspect-16/10 lg:aspect-21/9",
                            )}
                        >
                            <div
                                className={cn(
                                    "absolute inset-y-0 right-0 left-0 overflow-hidden rounded-3xl",
                                    "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                                    "transition-[left]! duration-700! motion-reduce:transition-none!",
                                    REVEAL_EASE,
                                    "lg:group-hover:left-1/2",
                                )}
                            >
                                <FillImage
                                    src={cover.src}
                                    alt={cover.alt}
                                    sizes="(max-width: 1280px) 100vw, 1280px"
                                    wrapperClassName="absolute inset-0 h-full w-full"
                                    className={cn(
                                        "h-full w-full object-cover object-center",
                                        "transition-[object-position]! duration-700!",
                                        REVEAL_EASE,
                                        "lg:group-hover:object-right",
                                    )}
                                />
                            </div>

                            <div className="absolute inset-x-3 bottom-3 flex gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6">
                                {mediaCards.map(({ label, progress }) => (
                                    <div
                                        key={label}
                                        className={cn(
                                            "min-w-0 flex-1 rounded-xl p-3 sm:w-44 sm:flex-none",
                                            "bg-(--color-primary)/85 text-(--text-invert) backdrop-blur-sm",
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-xs">{label}</span>
                                        </div>

                                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-(--text-invert)/25">
                                            <div
                                                className="h-full rounded-full bg-(--text-invert)"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className={cn(
                                "mt-8 w-full",
                                "lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-1/2 lg:items-center lg:px-16",
                                "lg:pointer-events-none lg:group-hover:pointer-events-auto",
                            )}
                        >
                            <dl className="grid w-full grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:gap-6 lg:text-left">
                                {PILLARS.map(({ title, body }, index) => (
                                    <div
                                        key={title}
                                        className={cn(
                                            "lg:translate-y-4 lg:opacity-0",
                                            "transition-[opacity,translate]! duration-500!",
                                            REVEAL_EASE,
                                            PILLAR_DELAY[index],
                                            "lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                                            "motion-reduce:translate-y-0 motion-reduce:transition-none!",
                                        )}
                                    >
                                        <dt className="font-bold text-(--text-primary) text-base sm:text-lg">
                                            {title}
                                        </dt>
                                        <dd
                                            className={cn(
                                                "mt-3 text-xs leading-relaxed sm:mt-4 sm:text-sm",
                                                "text-(--text-secondary)",
                                            )}
                                        >
                                            {body}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
                        {STATS.map(({ title, value, lines, review }) => (
                            <li
                                key={title}
                                className={cn(
                                    CARD_CLASSNAME,
                                    "group transition-colors duration-300",
                                    "bg-(--surface-default) text-(--text-primary)",
                                    "hover:border-transparent hover:bg-(--color-primary) hover:text-(--text-invert)",
                                )}
                            >
                                {review ? (
                                    <>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center -space-x-2">
                                                {avatars.map(({ src, alt }) => (
                                                    <span
                                                        key={alt}
                                                        className={cn(
                                                            "relative size-8 overflow-hidden rounded-full",
                                                            "border border-(--border-default) bg-(--surface-muted)",
                                                            "transition-colors duration-300",
                                                            "group-hover:border-(--text-invert)/40 group-hover:bg-(--text-invert)/20",
                                                        )}
                                                    >
                                                        <FillImage
                                                            src={src}
                                                            alt={alt}
                                                            sizes="32px"
                                                            wrapperClassName="absolute inset-0 h-full w-full"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex shrink-0 items-center gap-0.5">
                                                {Array.from({ length: REVIEW_STARS }).map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className="size-3.5 fill-(--color-amber-500) text-(--color-amber-500)"
                                                        strokeWidth={1}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p
                                            className={cn(
                                                "mt-3 text-[0.625rem] sm:text-xs",
                                                "text-(--text-secondary) transition-colors duration-300",
                                                "group-hover:text-(--text-invert)/75",
                                            )}
                                        >
                                            {title}
                                        </p>
                                    </>
                                ) : (
                                    <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
                                )}

                                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                                    <CountUpNumber
                                        value={value}
                                        className="text-3xl font-bold sm:text-4xl"
                                    />
                                    <p
                                        className={cn(
                                            "max-w-40 text-right whitespace-pre-line",
                                            "text-[0.625rem] leading-relaxed sm:text-xs",
                                            "transition-colors duration-300",
                                            "text-(--text-secondary) group-hover:text-(--text-invert)/75",
                                        )}
                                    >
                                        {lines.join("\n")}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </FadeIn>
        </section>
    );
};

export default MissionAndVision;
