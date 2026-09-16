import cn from "@/lib/tw-merge";

import ReviewSlide, { type ReviewItem } from "./components/review-slide";
import FadeIn from "@/app/component/fade-in.components";

interface ReviewSectionProps {
    data: any;
    language: string;
}

const reviewData: ReviewItem[] = [
    {
        quote: "ทีมงานมีความเป็นมืออาชีพมาก ทั้งการให้คำปรึกษาและบริการด้านการซื้อขายที่ครบวงจร ทำให้เรามั่นใจในการตัดสินใจและขยายธุรกิจได้อย่างมั่นคง",
        name: "คุณสมชาย และ คุณวิภา",
        role: "ผู้บริหาร, บริษัท ABC Trading",
    },
    {
        quote: "ทีมงานตอบสนองเร็วและเชื่อถือได้ ทำให้เรารู้สึกมั่นใจในความเป็นหุ้นส่วนและสามารถวางแผนต่อเนื่องได้อย่างราบรื่น",
        name: "คุณพิมพ์ใจ",
        role: "Managing Director, Vertex Solutions",
    },
    {
        quote: "บริการ CRM และการตลาดครบวงจร ช่วยให้เราสามารถติดตามลูกค้าและขยายโอกาสได้อย่างมีประสิทธิภาพมากขึ้น",
        name: "คุณณัฐพล",
        role: "CEO, Golden Capital",
    },
    {
        quote: "ระบบหลังบ้านที่วางให้ใช้งานง่ายและลดงานซ้ำซ้อนของทีมไปได้มาก ทำให้เราโฟกัสกับการขายได้เต็มที่",
        name: "คุณอารยา",
        role: "COO, Siam Logistics",
    },
    {
        quote: "ประทับใจที่ทีมเข้าใจธุรกิจของเราจริงๆ ไม่ได้เสนอแค่เครื่องมือ แต่ช่วยวางกลยุทธ์ให้เห็นภาพระยะยาวด้วย",
        name: "คุณธนกฤต",
        role: "ผู้ก่อตั้ง, Nexus Ventures",
    },
];

const ReviewSection = ({ data, language }: ReviewSectionProps) => {
    // passed into the slide so desktop can line it up with the arrows
    const header = (
        <FadeIn className={cn("flex flex-col gap-4",
            "items-center text-center",
            "lg:items-start lg:text-start"
        )}>
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
            )}>
                {"ลูกค้าพูดถึงเรา"}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-3xl sm:text-4xl leading-tight"
            )}>
                <span className="text-(--color-secondary)">
                    {"รีวิว"}
                </span>
                {"จากลูกค้า"}
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-base sm:text-lg"
            )}>
                {"เสียงตอบรับจากลูกค้าที่ไว้วางใจให้เราดูแล"}
            </FadeIn>
        </FadeIn>
    );

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16"
        )}>
            <ReviewSlide items={reviewData} header={header} />
        </section>
    );
};

export default ReviewSection;
