import { ArrowRight } from "lucide-react";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

type CompanyCard = {
    number: string;
    category: string;
    name: string;
    description: string;
    tags: string[];
    href: string;
};

const COMPANIES: CompanyCard[] = [
    {
        number: "01",
        category: "INVESTMENT & DIGITAL",
        name: "PIP EVOLUTION",
        description: "ธุรกิจด้านการลงทุน และพัฒนาธุรกิจดิจิทัล มุ่งสร้างโอกาสใหม่ในอนาคตที่มีศักยภาพ",
        tags: ["Investment", "Digital Business", "Venture"],
        href: "#",
    },
    {
        number: "02",
        category: "DIGITAL MARKETING AGENCY",
        name: "SRIWILAI ENTERPRISE",
        description: "ธุรกิจด้านการวางแผนและการตลาดออนไลน์ ครบวงจร สำหรับธุรกิจยุคดิจิทัล",
        tags: ["Marketing", "Consulting", "Digital Solutions"],
        href: "#",
    },
    {
        number: "03",
        category: "EDUCATION & UPSKILLING",
        name: "7DAYS ACADEMY",
        description: "ธุรกิจด้านการศึกษา และพัฒนาศักยภาพ บุคคลและองค์กร",
        tags: ["Education", "Training", "Personal Development"],
        href: "#",
    },
    {
        number: "04",
        category: "TECH & DIGITAL SOLUTIONS",
        name: "DMS INFINITE",
        description: "ธุรกิจด้านเทคโนโลยีและโซลูชันดิจิทัล เพื่อเพิ่มประสิทธิภาพการดำเนินงาน",
        tags: ["Technology", "Innovation", "Business Solution"],
        href: "#",
    },
    {
        number: "05",
        category: "FINANCE & MEDIA",
        name: "SABAIDEE FINX",
        description: "ธุรกิจด้านการเงินและคอนเทนต์ เพื่อเสริมสร้างความรู้ทางการเงิน",
        tags: ["Finance", "Content", "Community"],
        href: "#",
    },
    {
        number: "06",
        category: "ENTERPRISE IT ARCHITECTURE",
        name: "PG SOLUTION",
        description: "ธุรกิจด้านระบบไอทีและโซลูชันองค์กร เพื่อรองรับการเติบโตของธุรกิจ",
        tags: ["IT Solution", "System Integration", "Enterprise"],
        href: "#",
    },
];

const OurCompanySection = () => {
    return (
        <section className="w-full bg-(--surface-page)">
            <div
                className={cn(
                    "flex flex-col items-center",
                    "max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
                    "py-16 gap-10",
                )}
            >
                <FadeIn className="flex flex-col items-center gap-4 text-center">
                    <span
                        className={cn(
                            "text-(--color-secondary) border border-(--color-secondary)",
                            "px-4 py-1 rounded-full text-center font-bold",
                            "text-xs tracking-wide",
                        )}
                    >
                        {"OUR COMPANY"}
                    </span>
                    <h2
                        className={cn(
                            "font-bold leading-tight",
                            "text-xl sm:text-3xl",
                        )}
                    >
                        <span className="text-(--color-secondary)">{"ธุรกิจในเครือ "}</span>
                        <span className="text-(--text-primary) whitespace-nowrap">{"PIP Group Holding"}</span>
                    </h2>
                    <p
                        className={cn(
                            "text-(--text-secondary) text-xs sm:text-base",
                            "max-w-3xl",
                        )}
                    >
                        {"เราดำเนินธุรกิจในหลากหลายอุตสาหกรรม ครอบคลุมตั้งแต่เทคโนโลยี การศึกษา การตลาด ไปจนถึงโลจิสติกส์ขององค์กร เพื่อสร้างคุณค่าให้กับลูกค้าและสังคม"}
                    </p>
                </FadeIn>

                <div className="flex w-full flex-col gap-6">
                    {COMPANIES.map((company, index) => (
                        <FadeIn key={company.number}>
                            <article
                                key={company.number}
                                className={cn(
                                    "flex flex-col overflow-hidden rounded-3xl bg-white",
                                    "p-3 lg:p-0",
                                    "lg:flex-row-reverse lg:items-stretch",
                                    index % 2 === 1 && "lg:flex-row",
                                )}
                            >
                                <div className="w-full overflow-hidden lg:w-1/2">
                                    <FillImage
                                        src={mockUpImage}
                                        alt={company.name}
                                        width={1200}
                                        height={800}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        wrapperClassName="h-full"
                                        className={cn(
                                            "h-full w-full object-cover",
                                            "aspect-[2/1] rounded-2xl",
                                            "lg:aspect-auto lg:rounded-none",
                                            BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                                        )}
                                    />
                                </div>

                                <div
                                    className={cn(
                                        "flex flex-1 flex-col justify-center gap-5",
                                        "pt-5 lg:p-10",
                                    )}
                                >
                                    <span className="hidden items-center gap-2 text-xs tracking-wide lg:flex">
                                        <span className="font-medium text-(--color-secondary)">
                                            {company.number}
                                        </span>
                                        <span className="size-1.5 rounded-full bg-(--color-secondary)" />
                                        <span className="font-medium tracking-widest text-(--text-secondary) opacity-75">
                                            {company.category}
                                        </span>
                                    </span>
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-lg font-extrabold text-(--text-primary) sm:text-2xl">
                                            {company.name}
                                        </h3>
                                        <p className="text-xs text-(--text-secondary) sm:text-base">
                                            {company.description}
                                        </p>
                                    </div>
                                    <div className="hidden flex-wrap gap-2 lg:flex">
                                        {company.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={cn(
                                                    "rounded-full border border-(--border-default)",
                                                    "bg-(--surface-page) px-3 py-1",
                                                    "text-xs text-(--text-secondary)",
                                                )}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <LinkCustom
                                        href={company.href}
                                        className="hidden w-fit lg:block"
                                    >
                                        <span
                                            className={cn(
                                                "flex items-center gap-2",
                                                "text-sm font-medium text-(--color-secondary)",
                                                "hover:opacity-80 transition-opacity",
                                            )}
                                        >
                                            {"ดูรายละเอียด"}
                                            <ArrowRight className="size-4" strokeWidth={2} />
                                        </span>
                                    </LinkCustom>
                                </div>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurCompanySection;
