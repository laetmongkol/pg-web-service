import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

import TrustedMarquee from "./components/trusted-marquee";

interface TrustedBySectionProps {
    data: any;
    language: string;
}

const TRUSTED_BY = [
    "Logobase",
    "Stackcraft",
    "Auratool",
    "Polywork",
    "Logoflow",
    "Pulsewave",
];

const TrustedBySection = ({ data, language }: TrustedBySectionProps) => {
    return (
        <section className={cn("flex flex-col overflow-hidden", "py-16 gap-8")}>
            <FadeIn className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16", "gap-4 items-center")}>
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {"TRUSTED BY"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {"ได้รับ"}
                    <span className="text-(--color-secondary)">{"การสนับสนุน"}</span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {"เสริมพลังให้กับธุรกิจยุคใหม่ ตั้งแต่สตาร์ทอัพจนถึงผู้นำระดับโลก"}
                </FadeIn>
            </FadeIn>

            {/* full-bleed: only the header above is centred, the row runs edge to edge */}
            <FadeIn delay={300}>
                <TrustedMarquee items={TRUSTED_BY} />
            </FadeIn>
        </section>
    );
};

export default TrustedBySection;
