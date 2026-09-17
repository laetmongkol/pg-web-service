import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

import PeopleSlide, { type PersonItem } from "./components/people-slide";

interface OurPeopleSectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const PEOPLE: PersonItem[] = [
    { image: mockUpImage, name: "Ethan Clarke", role: "CEO" },
    { image: mockUpImage, name: "Grace Turner", role: "หัวหน้าทีมออกแบบ" },
    { image: mockUpImage, name: "Esther Howard", role: "นักพัฒนาหลักทรัพย์" },
    { image: mockUpImage, name: "Jhonni Dee", role: "หัวหน้าทีมวิศวกรรม" },
    { image: mockUpImage, name: "Marcus Reid", role: "ผู้จัดการฝ่ายการตลาด" },
];

const OurPeopleSection = ({ data, language }: OurPeopleSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16 gap-10",
        )}>
            <FadeIn className="flex flex-col gap-4 items-center">
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {"OUR PEOPLE"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {"รู้จัก"}
                    <span className="text-(--color-secondary)">{"ทีมงาน"}</span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {"เบื้องหลังทุกโครงการคือทีมงาน Pip Group ที่มุ่งมั่นสร้างสรรค์นวัตกรรม ด้วยประสบการณ์และความเชี่ยวชาญกว่า 15 ปี"}
                </FadeIn>
            </FadeIn>

            <FadeIn delay={300}>
                <PeopleSlide items={PEOPLE} />
            </FadeIn>
        </section>
    );
};

export default OurPeopleSection;
