import { ArrowUpRight } from "lucide-react";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

interface CtaSectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const CtaSection = ({ data, language }: CtaSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16",
        )}>
            <div className="relative overflow-hidden rounded-3xl">
                <FillImage
                    src={mockUpImage}
                    alt=""
                    width={2000}
                    height={1000}
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    draggable={false}
                    wrapperClassName="aspect-4/3 sm:aspect-16/9 lg:aspect-[21/9] w-full"
                    className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                />
                {/* the art is light on the left, so the copy side needs its own scrim */}
                <div className="absolute inset-0" />

                <div className={cn(
                    "absolute inset-0 grid grid-cols-1 lg:grid-cols-2",
                )}>
                    <span aria-hidden className="hidden lg:block" />

                    <FadeIn delay={100} className={cn(
                        "flex flex-col justify-center gap-5",
                        "items-center text-center p-5",
                    )}>
                        <h2 className={cn(
                            "font-bold text-(--text-invert)",
                            "text-2xl sm:text-3xl lg:text-4xl leading-tight",
                        )}>
                            {"ก้าวไปข้างหน้า อย่างมั่นคงด้วยกัน"}
                        </h2>

                        <FadeIn delay={200} className="text-sm text-(--text-invert) sm:text-base">
                            {"มุ่งมั่นสร้างการเติบโตที่ยั่งยืน ด้วยวิสัยทัศน์และความร่วมมือที่แข็งแกร่ง"}
                        </FadeIn>

                        <LinkCustom href={`/${language}/contact-us`} className="w-fit">
                            <FadeIn delay={300} className={cn(
                                "font-medium text-(--text-invert) flex items-center gap-2",
                                "bg-(--surface-default)/15 border border-(--surface-default)/30 rounded-full backdrop-blur-xs",
                                "hover:bg-(--surface-default)/30 hover:scale-105 transition-all duration-300",
                                "text-base px-8 py-3",
                            )}>
                                {"ติดต่อเรา"}
                                <ArrowUpRight className="size-5 inline-block" />
                            </FadeIn>
                        </LinkCustom>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
