import Image from "next/image";
import cn from "@/lib/tw-merge";
import LinkCustom from "@/components/link-custom.component"
import { ArrowUpRight, Mouse } from "lucide-react";
import FillImage from "@/components/fill-image.component";
import FadeIn from "@/app/component/fade-in.components";

interface HeroSectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";


const HeroSection = ({ data, language }: HeroSectionProps) => {
    return (
        <FadeIn>
        <section className="relative mt-(--navbar-height) h-[1080px] lg:mt-0 h-fit flex flex-col items-center">
            <div className="hidden lg:block w-full">
                <FillImage
                    src={mockUpImage}
                    alt="Hero Section Desktop"
                    width={2560}
                    height={1440}
                    draggable={false}
                    className={cn("object-cover aspect-[16/8] w-full max-h-[1080px]",
                    )} />
            </div>
            <div className="block lg:hidden w-full">
                <FillImage
                    src={mockUpImage}
                    alt="Hero Section Mobile"
                    width={2560}
                    height={1440}
                    draggable={false}
                    className={cn("object-cover aspect-square object-left w-full max-h-[1080px]",
                    )} />
            </div>
            <div className={cn("absolute flex flex-col justify-center h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
                "items-center",
                "sm:items-start gap-14"
            )}>
                <FadeIn className={cn("flex flex-col",
                    "text-center items-center gap-8 lg:max-xl:pt-5 pt-0",
                    "sm:text-start sm:items-start",
                )}>
                    <span className={cn("font-medium text-(--text-invert) flex items-center gap-2",
                        "text-base sm:text-lg xl:text-xl",
                    )}>
                        <div className="bg-(--color-secondary) w-2 h-2 inline-block " />
                        {"เรียนรู้เกี่ยวกับ PIP Group Holding"}
                    </span>
                    <h1 className={cn("font-bold text-(--text-invert) ",
                        "text-3xl leading-snug",
                        "sm:text-5xl sm:leading-tight xl:text-6xl"
                    )}>
                        <p className={cn("text-(--color-secondary)",
                        )}>
                            {"ความเชี่ยวชาญระดับสากล"}
                        </p>
                        {"เพื่อรากฐานและอนาคตที่ยั่งยืน"}
                    </h1>
                    <p className={cn("text-(--text-invert) whitespace-pre-line",
                        "text-base sm:text-lg xl:text-xl",
                    )}>
                        {"เราคือกลุ่มบริษัทโฮลดิ้งชั้นนำที่ขับเคลื่อนการเติบโตเชิงกลยุทธ์ \nด้วยการบริหารสินทรัพย์และการดำเนินงานในธุรกิจที่มีศักยภาพสูงอย่างมืออาชีพ"}
                    </p>
                </FadeIn>
                {/* the overlay is absolute, so it is this element's containing block */}
                <div className="lg:hidden xl:block">
                    <div className={cn(
                        "absolute bottom-10 flex flex-col items-center gap-2 text-(--text-invert)",
                        "left-1/2 -translate-x-1/2",
                        "sm:left-12 sm:translate-x-0 md:left-16"
                    )}>
                        <Mouse
                            aria-hidden
                            strokeWidth={1.5}
                            className="size-8 animate-bounce motion-reduce:animate-none"
                        />
                        <span className="text-sm font-medium whitespace-nowrap">{"Scroll down"}</span>
                    </div>
                </div>
            </div>
        </section>
        </FadeIn>
    );
};

export default HeroSection;