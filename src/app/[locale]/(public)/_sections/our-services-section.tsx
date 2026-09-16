import cn from "@/lib/tw-merge";

import OurServicesSlide from "./components/our-services-slide";
import FadeIn from "@/app/component/fade-in.components";

interface OurServicesSectionProps {
    data: any;
    language: string;
}

const servicesData = [
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        title: "ให้คำปรึกษาด้านการเทรด1",
        description: "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร1",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        title: "ให้คำปรึกษาด้านการเทรด2",
        description: "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร2",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        title: "ให้คำปรึกษาด้านการเทรด3",
        description: "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร3",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        title: "ให้คำปรึกษาด้านการเทรด4",
        description: "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร4",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        title: "ให้คำปรึกษาด้านการเทรด5",
        description: "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร5",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        title: "ให้คำปรึกษาด้านการเทรด6",
        description: "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร6",
    },
]

const OurServicesSection = ({ data, language }: OurServicesSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 ",
            "py-16 gap-8"
        )}>
            <FadeIn className="flex flex-col gap-8 items-center">
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                )}>
                    {"บริการของเรา"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight"
                )}>
                    <p><span className="text-(--color-secondary)">
                        {"การบริการ"}
                    </span>
                        {"และ"}
                    </p>
                    <p><span className="text-(--color-secondary)">
                        {"ความเชี่ยวชาญ"}
                    </span>
                        {"ของเรา"}
                    </p>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center"
                )}>
                    {"เรามีบริการที่หลากหลายเพื่อตอบโจทย์ธุรกิจของคุณ ตั้งแต่ให้คำปรึกษาด้านการเทรด ผลิตคอนเทนต์ ดูแลระบบหลังบ้าน ไปจนถึงพัฒนาระบบต่างๆ"}
                </FadeIn>
            </FadeIn>
            <FadeIn delay={300} className="-mx-6 overflow-hidden px-6 py-4 sm:-mx-12 sm:px-12">
                <OurServicesSlide items={servicesData} />
            </FadeIn>
        </section>
    )
}

export default OurServicesSection;