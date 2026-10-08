import { ArrowUpRight } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import WaveLines from "../_shared/wave-lines";
import { HOME_HEADING_GRADIENT_CLASSNAME, HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.portfolio;

/** First row is three cards; the rest sit two-up and fade into the page as a teaser. */
const FIRST_ROW_COUNT = 3;

interface ProjectCardProps {
    name: string;
    description: string;
    imageSizes: string;
    className?: string;
}

const ProjectCard = ({ name, description, imageSizes, className }: ProjectCardProps) => (
    <article
        className={cn(
            "flex h-full flex-col overflow-hidden rounded-[2rem] bg-(--surface-card) text-(--text-on-light) sm:rounded-[2.5rem]",
            className,
        )}
    >
        <FillImage
            src={HOME_MOCK_IMAGE}
            alt={name}
            sizes={imageSizes}
            wrapperClassName="aspect-[323/260] w-full overflow-hidden"
            className="object-cover"
        />
        <div className="px-7 pb-8 pt-2">
            <h3 className="line-clamp-1 text-base">{name}</h3>
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed">{description}</p>
        </div>
    </article>
);

interface PortfolioSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const PortfolioSection = ({ data, language }: PortfolioSectionProps) => {
    const title1 = data?.title1?.value || MOCK.title1;
    const title2 = data?.title2?.value || MOCK.title2;
    const description = data?.description?.value || MOCK.description;
    const cta = data?.cta?.value || MOCK.cta;
    const ctaLink = data?.cta?.linkUrl || MOCK.ctaLink;

    const firstRow = MOCK.projects.slice(0, FIRST_ROW_COUNT);
    const teaserRow = MOCK.projects.slice(FIRST_ROW_COUNT);

    return (
        <section id="portfolio" className="relative isolate w-full overflow-hidden py-16 sm:py-20 lg:py-24">
            <WaveLines />
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <FadeIn>
                    <h2
                        className={cn(
                            HOME_HEADING_GRADIENT_CLASSNAME,
                            "w-fit font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl",
                        )}
                    >
                        {title1} {title2}
                    </h2>
                </FadeIn>
                <FadeIn delay={100} className="mt-5 text-sm leading-relaxed text-(--text-body-on-dark) sm:text-base">
                    {description}
                </FadeIn>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
                    {firstRow.map((project, index) => (
                        <FadeIn key={index} delay={150 + index * 80}>
                            <ProjectCard
                                {...project}
                                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                            />
                        </FadeIn>
                    ))}
                </div>

                {teaserRow.length > 0 ? (
                    <div
                        aria-hidden
                        className={cn(
                            "mt-6 hidden h-80 grid-cols-2 gap-6 overflow-hidden lg:grid",
                            // the row is a teaser — it dissolves into the page under the CTA
                            "[mask-image:linear-gradient(180deg,#000_45%,transparent_100%)]",
                        )}
                    >
                        {teaserRow.map((project, index) => (
                            <ProjectCard key={index} {...project} imageSizes="560px" />
                        ))}
                    </div>
                ) : null}

                <FadeIn delay={200} className="mt-12 flex justify-center lg:-mt-4">
                    <LinkCustom
                        href={`/${language}/${ctaLink}`}
                        className={cn(
                            "inline-flex items-center gap-3 rounded-full border border-(--border-on-dark) px-11 py-4",
                            "text-lg text-(--text-on-dark) hover:bg-(--surface-card) hover:text-(--section-dark)",
                            BUTTON_SCALE_CLASSNAME,
                        )}
                    >
                        {cta}
                        <ArrowUpRight size={22} strokeWidth={2} aria-hidden />
                    </LinkCustom>
                </FadeIn>
            </div>
        </section>
    );
};

export default PortfolioSection;
