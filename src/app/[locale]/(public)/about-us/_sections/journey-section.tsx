import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

import JourneyScroller, { type JourneyItem } from "./components/journey-scroller";
import { OurValueContent } from "./our-value-section";

interface JourneySectionProps {
    data: any;
    language: string;
}

const JOURNEY_ITEMS: JourneyItem[] = [
    {
        year: "2018",
        title: "ก่อตั้ง Pip Group",
        description: "เริ่มต้นจากทีมเล็ก ๆ ที่มีเป้าหมายสร้างซอฟต์แวร์ที่ดีกว่า เพื่อแก้ปัญหาการทำงานร่วมกันและประสิทธิภาพขององค์กร",
    },
    {
        year: "2020",
        title: "ขยายทีมและผลิตภัณฑ์",
        description: "เพิ่มทีมวิศวกรรมและออกแบบ ขยายฟีเจอร์หลักและปรับปรุงประสบการณ์ผู้ใช้ให้ดียิ่งขึ้น",
    },
    {
        year: "2022",
        title: "ขยายธุรกิจระดับโลก",
        description: "ขยายบริการไปยังลูกค้าหลายภูมิภาค พร้อมเสริมความสามารถด้านความปลอดภัยและความน่าเชื่อถือ",
    },
    {
        year: "2023",
        title: "ความสำเร็จระดับองค์กร",
        description: "ติดอันดับพันธมิตรที่เชื่อถือได้ ร่วมงานกับองค์กรขนาดใหญ่และขยายฐานลูกค้าอย่างต่อเนื่อง",
    },
    {
        year: "2024",
        title: "ขยายนวัตกรรม",
        description: "เพิ่มฟีเจอร์ใหม่ มาตรฐานความปลอดภัยระดับสูง เพื่อรองรับธุรกิจที่เติบโตอย่างรวดเร็ว",
    },
    {
        year: "2025",
        title: "ก้าวสู่อนาคต",
        description: "มุ่งสู่การเป็นแพลตฟอร์มชั้นนำด้านเทคโนโลยีที่ขับเคลื่อนนวัตกรรมสำหรับทุกองค์กร",
    },
];

const JourneySection = ({ data, language }: JourneySectionProps) => {
    const header = (
        <FadeIn className={cn(
            "flex flex-col gap-4 items-center",
            "lg:items-start",
        )}>
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                "text-xs tracking-wide",
            )}>
                {"OUR JOURNEY"}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-3xl sm:text-4xl text-center leading-tight",
                "lg:text-start",
            )}>
                {"เส้นทาง"}
                <span className="text-(--color-secondary)">
                    {"การเติบโตของเรา"}
                </span>
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-base sm:text-lg text-center max-w-3xl",
                "lg:text-start",
            )}>
                {"เรื่องราวสำคัญที่พาเรามาถึงจุดนี้"}
            </FadeIn>
        </FadeIn>
    );

    return (
        <section className={cn(
            "flex flex-col w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
            // the desktop scroller carries its own vertical padding while pinned
            "pt-8 pb-16 gap-8 lg:py-0",
        )}>
            <JourneyScroller items={JOURNEY_ITEMS} header={header} footer={<OurValueContent />} />
        </section>
    );
};

export default JourneySection;
