import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import OurServicesSlide, { type OurServiceSlideItem } from "./components/our-services-slide";

const EYEBROW = "Our Service";
const TITLE = "การบริการของเรา";
const DESCRIPTION = "ครบทุกมิติการตลาดและการเติบโตของธุรกิจในที่เดียว";
const LINK_LABEL = "ดูรายละเอียด";

const SERVICES: Omit<OurServiceSlideItem, "href" | "linkLabel">[] = [
    {
        icon: "consulting",
        title: "Business Consulting",
        description: "ให้คำปรึกษาเชิงกลยุทธ์ วิเคราะห์ธุรกิจ\nและวางแผนการเติบโตที่วัดผลได้จริง",
    },
    {
        icon: "strategy",
        title: "Marketing Strategy",
        description: "วางกลยุทธ์การตลาดที่เข้าถึงกลุ่มเป้าหมาย\nผ่านทุกช่องทางอย่างมีทิศทาง",
    },
    {
        icon: "branding",
        title: "Branding",
        description: "สร้างแบรนด์ให้โดดเด่น มีจุดยืน\nและเป็นที่จดจำในใจลูกค้า",
    },
    {
        icon: "content",
        title: "Content & Creative",
        description: "สร้างสรรค์คอนเทนต์และงานครีเอทีฟ\nที่สื่อสารแบรนด์ได้อย่างเป็นมืออาชีพ",
    },
];

interface OurServicesSectionProps {
    language: string;
}

const OurServicesSection = ({ language }: OurServicesSectionProps) => {
    const services: OurServiceSlideItem[] = SERVICES.map((service) => ({
        ...service,
        href: `/${language}/services`,
        linkLabel: LINK_LABEL,
    }));

    // passed into the slide so desktop can line the heading up with the arrows
    const header = (
        <div className="flex flex-col gap-4">
            <FadeIn>
                <span
                    className={cn(
                        "inline-flex w-fit items-center gap-2 rounded-full",
                        "border border-(--border-default) bg-(--surface-page)",
                        "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                    )}
                >
                    <span className="bg-(--text-primary) size-1.5 shrink-0 rounded-full" />
                    {EYEBROW}
                </span>
            </FadeIn>

            <FadeIn delay={100}>
                <h2
                    className={cn(
                        "font-bold text-(--text-primary)",
                        "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                    )}
                >
                    {TITLE}
                </h2>
            </FadeIn>

            <FadeIn delay={200} className={cn("text-(--text-secondary)", "text-sm md:text-base")}>
                {DESCRIPTION}
            </FadeIn>
        </div>
    );

    return (
        <section
            id="our-services"
            className={cn("w-full bg-(--surface-50) surface-noise", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <OurServicesSlide items={services} header={header} />
            </div>
        </section>
    );
};

export default OurServicesSection;
