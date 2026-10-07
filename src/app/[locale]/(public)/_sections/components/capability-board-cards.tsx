import { BookOpen, Check, ChevronDown, LineChart, Megaphone, MoreVertical, Sparkles, UserRound } from "lucide-react";

import { PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";

import FillImage from "@/components/fill-image.component";

import CapabilityBoardSlider from "./capability-board-slider";

/**
 * One picture per photo slot on the board, in the shape a `translate_contents` picture row hands
 * back: the file lives on `mediaStorageKey` and nothing else, with `mediaAltText` and the intrinsic
 * `width` / `height` alongside it. Passing the whole attribute object (rather than a bare URL)
 * means swapping the hardcoded constants for `extractAttributes(data?.<code>)` changes the section
 * only — the cards already take exactly what the CMS returns.
 */
export interface CapabilityBoardMedia {
    /** Tall tile on the left of the PORTFOLIO card. */
    portfolioPrimary?: PictureAttributes;
    /** Small tile above the "+18" chip. */
    portfolioSecondary?: PictureAttributes;
    /** Round avatar on the consultant card. */
    consultantAvatar?: PictureAttributes;
    /** Photo inside the "Define Strategy" step of the timeline. */
    timelineStep?: PictureAttributes;
}

/** Accent hexes belong to the services being charted (Instagram, Facebook, …), not to the theme. */
const ACCENT = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    linkedin: "#0A66C2",
    google: "#F4B400",
    mint: "#A8DBC5",
    amber: "#E3A008",
};

const CARD_CLASSNAME = cn(
    "flex flex-col rounded-2xl bg-(--surface-elevated) p-4",
    "border border-(--border-default) shadow-(--shadow-sm)",
);

const CARD_LABEL_CLASSNAME = "text-[10px] font-medium tracking-wide text-(--text-muted) uppercase";

/**
 * A photo slot. Renders the picture when the row carries a `mediaStorageKey`, and the brand-silver
 * wash while it is empty — an unfilled slot must never collapse the card it sits in.
 */
const BoardPhoto = ({
    picture,
    className,
}: {
    picture?: PictureAttributes;
    className?: string;
}) => {
    const source = picture?.mediaStorageKey;

    if (!source) {
        return <div aria-hidden className={cn("bg-[image:var(--brand-gradient-silver)]", className)} />;
    }

    return (
        <FillImage
            src={source}
            alt={picture?.mediaAltText ?? ""}
            width={picture?.width}
            height={picture?.height}
            sizes="300px"
            draggable={false}
            wrapperClassName={cn("overflow-hidden", className)}
            className="h-full w-full object-cover"
        />
    );
};

const StatBlock = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-(--text-primary)">{value}</span>
        <span className="text-[10px] leading-tight text-(--text-secondary)">{label}</span>
    </div>
);

const SuccessCard = () => (
    <div className={cn(CARD_CLASSNAME, "gap-4")}>
        <div className="flex items-center justify-between gap-2">
            <span className={CARD_LABEL_CLASSNAME}>Success</span>
            <span className="flex items-center gap-1 rounded-full bg-(--surface-page) px-2 py-0.5 text-[10px] text-(--text-secondary)">
                This week
                <ChevronDown className="size-3" />
            </span>
        </div>

        <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-(--text-primary)">48</span>
                <span className="text-[10px] leading-tight text-(--text-secondary)">
                    Completed
                    <br />
                    Projects
                </span>
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-(--text-primary)">16%</span>
                <span className="text-[10px] leading-tight text-(--text-secondary)">
                    Growth
                    <br />
                    Rate
                </span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="flex size-9 items-center justify-center rounded-full bg-(--surface-page) text-(--text-secondary)">
                    <UserRound className="size-4" strokeWidth={1.6} />
                </span>
                <span className="text-[10px] leading-tight text-(--text-secondary)">
                    Top
                    <br />
                    performer
                </span>
            </div>
        </div>
    </div>
);

const INTERESTS = ["Strategic Planning", "Digital Marketing", "Growth Hacking", "Branding"];
const SELECTED_INTEREST = "Growth Hacking";

