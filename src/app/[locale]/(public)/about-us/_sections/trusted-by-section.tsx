import FadeIn from "@/app/component/fade-in.components";
import PartnerMarquee from "@/app/[locale]/(public)/_sections/components/partner-marquee";
import cn from "@/lib/tw-merge";

interface TrustedBySectionProps {
    data: any;
    language: string;
}

/** The same logos the homepage partner card runs. */
const TRUSTED_BY_LOGOS = [
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
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

            {/* full-bleed: only the header above is centred, the logo row runs edge to edge */}
            <FadeIn delay={300}>
                <PartnerMarquee items={TRUSTED_BY_LOGOS} />
            </FadeIn>
        </section>
    );
};

export default TrustedBySection;
