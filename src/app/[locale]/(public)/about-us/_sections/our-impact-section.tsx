import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

import OurImpactMosaic from "./components/our-impact-mosaic";

interface OurImpactSectionProps {
    data: any;
    language: string;
}

const OurImpactSection = ({ data, language }: OurImpactSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16 gap-10",
        )}>
            <FadeIn className="flex flex-col gap-4 items-center">
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {"OUR IMPACT"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {"ทำงานร่วมกัน"}
                    <span className="text-(--color-secondary)">{"สร้างสรรค์สิ่งที่ยิ่งใหญ่"}</span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {"วัฒนธรรมของเราส่งเสริมความคิดสร้างสรรค์ การทำงานเป็นทีม และการพัฒนาตนเองอย่างต่อเนื่อง เพื่อสร้างผลงานที่ยั่งยืนและเติบโตไปด้วยกัน"}
                </FadeIn>
            </FadeIn>

            <FadeIn delay={300}>
                <OurImpactMosaic />
            </FadeIn>
        </section>
    );
};

export default OurImpactSection;
