import FadeIn from "@/app/component/fade-in.components";
import JoinOurTeamVideo from "@/app/[locale]/(public)/_sections/components/join-our-team-video";
import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

interface OurImpactSectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const Tile = ({ className, alt }: { className?: string; alt: string }) => (
    <FillImage
        src={mockUpImage}
        alt={alt}
        width={1200}
        height={900}
        sizes="(max-width: 1024px) 100vw, 33vw"
        draggable={false}
        wrapperClassName={cn("overflow-hidden rounded-2xl", className)}
        className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
    />
);

const StatTile = ({
    value,
    label,
    className,
}: {
    value: string;
    label: string;
    className?: string;
}) => (
    <div className={cn(
        "flex flex-col justify-center gap-2 rounded-2xl p-6",
        className,
    )}>
        <span className="text-3xl font-bold sm:text-4xl">{value}</span>
        <span className="text-sm">{label}</span>
    </div>
);

const OurImpactSection = ({ data, language }: OurImpactSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16 gap-10",
        )}>
            <FadeIn className="flex flex-col gap-4 items-center">
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {"OUR IMPACT"}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {"ทำงานร่วมกัน"}
                    <span className="text-(--color-secondary)">{"สร้างสรรค์สิ่งที่ยิ่งใหญ่"}</span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {"วัฒนธรรมของเราส่งเสริมความคิดสร้างสรรค์ การทำงานเป็นทีม และการพัฒนาตนเองอย่างต่อเนื่อง เพื่อสร้างผลงานที่ยั่งยืนและเติบโตไปด้วยกัน"}
                </FadeIn>
            </FadeIn>

            <FadeIn delay={300} className={cn(
                "grid gap-4",
                "sm:grid-cols-2",
                // the mock's mosaic: one tall feature tile, then two stacked columns beside it.
                // the columns are their own flex stacks because the short stat card sits at the
                // top of one and the bottom of the other — a shared grid row can't do both
                // half the row for the video, a quarter for each stacked column
                "lg:grid-cols-[2fr_1fr_1fr]",
            )}>
                {/* the same looping embed the homepage uses for JOIN OUR TEAM */}
                <JoinOurTeamVideo
                    title="บรรยากาศการทำงาน"
                    className={cn(
                        "aspect-4/3 rounded-2xl",
                        "sm:col-span-2 lg:col-span-1",
                    )}
                />

                {/* a third of the column for the stat, two thirds for the picture */}
                <div className="flex flex-col gap-4">
                    <StatTile
                        value="90%"
                        label="ความพึงพอใจของพนักงาน"
                        className="bg-(--color-secondary) text-(--text-invert) lg:min-h-0 lg:flex-none lg:h-[calc(33.333%-0.5rem)]"
                    />
                    <Tile alt="ทีมงาน" className="min-h-40 flex-1 lg:min-h-0 lg:flex-none lg:h-[calc(66.667%-0.5rem)]" />
                </div>

                <div className="flex flex-col gap-4">
                    <Tile alt="การทำงานร่วมกัน" className="min-h-40 flex-1 lg:min-h-0 lg:flex-none lg:h-[calc(66.667%-0.5rem)]" />
                    <StatTile
                        value="50%"
                        label="การเติบโตของทีม"
                        className="bg-(--surface-invert) text-(--text-invert) lg:min-h-0 lg:flex-none lg:h-[calc(33.333%-0.5rem)]"
                    />
                </div>
            </FadeIn>
        </section>
    );
};

export default OurImpactSection;
