import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";

interface PartnerSectionProps {
    data: any;
    language: string;
}

const partnerImages = [
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
    "/api/app/image/contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png",
];

const GRID_COLUMNS = 3;

const PartnerSection = ({ data, language }: PartnerSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16"
        )}>
            {/* oversized corners on one diagonal — the shape from the mock */}
            <div className={cn("bg-(--text-invert) w-full",
                "rounded-3xl rounded-tl-[4rem] rounded-br-[4rem]",
                "lg:rounded-tl-[6rem] lg:rounded-br-[6rem]",
                "p-8 sm:p-10 lg:p-14",
                "flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-center"
            )}>
                <FadeIn direction="left" delay={100} className={cn("flex flex-col gap-6",
                    "items-center text-center",
                    "lg:w-5/12 lg:items-start lg:text-start"
                )}>
                    <FadeIn delay={100} className={cn("hidden lg:block",
                        "text-(--color-secondary) text-sm font-bold tracking-[0.25em]"
                    )}>
                        {"PARTNERS"}
                    </FadeIn>

                    <h2 className={cn("font-bold text-(--text-primary)",
                        "text-3xl sm:text-4xl leading-tight"
                    )}>
                        {"พาร์ทเนอร์ที่ไว้วางใจ"}
                        <p className="text-(--color-secondary)">
                            {"เติบโตไปด้วยกัน"}
                        </p>
                    </h2>

                    <FadeIn delay={200} className={cn("text-(--text-secondary) italic",
                        "text-sm sm:text-base leading-relaxed",
                        "lg:border-l-2 lg:border-(--color-secondary) lg:pl-5"
                    )}>
                        {"\"การร่วมมือกับทีมงานของเราช่วยขยายธุรกิจในตลาดเอเชียตะวันออกเฉียงใต้ได้อย่างมีประสิทธิภาพ ด้วยกลยุทธ์ที่แม่นยำและวิสัยทัศน์ที่ชัดเจน\""}
                    </FadeIn>
                </FadeIn>

                {/* one element, two orientations: a rule above the grid, a spine beside it */}
                <div className={cn("shrink-0 bg-(--text-primary)/15",
                    "h-px w-full",
                    "lg:h-72 lg:w-px"
                )} />

                <FadeIn direction="right" delay={300} className="grid grid-cols-3 lg:flex-1">
                    {partnerImages.map((image, index) => (
                        <FadeIn delay={index * 150}
                            key={`${image}-${index}`}
                            className={cn("flex items-center justify-center px-2 py-6 sm:px-4 sm:py-8",
                                // rows after the first carry the divider, so the line runs unbroken
                                index >= GRID_COLUMNS && "border-t border-(--text-primary)/15"
                            )}
                        >
                            <FillImage
                                src={image}
                                alt="Partner"
                                width={400}
                                height={160}
                                sizes="(max-width: 1024px) 30vw, 180px"
                                wrapperClassName="w-full aspect-5/2"
                                className="object-contain"
                            />
                        </FadeIn>
                    ))}
                </FadeIn>
            </div>
        </section>
    );
};

export default PartnerSection;
