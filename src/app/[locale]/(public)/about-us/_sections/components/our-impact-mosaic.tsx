"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import JoinOurTeamVideo from "@/app/[locale]/(public)/_sections/components/join-our-team-video";
import CountUpNumber from "@/app/component/count-up-number.component";
import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";
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

const Tile = ({ className, alt }: { className?: string; alt: string }) => (
    <FillImage
        src={mockUpImage}
        alt={alt}
        width={1200}
        height={900}
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

const StatPhotoColumn = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
        <StatTile
            value="90%"
            label="ความพึงพอใจของพนักงาน"
            className="bg-(--color-secondary) text-(--text-invert) min-h-0 flex-none h-[calc(33.333%-0.5rem)]"
        />
        <Tile alt="ทีมงาน" className="min-h-0 flex-1 h-[calc(66.667%-0.5rem)]" />
    </div>
);

const PhotoStatColumn = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
        <Tile alt="การทำงานร่วมกัน" className="min-h-0 flex-1 h-[calc(66.667%-0.5rem)]" />
        <StatTile
            value="50%"
            label="การเติบโตของทีม"
            className="bg-(--surface-invert) text-(--text-invert) min-h-0 flex-none h-[calc(33.333%-0.5rem)]"
        />
    </div>
);

const SIDE_COLUMNS = [
    <StatPhotoColumn key="stat-photo" />,
    <PhotoStatColumn key="photo-stat" />,
];

const OurImpactMosaic = () => {
    const mosaicRef = useRef<HTMLDivElement>(null);
    const isLg = useIsLg();
    const [expanded, setExpanded] = useState(false);
    const [cycleIndex, setCycleIndex] = useState(0);
    const [lockedHeight, setLockedHeight] = useState<number | null>(null);

    useEffect(() => {
        if (isLg) return;
        setExpanded(false);
        setCycleIndex(0);
        setLockedHeight(null);
    }, [isLg]);

    useEffect(() => {
        if (!expanded) return;
        const id = setInterval(() => {
            setCycleIndex((index) => (index + 1) % SIDE_COLUMNS.length);
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
                title="บรรยากาศการทำงาน"
                onSurfaceClick={isLg ? toggleExpanded : undefined}
                surfaceClickLabel={expanded ? "ย่อคลิป" : "ขยายคลิป"}
                surfaceExpanded={expanded}
                className={cn(
                    "min-h-0 rounded-2xl",
                    expanded ? "h-full aspect-auto" : "aspect-4/3 sm:col-span-2 lg:col-span-1",
                )}
            />

            {expanded ? (
                <div className="h-full min-h-0 self-stretch">
                    {SIDE_COLUMNS[cycleIndex]}
                </div>
            ) : (
                <>
                    <StatPhotoColumn />
                    <PhotoStatColumn />
                </>
            )}
        </div>
    );
};

export default OurImpactMosaic;
