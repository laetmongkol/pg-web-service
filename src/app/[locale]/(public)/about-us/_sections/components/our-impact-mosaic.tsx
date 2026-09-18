"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import JoinOurTeamVideo from "@/app/[locale]/(public)/_sections/components/join-our-team-video";
import CountUpNumber from "@/app/component/count-up-number.component";
import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

const CYCLE_MS = 3000;
const LG_MEDIA_QUERY = "(min-width: 1024px)";

function subscribeLg(onChange: () => void) {
    const media = window.matchMedia(LG_MEDIA_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function useIsLg() {
    return useSyncExternalStore(
        subscribeLg,
        () => window.matchMedia(LG_MEDIA_QUERY).matches,
        () => false,
    );
}

export type MosaicPicture = { src: string; alt: string; width?: number; height?: number };
export type MosaicStat = { value: string; label: string };

export interface OurImpactMosaicProps {
    videoTitle?: string;
    expandLabel?: string;
    collapseLabel?: string;
    /** [top-left stat, bottom-right stat] — the two coloured tiles. */
    stats: MosaicStat[];
    /** [team photo, collaboration photo] — the two picture tiles. */
    pictures: MosaicPicture[];
}

const Tile = ({ className, picture }: { className?: string; picture?: MosaicPicture }) => (
    <FillImage
        src={picture?.src ?? ""}
        alt={picture?.alt ?? ""}
        width={picture?.width}
        height={picture?.height}
        sizes="(max-width: 1024px) 100vw, 33vw"
        draggable={false}
        wrapperClassName={cn("overflow-hidden rounded-2xl", className)}
        className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
    />
);

const StatTile = ({
    value,
    label,
    className,
}: {
    value: string;
    label: string;
    className?: string;
}) => (
    <div className={cn(
        "flex flex-col justify-center gap-2 rounded-2xl p-6",
        className,
    )}>
        <CountUpNumber value={value} className="text-3xl font-bold sm:text-4xl" />
        <span className="text-sm">{label}</span>
    </div>
);

const StatPhotoColumn = ({ stat, picture }: { stat?: MosaicStat; picture?: MosaicPicture }) => (
    <div className="flex h-full min-h-0 flex-col gap-4">
        <StatTile
            value={stat?.value ?? ""}
            label={stat?.label ?? ""}
            className="bg-(--color-secondary) text-(--text-invert) min-h-0 flex-none h-[calc(33.333%-0.5rem)]"
        />
        <Tile picture={picture} className="min-h-0 flex-1 h-[calc(66.667%-0.5rem)]" />
    </div>
);

const PhotoStatColumn = ({ stat, picture }: { stat?: MosaicStat; picture?: MosaicPicture }) => (
    <div className="flex h-full min-h-0 flex-col gap-4">
        <Tile picture={picture} className="min-h-0 flex-1 h-[calc(66.667%-0.5rem)]" />
        <StatTile
            value={stat?.value ?? ""}
            label={stat?.label ?? ""}
            className="bg-(--surface-invert) text-(--text-invert) min-h-0 flex-none h-[calc(33.333%-0.5rem)]"
        />
    </div>
);

const OurImpactMosaic = ({ videoTitle, expandLabel, collapseLabel, stats, pictures }: OurImpactMosaicProps) => {
    const mosaicRef = useRef<HTMLDivElement>(null);
    const isLg = useIsLg();
    const [expanded, setExpanded] = useState(false);
    const [cycleIndex, setCycleIndex] = useState(0);
    const [lockedHeight, setLockedHeight] = useState<number | null>(null);

    const sideColumns = [
        <StatPhotoColumn key="stat-photo" stat={stats[0]} picture={pictures[0]} />,
        <PhotoStatColumn key="photo-stat" stat={stats[1]} picture={pictures[1]} />,
    ];

    useEffect(() => {
        if (isLg) return;
        setExpanded(false);
        setCycleIndex(0);
        setLockedHeight(null);
    }, [isLg]);

    useEffect(() => {
        if (!expanded) return;
        const id = setInterval(() => {
            setCycleIndex((index) => (index + 1) % 2);
        }, CYCLE_MS);
        return () => clearInterval(id);
    }, [expanded]);

    const toggleExpanded = () => {
        if (!isLg) return;
        if (!expanded) {
            setLockedHeight(mosaicRef.current?.getBoundingClientRect().height ?? null);
            setExpanded(true);
            return;
        }
        setCycleIndex(0);
        setExpanded(false);
        setLockedHeight(null);
    };

    return (
        <div
            ref={mosaicRef}
            style={lockedHeight ? { height: lockedHeight } : undefined}
            className={cn(
                "grid gap-4",
                expanded
                    ? "min-h-0 grid-cols-[3fr_1fr] items-stretch"
                    : "sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]",
            )}
        >
            <JoinOurTeamVideo
                title={videoTitle}
                onSurfaceClick={isLg ? toggleExpanded : undefined}
                surfaceClickLabel={expanded ? collapseLabel : expandLabel}
                surfaceExpanded={expanded}
                className={cn(
                    "min-h-0 rounded-2xl",
                    expanded ? "h-full aspect-auto" : "aspect-4/3 sm:col-span-2 lg:col-span-1",
                )}
            />

            {expanded ? (
                <div className="h-full min-h-0 self-stretch">
                    {sideColumns[cycleIndex]}
                </div>
            ) : (
                <>
                    <StatPhotoColumn stat={stats[0]} picture={pictures[0]} />
                    <PhotoStatColumn stat={stats[1]} picture={pictures[1]} />
                </>
            )}
        </div>
    );
};

export default OurImpactMosaic;