const InterestsCard = () => (
    <div className={cn(CARD_CLASSNAME, "gap-3")}>
        <span className={CARD_LABEL_CLASSNAME}>Interests</span>
        <p className="text-xs font-medium text-(--text-primary)">
            Which service are you most
            <br />
            interested in?
        </p>

        <ul className="flex flex-col gap-2">
            {INTERESTS.map((interest) => {
                const isSelected = interest === SELECTED_INTEREST;

                return (
                    <li
                        key={interest}
                        className={cn(
                            "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[11px]",
                            isSelected
                                ? "border-(--color-info-300) bg-(--color-info-50) text-(--text-primary)"
                                : "border-(--border-default) text-(--text-secondary)",
                        )}
                    >
                        {interest}
                        {isSelected ? <Check className="size-3.5 text-(--color-info-500)" /> : null}
                    </li>
                );
            })}
        </ul>
    </div>
);

const PortfolioCard = ({ media }: { media: CapabilityBoardMedia }) => (
    <div className={cn(CARD_CLASSNAME, "gap-3")}>
        <div className="flex items-center justify-between gap-2">
            <span className={CARD_LABEL_CLASSNAME}>Portfolio</span>
            <MoreVertical className="size-3.5 text-(--text-muted)" />
        </div>

        <div className="grid grid-cols-2 gap-2">
            <BoardPhoto
                picture={media.portfolioPrimary}
                className="row-span-2 h-full min-h-32 rounded-lg"
            />
            <BoardPhoto picture={media.portfolioSecondary} className="h-48 rounded-lg" />
            <div
                className="flex h-28 items-center justify-center rounded-lg text-sm font-medium text-(--text-primary)"
                style={{ backgroundColor: ACCENT.mint }}
            >
                +18
            </div>
        </div>
    </div>
);

const ReportCard = () => (
    <div className={cn(CARD_CLASSNAME, "flex-row items-center gap-3")}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--surface-page)">
            <BookOpen className="size-4 text-(--text-secondary)" strokeWidth={1.6} />
        </span>
        <div className="flex min-w-0 flex-col">
            <span className="text-xs font-medium text-(--text-primary)">Performance Report</span>
            <span className="truncate text-[10px] text-(--text-muted)">www.consultingpro.com/report</span>
        </div>
    </div>
);

const ArticlesCard = () => (
    <div className={cn(CARD_CLASSNAME, "flex-row items-center gap-3")}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--surface-page)">
            <LineChart className="size-4 text-(--text-secondary)" strokeWidth={1.6} />
        </span>
        <div className="flex min-w-0 flex-col">
            <span className="text-xs font-medium text-(--text-primary)">In-depth Articles 2024</span>
            <span className="text-[10px] text-(--text-muted)">Insights &amp; Trends</span>
        </div>
    </div>
);

const CONSULTANT_ROWS = [
    { label: "Initial Analysis", amount: "$ 214.53" },
    { label: "Online Consultant", amount: "$ 433.23" },
];

