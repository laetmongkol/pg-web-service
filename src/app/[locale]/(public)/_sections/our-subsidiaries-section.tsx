import cn from "@/lib/tw-merge";

import SubsidiariesScroller, { type SubsidiaryItem } from "./components/subsidiaries-scroller";
import FadeIn from "@/app/component/fade-in.components";

interface OurSubsidiariesSectionProps {
    data: any;
    language: string;
}

const subsidiariesData: SubsidiaryItem[] = [
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        name: "PIP Evolution",
        thaiName: "พิพ อีโวลูชั่น",
        description: "PIP Evolution is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients.",
        href: "https://www.pipgroup.com",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        name: "Sriwilai Bangkok",
        thaiName: "ศรีวิไล แบงค์คอก",
        description: "Sriwilai Bangkok is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients.",
        href: "https://www.pipgroup.com",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        name: "7Days Academy",
        thaiName: "เซเว่นเดย์ อคาเดมี่",
        description: "7Days Academy is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients.",
        href: "https://www.pipgroup.com",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        name: "DMS Infinite",
        thaiName: "ดีเอ็มเอส อินฟินิตี้",
        description: "DMS Infinite is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients.",
        href: "https://www.pipgroup.com",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        name: "Sabaidee Finx",
        thaiName: "สบายดี ฟินซ์",
        description: "Sabaidee Finx is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients.",
        href: "https://www.pipgroup.com",
    },
    {
        image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp",
        name: "PG Solution",
        thaiName: "พีจี โซลูชั่น",
        description: "PG Solution is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients.",
        href: "https://www.pipgroup.com",
    },
]

const OurSubsidiariesSection = ({ data, language }: OurSubsidiariesSectionProps) => {
    // passed into the scroller so desktop can pin it next to the track
    const header = (
        <FadeIn className="flex flex-col gap-8 items-center">
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
            )}>
                {"OUR SUBSIDIARIES"}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-3xl sm:text-4xl text-center leading-tight"
            )}>
                <p className="text-(--color-secondary)">
                    {"บริษัทในเครือ"}
                </p>
                {"PIP Group Holding"}
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-base sm:text-lg text-center"
            )}>
                {"กลุ่มบริษัทในเครือของเราผสานจุดแข็งจากหลากหลายอุตสาหกรรมหลัก เพื่อสร้างระบบนิเวศทางธุรกิจที่สมบูรณ์แบบ แข็งแกร่ง และพร้อมขับเคลื่อนเศรษฐกิจในระดับสากล"}
            </FadeIn>
        </FadeIn>
    );

    return (
        <section className={cn("flex flex-col px-6 sm:px-12 md:px-16 ",
            "py-16 gap-8"
        )}>
            <SubsidiariesScroller items={subsidiariesData} header={header} />
        </section>
    )
}

export default OurSubsidiariesSection;
