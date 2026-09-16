import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";
import { Clock, Share2, AlignVerticalJustifyEnd, TrendingUp, type LucideIcon } from "lucide-react";

interface ConsiderationSectionProps {
    data: any;
    language: string;
}

const CONSIDERATION_ICONS: Record<string, LucideIcon> = {
    AlignVerticalJustifyEnd,
    TrendingUp,
    Share2,
    Clock,
};

const resolveConsiderationIcon = (icon?: string | null): LucideIcon =>
    (icon && CONSIDERATION_ICONS[icon]) || AlignVerticalJustifyEnd;

const ITEMS = [
{
    icon: "AlignVerticalJustifyEnd",
    number: "01",
    title: "รากฐานที่แข็งแกร่ง",
    description: "วางรากฐานที่มั่นคงให้กับทุกธุรกิจในกลุ่มด้วยระบบ บริหารจัดการที่มีวินัยและการวาง แผนระยะยาว"
},
{
    icon: "TrendingUp",
    number: "02",
    title: "เติบโตอย่างมีกลยุทธ์",
    description: "ขยายธุรกิจอย่างมีแบบแผน ผ่านกลยุทธ์ ที่ยั่งยืนและปรับให้เหมาะกับแต่ละหน่วยธุรกิจ"
},
{
    icon: "Share2",
    number: "03",
    title: "โอกาสที่เชื่อมต่อกัน",
    description: "สร้างพลังร่วมระหว่างกลุ่ม เชื่อมโยง ทรัพยากร บุคลากร และโอกาสที่ธุรกิจเดียวทำไม่ได้"
},
{
    icon: "Clock",
    number: "04",
    title: "คุณค่าระยะยาว",
    description: "สร้างคุณค่าที่ยั่งยืนให้กับธุรกิจ พาร์ทเนอร์ และผู้มี ส่วนได้ส่วนเสีย วัดผลเป็นทศวรรษ ไม่ใช่รายไตรมาส"
}
]

const ConsiderationSection = () => {
    return (
        <section className={cn("flex flex-col max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
            "py-16 gap-8"
        )}>
            <FadeIn direction="down" className={cn("flex flex-col gap-8",
                "items-center"
            )}>
                <span className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                )}>
                    {"ทำไมต้องเลือกเรา"}
                </span>

                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl text-center leading-tight"
                )}>
                    {"สร้างขึ้นเพื่อ"}
                    <span className="text-(--color-secondary)">
                        {"คุณค่าระยะยาว"}
                    </span>
                </h2>
                <div className={cn("grid grid-cols-1 sm:grid-cols-4 gap-5 w-full",
                    "items-center"
                )}>
                    {ITEMS.map((item)=>{
                        const Icon = resolveConsiderationIcon(item.icon);
                        return (
                        <div key={item.number} className={cn("flex flex-col gap-4 bg-white p-8 rounded-3xl w-full border border-(--border-default)")}>
                            <Icon className={"text-(--color-secondary) size-12 w-12 h-12 bg-(--color-secondary)/10 rounded-xl p-3"} />
                            <span className={cn("text-(--text-primary) text-3xl font-bold")}>
                                {item.number}
                            </span>
                            <span className={cn("text-(--text-primary) text-base font-bold")}>
                                {item.title}
                            </span>
                            <span className={cn("w-1/10 h-0.5 bg-(--color-secondary)")}/>
                            <span className={cn("text-(--text-secondary) text-sm")}>
                                {item.description}
                            </span>
                        </div>
                        );
                    })}
                </div>
            </FadeIn>
        </section>
    )
};

export default ConsiderationSection;