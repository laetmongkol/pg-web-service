import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import PillLabel from "../../_shared/pill-label";
import { HEADING_GRADIENT_DARK_CLASSNAME, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import TeamSlider, { TeamMember } from "./components/team-slider";

const MEMBER_KEYS = ["member1", "member2", "member3", "member4", "member5", "member6", "member7", "member8"] as const;
const TRUSTED_KEYS = ["trusted1", "trusted2", "trusted3", "trusted4", "trusted5", "trusted6", "trusted7", "trusted8"] as const;

/** member1..8 — value is the name, attribute1 the role, attribute2 the initials shown when there is no photo. */
function getMembers(data: Record<string, TranslateContentResponseDto>): TeamMember[] {
    return MEMBER_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        const pictureAttributes = extractAttributes<PictureAttributes>(item);
        return [{
            key,
            name: item.value,
            role: item.attribute1 ?? "",
            initials: item.attribute2 ?? "",
            photo: pictureAttributes?.mediaStorageKey || undefined,
        }];
    });
}

/** trusted1..8 — business names under "trusted by". */
function getTrustedNames(data: Record<string, TranslateContentResponseDto>): { key: string; name: string }[] {
    return TRUSTED_KEYS.flatMap((key) => {
        const name = data?.[key]?.value;
        return name ? [{ key, name }] : [];
    });
}

interface TeamSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const TeamSection = ({ data }: TeamSectionProps) => {
    if (!data) return null;
    const members = getMembers(data);
    const trustedNames = getTrustedNames(data);

    return (
        <section id="our-team" className="w-full overflow-hidden pt-8 pb-16 text-(--text-on-dark) lg:pb-10 lg:pt-36">
            <div className={cn(SECTION_CONTAINER_CLASSNAME, "flex flex-col items-center text-center")}>
                <FadeIn>
                    <PillLabel tone="dark">{data?.label?.value}</PillLabel>
                </FadeIn>
                <FadeIn delay={80}>
                    <h2
                        className={cn(
                            HEADING_GRADIENT_DARK_CLASSNAME,
                            "mt-5 font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem]",
                        )}
                    >
                        {data?.title?.value}
                    </h2>
                </FadeIn>
                <FadeIn delay={140} className="mt-4 text-sm text-(--text-body-on-dark)">
                    {data?.description?.value}
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
                <FadeIn className="text-base text-(--text-body-on-dark) sm:text-lg">{data?.trustedTitle?.value}</FadeIn>
                <FadeIn delay={100}>
                    <ul className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-x-10 sm:gap-y-4">
                        {trustedNames.map(({ key, name }) => (
                            <li
                                key={key}
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
