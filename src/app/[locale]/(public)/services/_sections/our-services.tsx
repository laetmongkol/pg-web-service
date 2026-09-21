"use client";

import { useState } from "react";

import { ArrowRight } from "lucide-react";

import { BACKEND_IMAGE_PREFIX } from "@/lib/media/image-loader";
import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface OurServicesProps {
    language: string;
}

const PLACEHOLDER_IMAGE = `${BACKEND_IMAGE_PREFIX}gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp`;

const EYEBROW = "Our Service";

const TITLE = "บริการด้านการตลาดดิจิทัลที่ครบวงจร";

const SUB_TITLE =
    "เราออกแบบโซลูชันการตลาดดิจิทัลที่เหมาะสมกับขนาดและเป้าหมายของธุรกิจคุณโดยเฉพาะ";

const CTA_LABEL = "ติดต่อเรา";
const CTA_PATH = "contact-us";

interface ServiceCard {
    title: string;
    lines: string[];
}

const SERVICES: ServiceCard[] = [
    {
        title: "กลยุทธ์การตลาด",
        lines: [
            "วิเคราะห์โครงสร้างตลาด พฤติกรรมผู้บริโภค",
            "และค้นหาโอกาสใหม่ทางธุรกิจเพื่อสร้างความได้เปรียบในการแข่งขันอย่างยั่งยืน",
        ],
    },
    {
        title: "คอนเทนต์มาร์เก็ตติ้ง",
        lines: [
            "วางแผนและผลิตคอนเทนต์ที่ตรงกับกลุ่มเป้าหมาย",
            "เพื่อสร้างการจดจำและความเชื่อมั่นในแบรนด์อย่างต่อเนื่อง",
        ],
    },
    {
        title: "โฆษณาดิจิทัล",
        lines: [
            "บริหารงบโฆษณาบนทุกแพลตฟอร์มอย่างแม่นยำ",
            "วัดผลได้จริงและปรับปรุงประสิทธิภาพอย่างสม่ำเสมอ",
        ],
    },
    {
        title: "โซเชียลมีเดีย",
        lines: [
            "ดูแลช่องทางโซเชียลมีเดียของแบรนด์แบบครบวงจร",
            "ตั้งแต่การวางคอนเซปต์ไปจนถึงการสื่อสารกับผู้ติดตาม",
        ],
    },
    {
        title: "วิเคราะห์ข้อมูล",
        lines: [
            "เปลี่ยนข้อมูลจากทุกช่องทางให้เป็นข้อมูลเชิงลึก",
            "ที่ใช้ตัดสินใจทางธุรกิจได้จริงและต่อยอดการเติบโต",
        ],
    },
];

const REVEAL_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!";

const OurServices = ({ language }: OurServicesProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section
            id="our-services"
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

                <ul
                    className={cn(
                        "mt-10 flex h-128 flex-col gap-4 lg:mt-14 lg:h-120 lg:flex-row",
                    )}
                >
                    {SERVICES.map(({ title, lines }, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <li
                                key={title}
                                className={cn(
                                    "relative min-h-0 min-w-0 overflow-hidden rounded-2xl",
                                    "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                                    "transition-[flex-grow]! duration-500! motion-reduce:transition-none!",
                                    REVEAL_EASE,
                                    isActive ? "grow-[4]" : "grow-[1]",
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    aria-expanded={isActive}
                                    className="absolute inset-0 cursor-pointer"
                                >
                                    <span className="sr-only">{title}</span>
                                </button>

                                <FillImage
                                    src={PLACEHOLDER_IMAGE}
                                    alt={title}
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                    wrapperClassName="pointer-events-none absolute inset-0 h-full w-full"
                                    className={cn(
                                        "h-full w-full object-cover",
                                        // the stand-in photo keeps its subject at ~72% of the
                                        // frame, so a centred crop lands on empty background
                                        // once the card narrows. Re-tune when real art lands.
                                        "object-[76%_center]",
                                    )}
                                />

                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-0",
                                        "bg-linear-to-t from-(--color-primary)/85 to-transparent",
                                        "transition-opacity! duration-500! motion-reduce:transition-none!",
                                        REVEAL_EASE,
                                        isActive ? "opacity-100" : "opacity-0",
                                    )}
                                />
                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-0 bg-(--color-primary)/55",
                                        "transition-opacity! duration-500! motion-reduce:transition-none!",
                                        REVEAL_EASE,
                                        isActive ? "opacity-0" : "opacity-100",
                                    )}
                                />

                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col",
                                        "transition-[padding]! duration-500! motion-reduce:transition-none!",
                                        REVEAL_EASE,
                                        isActive ? "p-6 lg:p-8" : "p-5 lg:p-6",
                                    )}
                                >
                                    <h3
                                        className={cn(
                                            "font-semibold text-(--text-invert)",
                                            "text-sm md:text-base",
                                            // one line at every card width: the ellipsis slides
                                            // as the card resizes, so nothing ever re-wraps
                                            "lg:truncate",
                                        )}
                                    >
                                        {title}
                                    </h3>

                                    <div
                                        className={cn(
                                            "grid",
                                            "transition-[grid-template-rows,opacity,translate]!",
                                            "motion-reduce:transition-none!",
                                            REVEAL_EASE,
                                            isActive
                                                ? "grid-rows-[1fr] translate-y-0 opacity-100 duration-500! delay-200"
                                                : "grid-rows-[0fr] translate-y-2 opacity-0 duration-200!",
                                        )}
                                    >
                                      <div className="overflow-hidden">
                                        <div className="mt-3 flex items-end justify-between gap-6">
                                            <p
                                                className={cn(
                                                    "text-(--text-invert)/85 lg:whitespace-nowrap",
                                                    "text-[0.625rem] leading-loose sm:text-xs",
                                                )}
                                            >
                                                {lines.map((line) => (
                                                    <span key={line} className="block">
                                                        {line}
                                                    </span>
                                                ))}
                                            </p>

                                            <LinkCustom
                                                href={`/${language}/${CTA_PATH}`}
                                                className={cn(
                                                    "group flex shrink-0 items-center gap-3",
                                                    "text-xs text-(--text-invert) md:text-sm",
                                                    isActive && "pointer-events-auto",
                                                )}
                                            >
                                                <span className="underline underline-offset-4">
                                                    {CTA_LABEL}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "flex size-8 items-center justify-center rounded-full",
                                                        "border border-current",
                                                    )}
                                                >
                                                    <ArrowRight
                                                        className={cn(
                                                            "size-4",
                                                            "transition-[translate]! duration-300! motion-reduce:transition-none!",
                                                            REVEAL_EASE,
                                                            "group-hover:translate-x-0.5",
                                                        )}
                                                    />
                                                </span>
                                            </LinkCustom>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default OurServices;
