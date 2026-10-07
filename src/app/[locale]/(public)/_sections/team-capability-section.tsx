import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

import CapabilityBoardCards, { type CapabilityBoardMedia } from "./components/capability-board-cards";

interface TeamCapabilitySectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const TeamCapabilitySection = ({ data }: TeamCapabilitySectionProps) => {
    if (!data) return null;

    // Picture rows for the board's photo slots. The cards take the whole attribute object, so the
    // file keeps living on `mediaStorageKey` and nothing here needs to know the URL shape.
    const media: CapabilityBoardMedia = {
        portfolioPrimary: extractAttributes<PictureAttributes>(data?.portfolioImg1),
        portfolioSecondary: extractAttributes<PictureAttributes>(data?.portfolioImg2),
        consultantAvatar: extractAttributes<PictureAttributes>(data?.consultantImg),
        timelineStep: extractAttributes<PictureAttributes>(data?.timelineImg),
    };

    return (
        <section
            id="team-capability"
            className={cn("w-full overflow-hidden bg-(--surface-default) surface-noise", "py-16 sm:py-20 lg:py-28")}
        >
            <div>
                <div className={cn("mx-auto flex max-w-7xl flex-col", "px-4 sm:px-8")}>
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex w-fit items-center gap-2 rounded-full",
                                "border border-(--border-default)",
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
                                "mt-6 font-bold text-balance text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {data?.titleLead?.value}
                            <span className="text-(--color-secondary-800)">
                                {data?.titleHighlight1?.value}
                            </span>
                            {data?.titleMid?.value}
                            <span className="text-(--color-secondary-800)">
                                {data?.titleHighlight2?.value}
                            </span>
                        </h2>
                    </FadeIn>

                    <FadeIn
                        delay={200}
                        className={cn(
                            "mt-6 max-w-3xl whitespace-pre-line text-(--text-secondary)",
                            "text-sm leading-loose md:text-base",
                        )}
                    >
                        {data?.description?.value}
                    </FadeIn>
                </div>
            </div>

            {/* inside the same max-w-7xl frame as the copy: the frame clips the edge slides to halves */}
            <FadeIn delay={300} className={cn("mx-auto mt-10 max-w-7xl", "px-4 sm:px-8")}>
                <CapabilityBoardCards media={media} />
            </FadeIn>
        </section>
    );
};

export default TeamCapabilitySection;
