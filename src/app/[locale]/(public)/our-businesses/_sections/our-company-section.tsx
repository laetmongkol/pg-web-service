import { ArrowRight } from "lucide-react";

import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

interface OurCompanySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** attributes on `company*` — the company name is the row value, its page is link_url. */
interface CompanyAttributes extends PictureAttributes {
    number?: string;
    category?: string;
    description?: string;
    tags?: string[];
}

const OurCompanySection = ({ data }: OurCompanySectionProps) => {
    if (!data) return null;

    const companies = convertObjectToArrayByPrefix<CompanyAttributes>(data, "company");

    return (
        <section className="w-full bg-(--surface-page)">
            <div
                className={cn(
                    "flex flex-col items-center",
                    "max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
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
                        {data?.badge?.value}
                    </span>
                    <h2
                        className={cn(
                            "font-bold leading-tight",
                            "text-xl sm:text-3xl",
                        )}
                    >
                        <span className="text-(--color-secondary)">{data?.title1?.value}</span>
                        <span className="text-(--text-primary) whitespace-nowrap">{data?.title2?.value}</span>
                    </h2>
                    <p
                        className={cn(
                            "text-(--text-secondary) text-xs sm:text-base",
                            "max-w-3xl",
                        )}
                    >
                        {data?.description?.value}
                    </p>
                </FadeIn>

                <div className="flex w-full flex-col gap-6">
                    {companies.map((company, index) => (
                        <FadeIn key={company.key}>
                            <article
                                className={cn(
                                    "flex flex-col overflow-hidden rounded-3xl bg-white",
                                    "p-3 lg:p-0",
                                    "lg:flex-row-reverse lg:items-stretch",
                                    index % 2 === 1 && "lg:flex-row",
                                )}
                            >
                                <div className="w-full overflow-hidden lg:w-1/2">
                                    <FillImage
                                        src={company.attributes?.mediaStorageKey ?? ""}
                                        alt={company.attributes?.mediaAltText ?? company.value ?? ""}
                                        width={company.attributes?.width}
                                        height={company.attributes?.height}
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
                                            {company.attributes?.number}
                                        </span>
                                        <span className="size-1.5 rounded-full bg-(--color-secondary)" />
                                        <span className="font-medium tracking-widest text-(--text-secondary) opacity-75">
                                            {company.attributes?.category}
                                        </span>
                                    </span>
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-lg font-extrabold text-(--text-primary) sm:text-2xl">
                                            {company.value}
                                        </h3>
                                        <p className="text-xs text-(--text-secondary) sm:text-base">
                                            {company.attributes?.description}
                                        </p>
                                    </div>
                                    <div className="hidden flex-wrap gap-2 lg:flex">
                                        {(company.attributes?.tags ?? []).map((tag) => (
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
                                        href={company.linkUrl ?? "#"}
                                        className="hidden w-fit lg:block"
                                    >
                                        <span
                                            className={cn(
                                                "flex items-center gap-2",
                                                "text-sm font-medium text-(--color-secondary)",
                                                "hover:opacity-80 transition-opacity",
                                            )}
                                        >
                                            {data?.detailLabel?.value}
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
