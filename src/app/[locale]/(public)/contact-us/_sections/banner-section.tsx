import { Fragment, type ReactNode } from "react";

import { Mouse } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FillImage from "@/components/fill-image.component";
import FadeIn from "@/app/component/fade-in.components";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const WORD_BREAK = "​";

const BANNER_BODY_CLAUSES = [
    ["ติดต่อ PIP Group Holding"],
    ["เรายินดี", "รับ", "ข้อสอบถาม", "เกี่ยวกับ", "โอกาส", "การลงทุน"],
    ["การประชาสัมพันธ์"],
    ["และ", "การกำกับดูแล", "กิจการ"],
];

const renderClause = (clause: string[], clauseIndex: number): ReactNode[] =>
    clause.flatMap((word, wordIndex) => {
        const held = (
            <span key={`${clauseIndex}-${wordIndex}`} className="whitespace-nowrap">
                {word}
            </span>
        );
        return wordIndex === 0 ? [held] : [WORD_BREAK, held];
    });

const BannerSection = () => {
    return (
        <section
            className={cn(
                "relative mt-(--navbar-height) lg:mt-0 flex h-[1080px] w-full flex-col",
                "overflow-hidden bg-(--color-primary)",
            )}
            id="banner"
        >
            <div className="absolute inset-0 hidden w-full lg:block">
                <FillImage
                    src={mockUpImage}
                    alt="Contact Us banner"
                    width={2560}
                    height={1440}
                    sizes="100vw"
                    wrapperClassName="h-full w-full"
                    className={cn(
                        "h-full w-full object-cover object-right",
                        BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                    )}
                />
            </div>
            <div className="absolute inset-0 block w-full lg:hidden">
                <FillImage
                    src={mockUpImage}
                    alt="Contact Us banner"
                    width={2560}
                    height={1440}
                    sizes="100vw"
                    wrapperClassName="h-full w-full"
                    priority
                    className={cn(
                        "h-full w-full object-cover object-center",
                        BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                    )}
                />
            </div>

            <FadeIn className="absolute inset-0 z-10">
                <div
                    className={cn(
                        "mx-auto grid h-full w-full max-w-6xl",
                        "px-4 sm:px-12 md:px-16",
                    )}
                >
                    <div
                        className={cn(
                            "col-start-1 row-start-1 -mt-16 flex flex-col justify-center gap-4 sm:-mt-24 sm:gap-8",
                            "text-center items-center",
                            "sm:text-start sm:items-start",
                        )}
                    >
                        <span
                            className={cn(
                                "font-light text-(--text-invert) flex flex-wrap items-center justify-center gap-2",
                                "text-xs md:text-sm lg:text-base",
                                "sm:justify-start",
                            )}
                        >
                            <span className="bg-(--color-secondary) size-2 shrink-0 inline-block" />
                            {"ติดต่อ PIP Group Holding"}
                        </span>
                        <h1
                            className={cn(
                                "font-bold leading-snug",
                                "text-xl sm:text-5xl sm:leading-tight xl:text-6xl",
                            )}
                        >
                            <span className="text-(--color-secondary)">{"ติดต่อ"}</span>
                            <span className="text-(--text-invert)">{"พูดคุยกับเรา"}</span>
                        </h1>
                        <p
                            className={cn(
                                "text-(--text-invert)/80",
                                "text-xs sm:text-sm lg:text-base",
                                "max-w-sm",
                            )}
                        >
                            {BANNER_BODY_CLAUSES.map((clause, clauseIndex) => (
                                <Fragment key={clauseIndex}>
                                    {clauseIndex > 0 ? " " : null}
                                    {renderClause(clause, clauseIndex)}
                                </Fragment>
                            ))}
                        </p>
                    </div>
                    <a
                        href="#contact-us-content"
                        className={cn(
                            "col-start-1 row-start-1 self-end",
                            "justify-self-center sm:justify-self-start",
                            "mb-16 flex w-fit flex-col items-center gap-2 sm:mb-24 pb-6 lg:pb-32",
                            "hidden sm:flex",
                            "text-(--text-invert)/75",
                            "text-xs tracking-wide hover:text-(--text-invert) transition-colors",
                        )}
                    >
                        <Mouse className="size-6 animate-bounce" strokeWidth={1.4} />
                        {"Scroll down"}
                    </a>
                </div>
            </FadeIn>
        </section>
    );
};

export default BannerSection;
