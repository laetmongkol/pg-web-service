import cn from "@/lib/tw-merge";

import PortfolioMarquee, { type PortfolioMarqueeItem } from "./components/portfolio-marquee";
import FadeIn from "@/app/component/fade-in.components";

interface PortfolioSectionProps {
    data: any;
    language: string;
}

const portfolioData: PortfolioMarqueeItem[] = [
    { image: "/api/app/image/gocprime/contents/2026-09-08T05-15-37_c1c30aef-34dc-4a9c-8a7d-c522c784bd81.webp" },
    { image: "/api/app/image/gocprime/contents/2026-08-31T07-37-40_c6c231f6-f4cc-4256-af39-2d4253aed3bc.webp" },
    { image: "/api/app/image/gocprime/contents/2026-08-17T02-43-48_3811bcb8-c7a9-454f-9c63-c57b564c5312.jpg" },
    { image: "/api/app/image/gocprime/contents/2026-08-15T05-56-59_2620bc35-3a18-4e6a-ac1d-8bb4e8eb9c5c.png" },
    { image: "/api/app/image/contents/2026-06-20T06-16-45_684083c7-1a5c-41a7-8b85-74bf53785c17.jpg" },
    { image: "/api/app/image/contents/2026-06-23T11-25-00_ab1b23b4-d065-4c2d-97a0-c37c0c5f00ff.png" },
    { image: "/api/app/image/contents/2026-06-25T04-51-10_953220f5-da2a-4230-8110-ed90cde194d8.png" },
    { image: "/api/app/image/contents/2026-06-25T04-17-13_1b71f88f-e68f-4d1e-81a7-7007497bed38.jpg" },
    { image: "/api/app/image/contents/2026-06-25T04-17-13_46eb786f-0fdd-49a1-8013-1705d2495e32.jpg" },
    { image: "/api/app/image/contents/2026-06-30T10-39-13_8788ef0a-1bbe-49ed-be3b-030a1df126c0.jpg" },
    { image: "/api/app/image/contents/2026-07-10T05-16-03_0fff04bc-1b96-4b89-9bfb-de0216e2ccd8.jpg" },
    { image: "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp" },
];

const PortfolioSection = ({ data, language }: PortfolioSectionProps) => {
    const half = Math.ceil(portfolioData.length / 2);
    const topRow = portfolioData.slice(0, half);
    const bottomRow = portfolioData.slice(half);

    return (
        <section className={cn("flex flex-col overflow-hidden", "py-16 gap-8")}>
            <FadeIn className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16", "gap-8 items-center")}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                )}>
                    {"Portfolio"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight"
                )}>
                    <span className="text-(--color-secondary)">
                        {"ผลงาน"}
                    </span>
                    {"ที่ผ่านมา"}
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center"
                )}>
                    {"ให้คำปรึกษาด้านการเทรด วางแผนกลยุทธ์การลงทุน ผลิตคอนเทนต์สื่อออนไลน์ ดูแลระบบหลังบ้าน พัฒนาและออกแบบระบบต่างๆ ให้ตอบโจทย์ธุรกิจ"}
                </FadeIn>
            </FadeIn>

            {/* full-bleed: the section is unconstrained, only the header above is centred */}
            <FadeIn delay={300} className="flex flex-col gap-5 sm:gap-10">
                <PortfolioMarquee items={topRow} speed={35} />
                <PortfolioMarquee items={bottomRow} speed={28} reverse />
            </FadeIn>
        </section>
    );
};

export default PortfolioSection;
