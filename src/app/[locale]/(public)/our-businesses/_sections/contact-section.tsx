import { ArrowUpRight } from "lucide-react";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

interface ContactSectionProps {
    language: string;
}

const ContactSection = ({ language }: ContactSectionProps) => {
    return (
        <section className="w-full bg-(--surface-page)">
            <FadeIn
                className={cn(
                    "max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
                    "pb-20 lg:pb-28",
                )}
            >
                <div
                    className={cn(
                        "relative overflow-hidden rounded-3xl",
                        "lg:aspect-[5/2]",
                    )}
                >
                    <FillImage
                        src={mockUpImage}
                        alt=""
                        sizes="(max-width: 1024px) 100vw, 1152px"
                        wrapperClassName="absolute inset-0"
                        className={cn(
                            "object-cover object-right",
                            BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                        )}
                    />
                    <div
                        aria-hidden
                        className={cn(
                            "absolute inset-0",
                            "bg-(--surface-default)/88",
                            "lg:bg-transparent",
                            "lg:bg-linear-to-r lg:from-(--surface-default) lg:from-20%",
                            "lg:via-(--surface-default)/85 lg:via-55% lg:to-(--surface-default)/20",
                        )}
                    />

                    <div
                        className={cn(
                            "relative flex flex-col items-center justify-center gap-5 text-center",
                            "px-6 py-14 sm:px-10 lg:px-6",
                            "lg:h-full lg:w-1/2 lg:py-0",
                        )}
                    >
                        <h2
                            className={cn(
                                "font-bold text-(--text-primary) leading-tight",
                                "text-xl sm:text-3xl",
                            )}
                        >
                            {"ร่วมสร้างอนาคตไปด้วยกัน"}
                        </h2>
                        <p
                            className={cn(
                                "text-(--text-secondary)",
                                "text-xs sm:text-base",
                                "max-w-md",
                                "whitespace-normal lg:whitespace-pre-line",
                            )}
                        >
                            {"เชื่อมต่อกับ PIP Group Holding เพื่อสำรวจโอกาสใหม่ "}
                            <span className="whitespace-nowrap">{"ความร่วมมือ"}</span>
                            {"\nและการเติบโตที่ยั่งยืน"}
                        </p>
                        <LinkCustom href={`/${language}/contact-us`} className="w-fit">
                            <span
                                className={cn(
                                    "flex items-center gap-2 rounded-full",
                                    "bg-(--color-primary) text-(--text-invert)",
                                    "px-6 py-3 text-xs font-medium sm:text-base",
                                    "hover:opacity-90 transition-opacity",
                                )}
                            >
                                {"ติดต่อเรา"}
                                <ArrowUpRight className="size-4 sm:size-5" strokeWidth={2} />
                            </span>
                        </LinkCustom>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
};

export default ContactSection;
