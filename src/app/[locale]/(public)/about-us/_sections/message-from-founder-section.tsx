import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

interface MessageFromFounderSectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const FOUNDER_PARAGRAPHS = [
    "ก่อนเริ่มเดินทางนี้ ทีมของเราตั้งเป้าที่จะแก้ปัญหาการทำงานที่ยุ่งยากแต่เกิดขึ้นซ้ำ ๆ ในโครงสร้างการทำงานร่วมสมัย เราเชื่อว่าเครื่องมือไม่ควรบังคับให้ทีมวิศวกรรม หรือทีมออกแบบต้องประนีประนอม",
    "สิ่งที่เริ่มต้นจากทีมวิจัยภายในได้เติบโตเป็นแพลตฟอร์มระดับโลก เราจัดการพัฒนาอย่างปลอดภัย ออโตเมตการปล่อยสู่ตลาดอย่างราบรื่น และนำเสนอข้อมูลเชิงลึกที่ชัดเจนจากชุดข้อมูลที่ซับซ้อน",
    "ขอขอบคุณที่ไว้วางใจเราในการดูแลซอฟต์แวร์ของคุณ เรารอคอยที่จะสร้างสิ่งที่จะเกิดขึ้นต่อไปไปด้วยกัน",
];

const MessageFromFounderSection = ({ data, language }: MessageFromFounderSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16",
        )}>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
                <FadeIn className={cn(
                    "flex flex-col gap-6",
                    "items-center text-center",
                    "lg:w-1/2 lg:items-start lg:text-start",
                )}>
                    <FadeIn delay={100} className={cn(
                        "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                        "text-xs tracking-wide",
                    )}>
                        {"MESSAGE FROM FOUNDER"}
                    </FadeIn>

                    <h2 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl leading-tight",
                    )}>
                        {"คำพูด"}
                        <span className="text-(--color-secondary)">{"จากผู้ก่อตั้ง"}</span>
                    </h2>

                    <FadeIn delay={200} className={cn(
                        "flex flex-col gap-5",
                        "text-(--text-secondary)",
                        "text-sm sm:text-base leading-relaxed",
                    )}>
                        {FOUNDER_PARAGRAPHS.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </FadeIn>

                    <FadeIn delay={300} className="flex flex-col gap-1">
                        <span className="font-bold text-(--text-primary)">{"ผู้ก่อตั้ง"}</span>
                        <span className="text-sm text-(--text-secondary)">{"ผู้ก่อตั้งและซีอีโอ, Indiglo"}</span>
                    </FadeIn>
                </FadeIn>

                <FadeIn direction="right" delay={200} className="w-full overflow-hidden rounded-3xl lg:w-1/2">
                    <FillImage
                        src={mockUpImage}
                        alt="ผู้ก่อตั้ง"
                        width={1200}
                        height={900}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        draggable={false}
                        wrapperClassName="aspect-4/3 w-full"
                        className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
                    />
                </FadeIn>
            </div>
        </section>
    );
};

export default MessageFromFounderSection;
