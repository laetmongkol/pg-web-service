import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import ReviewSlide, { type ReviewItem } from "./components/review-slide";

const EYEBROW = "Review from client";
const TITLE = "รีวิวจากลูกค้าที่ไว้วางใจเรา";
const DESCRIPTION = "ความสำเร็จของลูกค้าคือความภูมิใจของเรา นี่คือส่วนหนึ่งของเสียงตอบรับจากผู้ที่ใช้บริการ";

const REVIEWS: ReviewItem[] = [
    {
        quote: "“กลยุทธ์ที่ทีมศรีวิไลวางแผนให้ ช่วยเพิ่มยอดขายของเราได้ถึง 40%\nภายในเวลาเพียง 3 เดือน ข้อมูลเชิงลึกของพวกเขามีค่ามากจริง ๆ”",
        name: "คุณวิภา",
        role: "บริษัท ABC Trading",
        meta: "5 min read",
        accent: "#2F80ED",
    },
    {
        quote: "“การสร้างแบรนด์ใหม่กับทีมงานมืออาชีพชุดนี้\nทำให้เราโดดเด่นในตลาดที่มีการแข่งขันสูง\nลูกค้าจำเราได้ขึ้นอย่างเห็นได้ชัด”",
        name: "คุณศิรินี รัตนภาส",
        role: "Managing Director",
        meta: "5 min read",
        accent: "#EB5757",
    },
    {
        quote: "“Growth Hacking ของที่นี่ไม่ใช่แค่คำโฆษณา\nแต่เป็นผลลัพธ์ที่จับต้องได้จริง\nเราขยายฐานลูกค้าได้รวดเร็วอย่างที่ไม่เคยเป็นมาก่อน”",
        name: "คุณสมชาย วิริยะ",
        role: "Marketing Director, GreenLife",
        meta: "5 min read",
        accent: "#7B61FF",
    },
    {
        quote: "“ทีมงานเข้าใจธุรกิจของเราตั้งแต่ครั้งแรกที่คุยกัน\nแผนที่ได้จึงลงมือทำได้ทันที ไม่ใช่รายงานที่วางบนหิ้ง”",
        name: "คุณธนกฤต ชัยพร",
        role: "เจ้าของธุรกิจค้าปลีก",
        meta: "5 min read",
        accent: "#27AE60",
    },
    {
        quote: "“คอนเทนต์ที่ทีมทำให้ช่วยให้ลูกค้าเข้าใจสินค้าของเราง่ายขึ้นมาก\nยอดทักเข้ามาสอบถามเพิ่มขึ้นเท่าตัวภายในไตรมาสเดียว”",
        name: "คุณพิมพ์ชนก แสงทอง",
        role: "Head of Marketing, Bloom Cosmetics",
        meta: "5 min read",
        accent: "#F2994A",
    },
];

const ReviewSection = () => {
    // passed into the slide so desktop can line the heading up with the arrows
    const header = (
        <FadeIn className="flex flex-col gap-4">
            <span
                className={cn(
                    "inline-flex w-fit items-center gap-2 rounded-full",
                    "border border-(--border-default) bg-(--surface-page)",
                    "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                )}
            >
                <span className="bg-(--text-primary) size-1.5 shrink-0 rounded-full" />
                {EYEBROW}
            </span>

            <h2
                className={cn(
                    "font-bold text-(--text-primary)",
                    "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                )}
            >
                {TITLE}
            </h2>

            <p className={cn("text-(--text-secondary)", "text-sm md:text-base")}>
                {DESCRIPTION}
            </p>
        </FadeIn>
    );

    return (
        <section
            id="review"
            className={cn("w-full bg-(--surface-default)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <ReviewSlide items={REVIEWS} header={header} />
            </div>
        </section>
    );
};

export default ReviewSection;
