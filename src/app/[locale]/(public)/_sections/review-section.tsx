import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import ReviewSlide, { type ReviewItem } from "./components/review-slide";

interface ReviewSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `review*` — the quote itself is the row value. */
interface ReviewAttributes {
    name?: string;
    role?: string;
}

const ReviewSection = ({ data }: ReviewSectionProps) => {
    if (!data) return null;

    const reviews: ReviewItem[] = convertObjectToArrayByPrefix<ReviewAttributes>(data, "review").map((item) => ({
        quote: item.value ?? "",
        name: item.attributes?.name ?? "",
        role: item.attributes?.role ?? "",
    }));

    // passed into the slide so desktop can line it up with the arrows
    const header = (
        <FadeIn className={cn("flex flex-col gap-4",
            "items-center text-center",
            "lg:items-start lg:text-start"
        )}>
            <FadeIn delay={100} className={cn(
                "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold"
            )}>
                {data?.badge?.value}
            </FadeIn>
            <h2 className={cn(
                "font-bold text-(--text-primary)",
                "text-3xl sm:text-4xl leading-tight"
            )}>
                <span className="text-(--color-secondary)">
                    {data?.titleHighlight?.value}
                </span>
                {data?.titleRest?.value}
            </h2>
            <FadeIn delay={200} className={cn(
                "text-(--text-secondary)",
                "text-base sm:text-lg"
            )}>
                {data?.description?.value}
            </FadeIn>
        </FadeIn>
    );

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16"
        )}>
            <ReviewSlide items={reviews} header={header} />
        </section>
    );
};

export default ReviewSection;
