"use client";

import { useState } from "react";

import { ArrowRight } from "lucide-react";

import {
    convertObjectToArrayByPrefix,
    convertObjectToValuesByPrefix,
    PictureAttributes,
} from "@/lib/cms/content-attributes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface OurServicesProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `service*` — the card title is the row value, the picture rides along. */
interface ServiceAttributes extends PictureAttributes {
    lines?: string[];
}

interface ServiceCard {
    title: string;
    lines: string[];
    picture: PictureAttributes;
}

const REVEAL_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!";

const OurServices = ({ data, language }: OurServicesProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const EYEBROW = data?.eyebrow?.value;
    const TITLE = data?.title?.value;
    const SUB_TITLE_PARTS = convertObjectToValuesByPrefix(data, "subTitle").map((line) => line.value);
    const CTA_LABEL = data?.ctaButton?.value ?? "";
    const CTA_PATH = data?.ctaButton?.linkUrl ?? "";
    const SERVICES: ServiceCard[] = convertObjectToArrayByPrefix<ServiceAttributes>(data, "service").map(
        (service) => ({
            title: service.value ?? "",
            lines: service.attributes?.lines ?? [],
            picture: service.attributes ?? {},
        }),
    );

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
                                "text-xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
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
                            {SUB_TITLE_PARTS.map((part) => (
                                <span key={part} className="block lg:inline">
                                    {part}
                                </span>
                            ))}
                        </p>
                    </FadeIn>
                </div>

                <ul
                    className={cn(
                        // phones get plain stacked cards; only from lg does the row share its
                        // width by flex-grow and turn into the accordion from the design
                        "mt-10 flex flex-col gap-5",
                        "lg:mt-14 lg:h-120 lg:flex-row lg:gap-4",
                    )}
                >
                    {SERVICES.map(({ title, lines, picture }, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <li
                                key={title}
                                className={cn(
                                    "relative min-w-0 overflow-hidden rounded-2xl",
                                    "border border-(--border-default) bg-(--surface-default) p-6",
                                    "lg:min-h-0 lg:border-0 lg:bg-transparent lg:p-0",
                                    "transition-[flex-grow]! duration-500! motion-reduce:transition-none!",
                                    REVEAL_EASE,
                                    isActive ? "lg:grow-[4]" : "lg:grow-[1]",
                                )}
                            >
                                {/* nothing to expand on phones — every card is already open */}
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    aria-expanded={isActive}
                                    className="absolute inset-0 hidden cursor-pointer lg:block"
                                >
                                    <span className="sr-only">{title}</span>
                                </button>

                                <FillImage
                                    src={picture.mediaStorageKey ?? ""}
                                    alt={picture.mediaAltText || title}
                                    width={picture.width}
                                    height={picture.height}
                                    wrapperClassName={cn(
                                        "pointer-events-none overflow-hidden",
                                        "relative aspect-video w-full rounded-xl",
                                        "bg-linear-to-br from-(--color-primary-25) via-(--surface-muted) to-(--color-primary-50)",
                                        "lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:rounded-none",
                                    )}
                                    className={cn(
                                        "h-full w-full object-cover",
                                        // the stand-in photo keeps its subject at ~72% of the
                                        // frame, so a centred crop lands on empty background
                                        // once the card narrows. Re-tune when real art lands.
                                        "object-[76%_center]",
                                    )}
                                />

                                {/* the tints only exist to carry the overlaid copy at lg */}
                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-0 hidden lg:block",
                                        "bg-linear-to-t from-(--color-primary)/85 to-transparent",
                                        "transition-opacity! duration-500! motion-reduce:transition-none!",
                                        REVEAL_EASE,
                                        isActive ? "opacity-100" : "opacity-0",
                                    )}
                                />
                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-0 hidden bg-(--color-primary)/55 lg:block",
                                        "transition-opacity! duration-500! motion-reduce:transition-none!",
                                        REVEAL_EASE,
                                        isActive ? "opacity-0" : "opacity-100",
                                    )}
                                />

                                <div
                                    className={cn(
                                        "relative mt-5 flex flex-col",
                                        "lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0",
                                        "transition-[padding]! duration-500! motion-reduce:transition-none!",
                                        REVEAL_EASE,
                                        isActive ? "lg:p-8" : "lg:p-6",
                                    )}
                                >
                                    <h3
                                        className={cn(
                                            "font-semibold text-(--text-primary) lg:text-(--text-invert)",
                                            "text-base lg:truncate lg:text-sm xl:text-base",
                                        )}
                                    >
                                        {title}
                                    </h3>

                                    {/* open on phones; at lg it collapses along with the card */}
                                    <div
                                        className={cn(
                                            "grid grid-rows-[1fr] opacity-100",
                                            "lg:transition-[grid-template-rows,opacity,translate]!",
                                            "motion-reduce:transition-none!",
                                            REVEAL_EASE,
                                            isActive
                                                ? "lg:grid-rows-[1fr] lg:translate-y-0 lg:opacity-100 lg:duration-500! lg:delay-200"
                                                : "lg:grid-rows-[0fr] lg:translate-y-2 lg:opacity-0 lg:duration-200!",
                                        )}
                                    >
                                      <div className="overflow-hidden">
                                        <div className="mt-3 flex items-end justify-between gap-6">
                                            <p
                                                className={cn(
                                                    "text-(--text-secondary) lg:whitespace-nowrap lg:text-(--text-invert)/85",
                                                    "text-xs leading-loose lg:text-[0.625rem] xl:text-xs",
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
                                                    "group hidden shrink-0 items-center gap-3 lg:flex",
                                                    "text-xs text-(--text-invert) md:text-sm",
                                                    isActive && "lg:pointer-events-auto",
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
