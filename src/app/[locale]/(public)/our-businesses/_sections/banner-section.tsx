import { Building2, ChartNoAxesCombined, Handshake, Lightbulb, Mouse, Users, type LucideIcon } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FillImage from "@/components/fill-image.component";
import FadeIn from "@/app/component/fade-in.components";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

type ArcPosition = "apex" | "middle" | "end";

const ARC_RATIOS: Record<ArcPosition, { above: string; stem: string; below: string }> = {
    apex: { above: "flex-[0]", stem: "flex-[5]", below: "flex-[11]" },
    middle: { above: "flex-[2]", stem: "flex-[4]", below: "flex-[9]" },
    end: { above: "flex-[3]", stem: "flex-[2]", below: "flex-[4]" },
};

type FloatingIcon = {
    key: string;
    Icon: LucideIcon;
    position: ArcPosition;
};

const FLOATING_ICONS: FloatingIcon[] = [
    { key: "people", Icon: Users, position: "end" },
    { key: "partnership", Icon: Handshake, position: "middle" },
    { key: "growth", Icon: ChartNoAxesCombined, position: "apex" },
    { key: "innovation", Icon: Lightbulb, position: "middle" },
    { key: "holding", Icon: Building2, position: "end" },
];

const BannerSection = () => {
    return (
        <FadeIn>
                <section
                    className={cn(
                        "relative mt-(--navbar-height) lg:mt-0 flex h-fit w-full flex-col",
                        "overflow-hidden bg-(--color-primary)",
                    )}
                    id="banner"
                >

                    <div className="hidden w-full lg:block">
                        <FillImage
                            src={mockUpImage}
                            alt="Our Businesses banner"
                            width={2560}
                            height={1440}
                            sizes="100vw"
                            className={cn(
                                "w-full object-cover object-right aspect-[5/2]",
                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                            )}
                        />
                    </div>
                    <div className="block w-full lg:hidden">
                        <FillImage
                            src={mockUpImage}
                            alt="Our Businesses banner"
                            width={2560}
                            height={1440}
                            sizes="100vw"
                            className={cn(
                                "w-full object-cover object-center aspect-square",
                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                            )}
                        />
                    </div>

                    <div
                        aria-hidden
                        className={cn(
                            "absolute inset-0",
                            "bg-linear-to-r from-(--color-primary) from-0% via-(--color-primary)/80 via-40% to-transparent",
                        )}
                    />
                    <div className={cn(
                        "flex flex-row gap-4",
                    )}>
                        <div
                            className={cn(
                                "absolute inset-0 z-10 mx-auto grid h-full w-full max-w-6xl",
                                "px-4 sm:px-12 md:px-16",
                            )}
                        >
                            <div
                                className={cn(
                                    "col-start-1 row-start-1 flex flex-col justify-center gap-4 sm:gap-8",
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
                                    {"กลุ่มธุรกิจในเครือ PIP Group Holding"}
                                </span>
                                <h1
                                    className={cn(
                                        "font-bold leading-snug",
                                        "text-xl sm:text-5xl sm:leading-tight xl:text-6xl",
                                    )}
                                >
                                    <span className="block text-(--color-secondary)">
                                        {"กลุ่มธุรกิจที่เชื่อมโยงกัน"}
                                    </span>
                                    <span className="block text-(--text-invert)">
                                        {"เพื่อการเติบโตอย่างยั่งยืน"}
                                    </span>
                                </h1>
                            </div>
                            <a
                                href="#our-businesses-content"
                                className={cn(
                                    "col-start-1 row-start-1 self-end",
                                    "justify-self-center sm:justify-self-start",
                                    "flex w-fit flex-col items-center gap-2 pb-6 lg:pb-12",
                                    "hidden sm:flex",
                                    "text-(--text-invert)/75",
                                    "text-xs tracking-wide hover:text-(--text-invert) transition-colors",
                                )}
                            >
                                <Mouse className="size-6 animate-bounce" strokeWidth={1.4} />
                                {"Scroll down"}
                            </a>
                        </div>
                        <div
                            aria-hidden
                            className={cn(
                                "pointer-events-none absolute inset-y-0 z-10 hidden",
                                "left-[57%] right-4 sm:right-12 md:right-16",
                                "lg:grid lg:grid-rows-[1fr_3fr_2fr]",
                            )}
                        >
                            <div className="row-start-2 flex justify-evenly">
                                {FLOATING_ICONS.map(({ key, Icon, position }) => (
                                    <span key={key} className="flex flex-col items-center">
                                        <span className={ARC_RATIOS[position].above} />
                                        <span
                                            className={cn(
                                                "flex shrink-0 items-center justify-center rounded-full",
                                                "size-14 xl:size-16 2xl:size-18",
                                                "bg-(--surface-default)/12 border border-(--surface-default)/20 text-(--text-invert)",
                                                "shadow-[0_0_28px_rgba(255,255,255,0.12)] backdrop-blur-md",
                                            )}
                                        >
                                            <Icon className="size-1/2" strokeWidth={1.6} />
                                        </span>
                                        <span
                                            className={cn(
                                                "w-px bg-linear-to-b from-(--text-invert)/10 to-(--text-invert)/45",
                                                ARC_RATIOS[position].stem,
                                            )}
                                        />
                                        <span className="size-1.5 shrink-0 rounded-full bg-(--text-invert) shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                        <span className={ARC_RATIOS[position].below} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
        </FadeIn>
    );
};

export default BannerSection;
