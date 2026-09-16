import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";
import cn from "@/lib/tw-merge";
import { ArrowUpRight, Briefcase, Calendar, Globe, type LucideIcon } from "lucide-react";

interface AboutUsProps {
    data: any;
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

const AboutUs = ({ data, language }: AboutUsProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto pt-30 px-6 sm:px-12 md:px-16",
            "pb-16 gap-8"
        )}>
            <div className={cn(
                "flex flex-col lg:flex-row gap-8 whitespace-pre-line",
                "items-center"
            )}>
                <FadeIn className={cn(
                    "flex flex-col gap-8 items-center",
                    "lg:items-start lg:w-1/2"
                )}>
                    <FadeIn delay={100} className={cn(
                        "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                    )}>
                        {"เกี่ยวกับเรา"}
                    </FadeIn>

                    <h2 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl text-center leading-tight",
                        "lg:text-start"
                    )}>
                        {"มรดกแห่งความไว้วางใจ"}
                        <p className="text-(--color-secondary)">
                            {"สร้างขึ้นเพื่อตลาดระดับสากล"}
                        </p>
                    </h2>

                    <FadeIn delay={200} className={cn(
                        "text-(--text-secondary)",
                        "text-base sm:text-lg text-center",
                        "lg:text-start"
                    )}>
                        {"ด้วยประสบการณ์กว่าสามทศวรรษ เราเป็นหลักยึดที่มั่นคงให้กับองค์กรที่เผชิญกับการเปลี่ยนแปลงเชิงโครงสร้างเราดำเนินงานที่จุดตัดระหว่างกลยุทธ์ ทางธุรกิจ ข้อมูลเชิงกฎระเบียบ และทุนเพื่อการเปลี่ยนแปลง"}
                    </FadeIn>

                    <LinkCustom href={`/${language}/about-us`} className="hidden lg:block group hover:underline text-(--color-secondary)">
                        <FadeIn delay={300} className="text-xl font-medium text-(--color-secondary) flex items-center gap-2">
                            {"ดูเพิ่มเติมเกี่ยวกับเรา"}
                            <ArrowUpRight className="size-6 inline-block border border-(--color-secondary) rounded-full p-1 w-9 h-9 group-hover:scale-105 transition-all duration-300" />
                        </FadeIn>
                    </LinkCustom>

                    <div className={cn(
                        "flex flex-col gap-7 w-full",
                        "md:flex-row md:justify-between"
                    )}>
                        {aboutUsData.map((item, index) => {
                            const Icon = resolveAboutUsIcon(item.icon);
                            return (
                                <FadeIn key={item.title} delay={index * 150} className="flex flex-row items-center gap-4">
                                    <Icon className="size-8 shrink-0 text-(--color-secondary) bg-(--surface-50) p-3 rounded-xl w-13 h-13" strokeWidth={1.5} />
                                    <span className="flex flex-col gap-1">
                                        <span className="text-xl font-bold text-(--text-primary)">{item.value}</span>
                                        <span className="text-sm font-medium text-(--text-secondary)">{item.title}</span>
                                    </span>
                                </FadeIn>
                            );
                        })}
                    </div>
                </FadeIn>

                {/* image caption */}
                <FadeIn delay={200} direction="right" className={cn(
                    "relative rounded-3xl overflow-hidden",
                    "lg:w-1/2"
                )}>
                    <FillImage
                        src={mockUpImage}
                        alt="About Us"
                        width={1000}
                        height={1000}
                        wrapperClassName="aspect-square md:aspect-4/3"
                        className={cn(
                            "object-cover"
                        )}
                    />
                    <div className={cn(
                        "absolute flex flex-col lg:items-center justify-center p-5 gap-4 bottom-0 w-full bg-(--surface-invert)/50 backdrop-blur-sm rounded-b-3xl",
                        "lg:flex-row"
                    )}>
                        <span className={cn(
                            "text-(--text-invert)",
                            "flex flex-row lg:flex-col lg:items-start items-center gap-3"
                        )}>
                            <span className={cn("text-3xl lg:text-2xl font-bold")}>{"100%"}</span>
                            <span className={cn("text-base lg:text-xs")}>{"ความสำเร็จของลูกค้า"}</span>
                        </span>
                        <span
                            aria-hidden
                            className={cn(
                                "shrink-0 bg-(--text-invert)/30",
                                "h-px w-full",
                                "lg:h-12 lg:w-px"
                            )}
                        />
                        <p className={cn(
                            "text-(--text-invert)",
                            "text-sm"
                        )}>{"\"ช่วยเพิ่มประสิทธิภาพและผลกำไรสุทธิองค์กรเฉลี่ยกว่า 35% ตั้งแต่ปีแรก\""}</p>
                    </div>
                </FadeIn>
                <LinkCustom href={`/${language}/about-us`} className="lg:hidden block group hover:underline text-(--color-secondary)">
                    <span className="text-xl font-medium text-(--color-secondary) flex items-center gap-2">
                        {"ดูเพิ่มเติมเกี่ยวกับเรา"}
                        <ArrowUpRight className="size-6 inline-block border border-(--color-secondary) rounded-full p-1 w-9 h-9 group-hover:scale-105 transition-all duration-300" />
                    </span>
                </LinkCustom>
            </div>
        </section>
    )
}

export default AboutUs;