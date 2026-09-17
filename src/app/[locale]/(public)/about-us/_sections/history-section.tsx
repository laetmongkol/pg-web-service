import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

interface HistorySectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const HISTORY_PARAGRAPHS = [
    "Pip Group เกิดขึ้นจากความเชื่อที่ว่าซอฟต์แวร์ไม่ควรยุ่งยากจนเสียเวลา เราเริ่มต้นจากทีมเล็ก ๆ ที่ต้องการแก้ปัญหาการทำงานร่วมกันและประสิทธิภาพให้กับองค์กรที่เติบโตอย่างรวดเร็ว โดยมีวิสัยทัศน์หลักคือการเปลี่ยนความซับซ้อนให้เป็นระบบที่แข็งแกร่งและสวยงาม",
    "ผู้ก่อตั้งเห็นโอกาสที่จะเชื่อมช่องว่างระหว่างทีมวิศวกรรมและทีมออกแบบ โดยไม่บังคับให้ทีมต้องประนีประนอม เราเริ่มสร้างเครื่องมือภายในเพื่อแก้ปัญหาของเราเอง — และสุดท้ายก็กลายเป็นแพลตฟอร์มที่หลาย ๆ องค์กรต้องการ",
    "วันนี้ Pip Group เติบโตเป็นแพลตฟอร์มที่ช่วยให้ธุรกิจสร้างนวัตกรรมอย่างปลอดภัย ขยายขนาดด้วยความมั่นใจ และสร้างความสัมพันธ์ที่ยั่งยืน เรายังคงยึดค่านิยมเรื่องความเรียบง่าย ความโปร่งใส และความพยายามอย่างไม่หยุดยั้งเพื่อความพึงพอใจของผู้ใช้",
];

const HISTORY_STATS = [
    {
        value: "10+",
        title: "ปีแห่งความสำเร็จ",
        description: "มั่นคงและเติบโตอย่างต่อเนื่อง",
    },
    {
        value: "20+",
        title: "บุคลากรผู้เชี่ยวชาญ",
        description: "ทำงานอย่างมืออาชีพ",
    },
    {
        value: "5",
        title: "บริษัทในเครือ",
        description: "เชื่อมโยงระบบธุรกิจที่แข็งแกร่ง",
    },
    {
        value: "50+",
        title: "พาร์ทเนอร์ระดับสากล",
        description: "ร่วมสร้างโอกาสระดับสากล",
    },
];

const HistorySection = ({ data, language }: HistorySectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto pt-30 px-6 sm:px-12 md:px-16",
            "pb-16 gap-8"
        )}>
            <FadeIn className={cn(
                "flex flex-col gap-4 items-center",
            )}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide"
                )}>
                    {"HISTORY"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {"ประวัติ"}
                    <span className="text-(--color-secondary)">
                        {"ความเป็นมา"}
                    </span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {"เรื่องราวของ Pip Group จากจุดเริ่มต้นจนถึงการเติบโตที่ยั่งยืน"}
                </FadeIn>
            </FadeIn>

            <div className={cn(
                "flex flex-col lg:flex-row gap-8 whitespace-pre-line",
                "items-center"
            )}>
                {/* image caption */}
                <FadeIn delay={200} direction="left" className={cn(
                    "relative rounded-3xl overflow-hidden w-full",
                    "lg:w-1/2"
                )}>
                    <FillImage
                        src={mockUpImage}
                        alt="Pip Group History"
                        width={1000}
                        height={1000}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        wrapperClassName="aspect-video lg:aspect-square"
                        className={cn(
                            "object-cover",
                            BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                        )}
                    />
                </FadeIn>

                <FadeIn className={cn(
                    "flex flex-col gap-8 items-center w-full",
                    "lg:items-start lg:w-1/2"
                )}>
                    <h3 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-2xl sm:text-3xl text-center leading-tight",
                        "lg:text-start"
                    )}>
                        {"เริ่มต้นจากความต้องการที่แท้จริง —"}
                        <span className="block">
                            {"ลดช่องว่างระหว่างทีมและประสิทธิภาพ"}
                        </span>
                    </h3>

                    <FadeIn delay={200} className={cn(
                        "flex flex-col gap-5",
                        "text-(--text-secondary)",
                        "text-base sm:text-lg text-center",
                        "lg:text-start"
                    )}>
                        {HISTORY_PARAGRAPHS.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </FadeIn>

                    <div className={cn(
                        "grid grid-cols-2 md:grid-cols-4 gap-4",
                    )}>
                        {HISTORY_STATS.map((item, index) => (
                            <FadeIn key={item.title} delay={index * 150} className="flex flex-col gap-1">
                                <span className="text-3xl font-bold text-(--color-secondary)">{item.value}</span>
                                <span className="text-base font-medium text-(--text-primary)">{item.title}</span>
                                <span className="text-xs text-(--text-secondary)">{item.description}</span>
                            </FadeIn>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

export default HistorySection;
