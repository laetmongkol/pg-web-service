import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import ReviewSlide, { type ReviewItem } from "./components/review-slide";

/** attributes on `review*` — the quote itself is the row value. */
interface ReviewAttributes {
    name?: string;
    role?: string;
    meta?: string;
    accent?: string;
}

/** Used when a row carries no accent, so the dot never disappears against the card. */
const DEFAULT_ACCENT = "#2F80ED";

interface ReviewSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const ReviewSection = ({ data }: ReviewSectionProps) => {
    if (!data) return null;

    const reviews: ReviewItem[] = convertObjectToArrayByPrefix<ReviewAttributes>(data, "review").map(
        (review) => ({
            quote: review.value ?? "",
            name: review.attributes?.name ?? "",
            role: review.attributes?.role ?? "",
            meta: review.attributes?.meta ?? "",
            accent: review.attributes?.accent ?? DEFAULT_ACCENT,
        }),
    );

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
                    {data?.badge?.value}
                </span>
            </FadeIn>

            <FadeIn delay={100}>
                <h2
                    className={cn(
                        "font-bold text-(--text-primary)",
                        "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                    )}
                >
                    {data?.title?.value}
                </h2>
            </FadeIn>

            <FadeIn delay={200} className={cn("text-(--text-secondary)", "text-sm md:text-base")}>
                {data?.description?.value}
            </FadeIn>
        </div>
    );

    return (
        <section
            id="review"
            className={cn("w-full bg-(--surface-default)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <ReviewSlide items={reviews} header={header} />
            </div>
        </section>
    );
};

export default ReviewSection;