const ConsultantCard = ({ media }: { media: CapabilityBoardMedia }) => (
    <div className={cn(CARD_CLASSNAME, "gap-4")}>
        <div className="flex items-center gap-3">
            <BoardPhoto picture={media.consultantAvatar} className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-col">
                <span className="text-sm font-bold text-(--text-primary)">Amara Robinson</span>
                <span className="text-[10px] text-(--text-secondary)">Lead Consultant</span>
            </div>
        </div>

        <div className="flex items-start justify-between gap-2">
            <StatBlock value="41.8k" label="Views" />
            <StatBlock value="12 mins" label="Duration" />
            <StatBlock value="6.0k" label="Clients/yr" />
        </div>

        <div className="flex flex-col gap-2 border-t border-(--border-default) pt-3">
            {CONSULTANT_ROWS.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-[11px] text-(--text-secondary)">
                        <Sparkles className="size-3.5 text-(--color-info-500)" strokeWidth={1.6} />
                        {row.label}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: ACCENT.amber }}>
                        {row.amount}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const VisitorsCard = () => (
    <div className={cn(CARD_CLASSNAME, "gap-3")}>
        <div className="flex items-center justify-between gap-2">
            <span className={CARD_LABEL_CLASSNAME}>Visitors</span>
            <span className="flex items-center gap-1 text-[10px] text-(--text-secondary)">
                Last 30 days
                <ChevronDown className="size-3" />
            </span>
        </div>

        <span className="text-3xl font-bold" style={{ color: ACCENT.amber }}>
            52k
        </span>
        <span className="text-[11px] leading-tight text-(--text-secondary)">
            Successful marketing
            <br />
            campaigns
        </span>

        {/* one gentle rise and dip — enough to read as a trend without pretending to be data */}
        <svg viewBox="0 0 160 48" className="h-12 w-full" fill="none" aria-hidden>
            <path
                d="M2 38C18 38 26 14 44 14s24 20 40 20 26-26 44-26 28 12 30 12"
                stroke={ACCENT.amber}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    </div>
);

const ROI_SOURCES = [
    { name: "Instagram", value: "12.5k", delta: "+14%", color: ACCENT.instagram, share: 46 },
    { name: "Facebook", value: "8.2k", delta: "+7%", color: ACCENT.facebook, share: 30 },
    { name: "LinkedIn", value: "2.1k", delta: "-2%", color: ACCENT.linkedin, share: 13 },
    { name: "Google Ads", value: "1.4k", delta: "+28%", color: ACCENT.google, share: 11 },
];

