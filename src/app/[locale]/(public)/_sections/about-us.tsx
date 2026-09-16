import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";
import cn from "@/lib/tw-merge";
import { ArrowUpRight, Briefcase, Calendar, Globe, type LucideIcon } from "lucide-react";

interface AboutUsProps {
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const ABOUT_US_ICONS: Record<string, LucideIcon> = {
    Calendar,
    Briefcase,
    Globe,
};

const resolveAboutUsIcon = (icon?: string | null): LucideIcon =>
    (icon && ABOUT_US_ICONS[icon]) || Calendar;

const aboutUsData = [
    {
        icon: "Calendar",
        title: "ปีแห่งประสบการณ์",
        value: "10+",
    },
    {
        icon: "Briefcase",
        title: "บริษัทในเครือ",
        value: "6",
    },
    {
        icon: "Globe",
        title: "ผู้เข้าร่วมประสบการณ์",
        value: "20+",
    },
];

const AboutUs = ( { language }: AboutUsProps ) => {
    return (
        <section className={cn("flex flex-col max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
            "py-16 gap-8"
        )}>
            <div className={cn(
                "flex flex-col gap-8 whitespace-pre-line",
                "items-center"
            )}>

                <span className={cn(
                    "text-(--color-amber-500) border border-(--color-amber-500) px-4 py-1 rounded-full text-center font-bold"
                )}>
                    {"เกี่ยวกับเรา"}
                </span>

                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl text-center leading-tight"
                )}>
                    {"มรดกแห่งความไว้วางใจ"}
                    <p className="text-(--color-secondary)">
                        {"สร้างขึ้นเพื่อตลาดระดับสากล"}
                    </p>
                </h2>

                <p className={cn(
                    "text-(--text-secondary)",
                    "text-base text-center"
                )}>
                    {"ด้วยประสบการณ์กว่าสามทศวรรษ เราเป็นหลักยึดที่มั่นคงให้กับองค์กรที่เผชิญกับการเปลี่ยนแปลงเชิงโครงสร้างเราดำเนินงานที่จุดตัดระหว่างกลยุทธ์ ทางธุรกิจ ข้อมูลเชิงกฎระเบียบ และทุนเพื่อการเปลี่ยนแปลง"}
                </p>

                <div className={cn(
                    "flex flex-col gap-7 w-full"
                )}>
                    {aboutUsData.map((item) => {
                        const Icon = resolveAboutUsIcon(item.icon);
                        return (
                            <div key={item.title} className="flex flex-row items-center gap-4">
                                <Icon className="size-8 shrink-0 text-(--color-secondary) bg-(--surface-default) p-3 rounded-xl w-14 h-14" strokeWidth={1.5} />
                                <span className="flex flex-col gap-1">
                                    <span className="text-3xl font-bold text-(--text-primary)">{item.value}</span>
                                    <span className="text-base font-medium text-(--text-secondary)">{item.title}</span>
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* image caption */}
                <div className={cn(
                    "relative rounded-3xl overflow-hidden"
                )}>
                    <FillImage
                        src={mockUpImage}
                        alt="About Us"
                        width={1000}
                        height={1000}
                        wrapperClassName="aspect-square"
                        className={cn(
                            "object-cover"
                        )}
                    />
                    <div className={cn(
                        "absolute flex flex-col justify-center bottom-0 w-full bg-(--surface-invert)/50 backdrop-blur-sm rounded-b-3xl",
                        "p-5 gap-4"
                    )}>
                        <span className={cn(
                            "text-(--text-invert)",
                            "flex flex-row items-center gap-3"
                        )}>
                            <span className={cn("text-3xl font-bold")}>{"100%"}</span>
                            <span className={cn("text-base")}>{"ความสำเร็จของลูกค้า"}</span>
                        </span>
                        <hr className={cn("border-(--surface-default)")} />
                        <p className={cn(
                            "text-(--text-invert)",
                            "text-sm"
                        )}>{"\"ช่วยเพิ่มประสิทธิภาพและผลกำไรสุทธิองค์กรเฉลี่ยกว่า 35% ตั้งแต่ปีแรก\""}</p>
                    </div>
                </div>
                <LinkCustom href={`/${language}/about-us`}>
                    <span className="text-xl font-medium text-(--color-secondary) flex items-center gap-2">
                        {"ดูเพิ่มเติมเกี่ยวกับเรา"}
                        <ArrowUpRight className="size-6 inline-block border border-(--color-secondary) rounded-full p-1 w-9 h-9" />
                    </span>
                </LinkCustom>
            </div>
        </section>
    )
}

export default AboutUs;