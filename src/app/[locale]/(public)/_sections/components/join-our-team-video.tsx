"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import cn from "@/lib/tw-merge";
import FadeIn from "@/app/component/fade-in.components";

interface JoinOurTeamVideoProps {
    className?: string;
    title?: string;
}

const YOUTUBE_ID = "qxOkaU6RVz4";
const EMBED_ORIGIN = "https://www.youtube-nocookie.com";

/**
 * Plays itself and loops forever; the only control is the sound toggle.
 * - `mute=1` is what lets `autoplay=1` actually start — browsers refuse to autoplay audio.
 *   Sound is meant to be on, so the visitor's first gesture anywhere on the page unmutes it;
 *   that is the earliest moment any browser will allow it.
 * - `loop=1` is ignored on its own; YouTube needs `playlist` set to the same id to repeat.
 * - `controls`/`disablekb`/`fs` strip the UI, and `pointer-events-none` on the iframe kills
 *   the clicks that remain (title bar, end-screen cards).
 * - `enablejsapi=1` is what makes the postMessage below work.
 */
const EMBED_PARAMS = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: YOUTUBE_ID,
    controls: "0",
    disablekb: "1",
    fs: "0",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    playsinline: "1",
    enablejsapi: "1",
}).toString();

const JoinOurTeamVideo = ({ className, title = "Join our team" }: JoinOurTeamVideoProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    // the auto-unmute listener runs outside React, so it needs the live value, not a closure
    const mutedRef = useRef(true);

    const setMuted = (muted: boolean) => {
        const player = iframeRef.current?.contentWindow;
        if (!player) return;

        // the IFrame API's own command format — no need to load its script for these two
        player.postMessage(
            JSON.stringify({ event: "command", func: muted ? "mute" : "unMute", args: [] }),
            EMBED_ORIGIN,
        );
        mutedRef.current = muted;
        setIsMuted(muted);
    };

    useEffect(() => {
        const events = ["pointerdown", "keydown", "touchstart"] as const;

        const unmute = () => {
            if (mutedRef.current) setMuted(false);
            events.forEach((event) => window.removeEventListener(event, unmute, true));
        };

        events.forEach((event) => window.addEventListener(event, unmute, true));
        return () => events.forEach((event) => window.removeEventListener(event, unmute, true));
    }, []);

    return (
        <FadeIn direction="left" delay={100} className={cn("relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-black", className)}>
            <iframe
                ref={iframeRef}
                src={`${EMBED_ORIGIN}/embed/${YOUTUBE_ID}?${EMBED_PARAMS}`}
                title={title}
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
                /* h-full + aspect-video makes the 16:9 frame wider than this 4:3 box, so it
                   covers instead of letterboxing; min-* guards the opposite box ratio */
                className="pointer-events-none absolute top-1/2 left-1/2 aspect-video h-full min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            />

            <button
                type="button"
                onClick={() => setMuted(!mutedRef.current)}
                aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
                aria-pressed={!isMuted}
                className={cn(
                    "absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full",
                    "bg-black/50 text-white backdrop-blur-sm",
                    "transition hover:bg-black/70 hover:scale-105",
                )}
            >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
        </FadeIn>
    );
};

export default JoinOurTeamVideo;
