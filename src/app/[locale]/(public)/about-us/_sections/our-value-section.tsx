import { Globe, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";

import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

interface OurValueSectionProps {
    data: any;
    language: string;
}

type ValueItem = {
    icon: string;
    title: string;
    description: string;
};

const VALUE_ICONS: Record<string, LucideIcon> = {
    Sparkles,
    ShieldCheck,
    Globe,
    TrendingUp,
};

const resolveValueIcon = (icon?: string | null): LucideIcon =>
    (icon && VALUE_ICONS[icon]) || Sparkles;

const VALUE_ITEMS: ValueItem[] = [
    {
        icon: "Sparkles",
        title: "นวัตกรรมล้ำสมัย",
        description: "พัฒนาเทคโนโลยีและโซลูชันใหม่อย่างต่อเนื่องเพื่อตอบโจทย์ความต้องการที่ เปลี่ยนแปลงของตลาด",
    },
    {
        icon: "ShieldCheck",
        title: "ความปลอดภัยระดับสูง",
        description: "ระบบรักษาความปลอดภัยได้มาตรฐานสากลปกป้องข้อมูลและทรัพย์สินดิจิทัลของลูกค้า",
    },
    {
        icon: "Globe",
        title: "เครือข่ายระดับสากล",
        description: "ดำเนินงานและให้บริการลูกค้าทั่วโลก พร้อมทีมผู้เชี่ยวชาญในหลายภูมิภาค",
    },
    {
        icon: "TrendingUp",
        title: "ประสิทธิภาพเหนือชั้น",
        description: "แพลตฟอร์มที่ออกแบบเพื่อความเร็วและความเสถียร รองรับองค์กรขนาดใหญ่",
    },
];

/**
 * Header + cards without a `<section>` of its own, so the journey scroller can render it inside
 * its pinned viewport — the timeline alone left most of the screen empty while it scrolled.
 */
export const OurValueContent = () => (
    <div className="flex flex-col gap-6">
        <FadeIn className="flex flex-col gap-3 items-center">
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                "text-xs tracking-wide",
            )}>
                {"OUR VALUE"}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-2xl sm:text-3xl text-center leading-tight",
            )}>
                <span className="text-(--color-secondary)">{"จุดแข็ง"}</span>
                {"และ"}
                <span className="text-(--color-secondary)">{"ศักยภาพ"}</span>
                {"ของเรา"}
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-sm sm:text-base text-center max-w-3xl",
            )}>
                {"เราผสมผสานนวัตกรรม ศักยภาพ และทรัพยากรระดับสูงเพื่อความสำเร็จที่โดดเด่นและเป็นเอกลักษณ์"}
            </FadeIn>
        </FadeIn>

        <div className={cn(
            "grid gap-4",
            "sm:grid-cols-2 lg:grid-cols-4",
        )}>
            {VALUE_ITEMS.map((item, index) => {
                const Icon = resolveValueIcon(item.icon);
                return (
                    <FadeIn
                        key={item.title}
                        delay={index * 150}
                        className={cn(
                            "flex flex-col gap-3 h-full",
                            "rounded-2xl border border-(--border-default) bg-(--surface-elevated)",
                            "p-5",
                        )}
                    >
                        <Icon
                            className="size-9 shrink-0 rounded-xl bg-(--surface-page) p-2 text-(--color-secondary)"
                            strokeWidth={1.5}
                        />
                        <h3 className="text-sm font-bold text-(--text-primary) sm:text-base">
                            {item.title}
                        </h3>
                        <p className="text-xs text-(--text-secondary)">
                            {item.description}
                        </p>
                    </FadeIn>
                );
            })}
        </div>
    </div>
);

const OurValueSection = ({ data, language }: OurValueSectionProps) => {
    return (
        <section className={cn(
            "flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
            "py-16 gap-10",
        )}>
            <OurValueContent />
        </section>
    );
};

export default OurValueSection;
