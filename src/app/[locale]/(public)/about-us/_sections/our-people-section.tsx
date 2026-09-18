import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PeopleSlide, { type PersonItem } from "./components/people-slide";

interface OurPeopleSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `person*` — the name is the row value. */
interface PersonAttributes extends PictureAttributes {
    role?: string;
}

const OurPeopleSection = ({ data }: OurPeopleSectionProps) => {
    if (!data) return null;

    const people: PersonItem[] = convertObjectToArrayByPrefix<PersonAttributes>(data, "person").map((item) => ({
        image: item.attributes?.mediaStorageKey ?? "",
        name: item.value ?? "",
        role: item.attributes?.role ?? "",
    }));

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16 gap-10",
        )}>
            <FadeIn className="flex flex-col gap-4 items-center">
                <FadeIn delay={100} className={cn(
                    "text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-full text-center font-bold",
                    "text-xs tracking-wide",
                )}>
                    {data?.badge?.value}
                </FadeIn>
                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl sm:text-4xl text-center leading-tight",
                )}>
                    {data?.title1?.value}
                    <span className="text-(--color-secondary)">{data?.title2?.value}</span>
                </h2>
                <FadeIn delay={200} className={cn(
                    "text-(--text-secondary)",
                    "text-base sm:text-lg text-center max-w-3xl",
                )}>
                    {data?.subTitle?.value}
                </FadeIn>
            </FadeIn>

            <FadeIn delay={300}>
                <PeopleSlide items={people} />
            </FadeIn>
        </section>
    );
};

export default OurPeopleSection;