const RoiSourceCard = () => (
    <div className={cn(CARD_CLASSNAME, "gap-3")}>
        <div className="flex items-center justify-between gap-2">
            <span className={CARD_LABEL_CLASSNAME}>ROI Source</span>
            <span className="flex items-center gap-1 rounded-full bg-(--surface-page) px-2 py-0.5 text-[10px] text-(--text-secondary)">
                All Total
                <ChevronDown className="size-3" />
            </span>
        </div>

        <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full">
            {ROI_SOURCES.map((source) => (
                <span
                    key={source.name}
                    className="h-full rounded-full"
                    style={{ width: `${source.share}%`, backgroundColor: source.color }}
                />
            ))}
        </div>

        <ul className="flex flex-col gap-2">
            {ROI_SOURCES.map((source) => (
                <li key={source.name} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex items-center gap-2 text-(--text-secondary)">
                        <span
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: source.color }}
                        />
                        {source.name}
                    </span>
                    <span className="flex items-center gap-3">
                        <span className="text-(--text-primary)">{source.value}</span>
                        <span
                            className={cn(
                                "w-9 text-end",
                                source.delta.startsWith("-")
                                    ? "text-(--color-danger-500)"
                                    : "text-(--color-success-600)",
                            )}
                        >
                            {source.delta}
                        </span>
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

const TIMELINE = [
    {
        title: "Begin Analysis",
        body: "Everything starts with data. We analyse the market to find growth opportunities…",
        photo: false,
    },
    {
        title: "Define Strategy",
        body: "",
        photo: true,
    },
    {
        title: "Improve and Grow",
        body: "Track results and refine strategies for optimal outcomes…",
        photo: false,
    },
];

const TimelineCard = ({ media }: { media: CapabilityBoardMedia }) => (
    <div className={cn(CARD_CLASSNAME, "gap-3")}>
        <span className={CARD_LABEL_CLASSNAME}>Timeline</span>
        <span className="text-sm font-bold text-(--text-primary)">Past Successes</span>

        <ol className="flex flex-col">
            {TIMELINE.map((step, index) => {
                const isActive = index === 1;
                const isLast = index === TIMELINE.length - 1;

                return (
                    <li key={step.title} className="flex gap-3">
                        {/* dot rail: the connector stops at the last step instead of dangling */}
                        <div className="flex flex-col items-center">
                            <span
                                className="mt-1 size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: isActive ? ACCENT.amber : "var(--border-strong)" }}
                            />
                            {!isLast ? <span className="w-px flex-1 bg-(--border-default)" /> : null}
                        </div>

                        <div className={cn("flex flex-col gap-2", !isLast && "pb-4")}>
                            <span className="text-xs font-medium text-(--text-primary)">{step.title}</span>
                            {step.body ? (
                                <p className="text-[10px] leading-relaxed text-(--text-secondary)">
                                    {step.body}
                                </p>
                            ) : null}
                            {step.photo ? (
                                <BoardPhoto
                                    picture={media.timelineStep}
                                    className="h-16 w-full rounded-lg"
                                />
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    </div>
);

const GOAL_STEPS = [
    { rank: "1st", text: "Targeted strategic planning" },
    { rank: "2nd", text: "Build a strong, memorable brand" },
    { rank: "3rd", text: "Drive growth with data and measurable results" },
];

const GoalCard = () => (
    <div className={cn(CARD_CLASSNAME, "gap-3")}>
        <span className={CARD_LABEL_CLASSNAME}>Goal</span>
        <span className="text-sm font-bold text-(--text-primary)">Our Services</span>
        <p className="text-[10px] text-(--text-secondary)">Elevate your business in 3 key steps</p>

        <ul className="flex flex-col gap-3">
            {GOAL_STEPS.map((step) => (
                <li key={step.rank} className="flex gap-3">
                    <span className="text-[11px] font-medium" style={{ color: ACCENT.amber }}>
                        {step.rank}
                    </span>
                    <span className="text-[10px] leading-relaxed text-(--text-secondary)">{step.text}</span>
                </li>
            ))}
        </ul>
    </div>
);

const SeminarCard = () => (
    <div className={cn(CARD_CLASSNAME, "items-center gap-3 text-center")}>
        <span className="flex size-9 items-center justify-center rounded-lg bg-(--color-info-50)">
            <Megaphone className="size-4 text-(--color-info-500)" strokeWidth={1.6} />
        </span>
        <span className="text-xs font-bold text-(--text-primary)">March Online Seminar</span>
        <p className="text-[10px] leading-relaxed text-(--text-secondary)">
            Join our seminar on business adaptation in the digital age and new strategies.
        </p>
        <span
            className={cn(
                "mt-1 w-full rounded-lg bg-(--text-primary) px-4 py-2",
                "text-[11px] font-medium text-(--text-invert)",
            )}
        >
            Learn More
        </span>
    </div>
);

const COLUMN_CLASSNAME = "keen-slider__slide flex flex-col gap-4";

interface CapabilityBoardCardsProps {
    /** Picture rows for the board's photo slots, as the CMS hands them back. */
    media: CapabilityBoardMedia;
}

/**
 * The five columns of the capability board, one slide each. From `lg` they are staggered the way
 * the design has them — each column starting at a different height is what makes the grid read as
 * a loose collage rather than a table. Below `lg` fewer columns are on screen, where a stagger
 * reads as a gap at the top rather than as depth, so the columns line up instead.
 */
const CapabilityBoardCards = ({ media }: CapabilityBoardCardsProps) => (
    <CapabilityBoardSlider>
        <div className={cn(COLUMN_CLASSNAME, "lg:pt-16")}>
            <SuccessCard />
            <InterestsCard />
        </div>

        <div className={cn(COLUMN_CLASSNAME, "lg:pt-28")}>
            <PortfolioCard media={media} />
            <ReportCard />
        </div>

        <div className={cn(COLUMN_CLASSNAME, "lg:pt-10")}>
            <ArticlesCard />
            <ConsultantCard media={media} />
            <VisitorsCard />
        </div>

        <div className={cn(COLUMN_CLASSNAME, "lg:pt-0")}>
            <RoiSourceCard />
            <TimelineCard media={media} />
        </div>

        <div className={cn(COLUMN_CLASSNAME, "lg:pt-20")}>
            <GoalCard />
            <SeminarCard />
        </div>
    </CapabilityBoardSlider>
);

export default CapabilityBoardCards;
