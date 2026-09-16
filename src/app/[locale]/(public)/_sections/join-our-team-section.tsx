import { ArrowUpRight } from "lucide-react";

import cn from "@/lib/tw-merge";

import LinkCustom from "@/components/link-custom.component";

import JoinOurTeamVideo from "./components/join-our-team-video";
import FadeIn from "@/app/component/fade-in.components";

interface JoinOurTeamSectionProps {
    data: any;
    language: string;
}

const benefitsData = [
    {
        title: "วัฒนธรรมองค์กรที่ดี",
        description: "สภาพแวดล้อมการทำงานที่เปิดกว้าง สนับสนุนความคิด สร้างสรรค์ และเติบโตไปด้วยกัน",
    },
    {
        title: "โอกาสเติบโต",
        description: "โอกาสเรียนรู้และพัฒนาทักษะ อย่างต่อเนื่องเพื่อเติบโตไปพร้อม กับบริษัท",
    },
    {
        title: "สวัสดิการครบ",
        description: "สวัสดิการและผลประโยชน์ที่ดี เพื่อความมั่นคงและความสุข ของทีมงาน",
    },
    {
        title: "ทีมงานคุณภาพ",
        description: "ทีมงานที่มีความเชี่ยวชาญและเป็นมืออาชีพ มาร่วมสร้างผลงานด้วยกัน",
    },
];

const JoinOurTeamSection = ({ data, language }: JoinOurTeamSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16"
        )}>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
                <JoinOurTeamVideo className="lg:w-1/2" />
            
                <FadeIn className={cn("flex flex-col gap-6",
                    "items-center text-center",
                    "lg:w-1/2 lg:items-start lg:text-start"
                )}>
                    <FadeIn delay={100} className={cn(
                        "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
                    )}>
                        {"JOIN OUR TEAM"}
                    </FadeIn>

                    <h2 className={cn(
                        "font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl leading-tight"
                    )}>
                        {"ร่วม"}
                        <span className="text-(--color-secondary)">
                            {"ขับเคลื่อนการเติบโต"}
                        </span>
                        <p>{"เพื่อสร้างอนาคตที่ยั่งยืน"}</p>
                    </h2>

                    <FadeIn delay={200} className={cn(
                        "text-(--text-secondary)",
                        "text-base sm:text-lg"
                    )}>
                        {"เราดำเนินธุรกิจที่ยึดมั่นในธรรมาภิบาลมุ่งเน้นการสร้างสังคมและระบบเศรษฐกิจเชิงบวกเพื่อ เป็นส่วนหนึ่งในการขับเคลื่อนการพัฒนาอย่างยั่งยืนให้กับสังคมไทยและระดับภูมิภาค"}
                    </FadeIn>

                    <FadeIn direction="right" delay={300} className="grid w-full gap-6 sm:grid-cols-2 sm:gap-x-8">
                        {benefitsData.map((benefit, index) => (
                            <FadeIn delay={index * 150} key={benefit.title} className="flex flex-row items-start gap-4 text-start">
                                <span className="text-xl font-bold text-(--color-secondary) tabular-nums">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="flex flex-col gap-1">
                                    <span className="font-bold text-(--text-primary)">
                                        {benefit.title}
                                    </span>
                                    <span className="text-sm text-(--text-secondary) leading-relaxed">
                                        {benefit.description}
                                    </span>
                                </span>
                            </FadeIn>
                        ))}
                    </FadeIn>

                    <FadeIn delay={400} className="w-fit">
                        <LinkCustom href={`/${language}/contact-us`} className="w-fit">
                            <span className={cn(
                                "font-medium text-(--text-invert) flex items-center gap-2",
                                "bg-(--color-secondary) rounded-full",
                                "hover:scale-105 transition-transform duration-300",
                                "text-base px-8 py-3"
                            )}>
                                {"ร่วมงานกับเรา"}
                                <ArrowUpRight className="size-5 inline-block" />
                            </span>
                        </LinkCustom>
                    </FadeIn>
                </FadeIn>
            </div>
        </section>
    );
};

export default JoinOurTeamSection;
