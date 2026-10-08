import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PillLabel from "../../_shared/pill-label";
import {
    HEADING_GRADIENT_DARK_CLASSNAME,
    PIP_MOCK_IMAGE,
    SECTION_CONTAINER_CLASSNAME,
} from "../../_shared/styles";

import { ABOUT_MOCK } from "./about-mock";
import TeamSlider from "./components/team-slider";

const MOCK = ABOUT_MOCK.team;
const TRUSTED = ABOUT_MOCK.trusted;

interface TeamSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const TeamSection = ({ data }: TeamSectionProps) => {
    const label = data?.label?.value || MOCK.label;
    const title = data?.title?.value || MOCK.title;
    const description = data?.description?.value || MOCK.description;
    const trustedTitle = data?.trustedTitle?.value || TRUSTED.title;
    const members = MOCK.members.map(({ hasPhoto, ...member }) => ({
        ...member,
        photo: hasPhoto ? PIP_MOCK_IMAGE : undefined,
    }));

    return (
        <section id="our-team" className="w-full overflow-hidden pb-10 pt-20 text-(--text-on-dark) sm:pt-24 lg:pt-36">
            <div className={cn(SECTION_CONTAINER_CLASSNAME, "flex flex-col items-center text-center")}>
                <FadeIn>
                    <PillLabel tone="dark">{label}</PillLabel>
                </FadeIn>
                <FadeIn delay={80}>
                    <h2
                        className={cn(
                            HEADING_GRADIENT_DARK_CLASSNAME,
                            "mt-5 font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem]",
                        )}
                    >
                        {title}
                    </h2>
                </FadeIn>
                <FadeIn delay={140} className="mt-4 text-sm text-(--text-body-on-dark)">
                    {description}
                </FadeIn>
            </div>

            {/* starts on the container's left edge but runs off the right side of the screen */}
            <FadeIn
                delay={200}
                className="mt-10 pl-4 sm:pl-8 lg:mt-12 lg:pl-[max(2rem,calc((100%-120rem)/2+2rem))]"
            >
                <TeamSlider members={members} />
            </FadeIn>

            <div className={cn(SECTION_CONTAINER_CLASSNAME, "mt-24 flex flex-col items-center lg:mt-36")}>
                <FadeIn className="text-base text-(--text-body-on-dark) sm:text-lg">{trustedTitle}</FadeIn>
                <FadeIn delay={100}>
                    <ul className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-x-10 sm:gap-y-4">
                        {TRUSTED.names.map((name) => (
                            <li
                                key={name}
                                className="rounded-md border border-(--border-on-dark) px-4 py-2.5 text-sm text-(--text-body-on-dark) sm:px-5"
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>
        </section>
    );
};

export default TeamSection;
