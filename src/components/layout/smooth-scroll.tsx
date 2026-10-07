"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

import "lenis/dist/lenis.css";

/** Marks the element whose direct page sections become snap points (set in the public layout). */
const SNAP_ROOT_ATTRIBUTE = "data-snap-root";

/** How close (fraction of the viewport height) a resting scroll must be to a stop to get pulled in. */
const SNAP_DISTANCE = 0.25;
/** No scroll movement for this long (ms) counts as "came to rest". */
const SETTLE_DELAY = 50;
const SNAP_DURATION = 0.9;
/** Share of the navbar height a section's top stops below the screen top: 1 = just under the navbar,
 * 0 = flush with the screen top (the navbar then sits over the section's top padding). */
const NAVBAR_OFFSET_RATIO = 1;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The page's own sections with an `id` — the ones the page names (and links to with `#id`). A
 * section nested inside another one is part of that block, not a stop.
 */
const collectSnapTargets = (root: HTMLElement): HTMLElement[] =>
    Array.from(root.querySelectorAll<HTMLElement>("section[id]")).filter(
        (section) => section.parentElement?.closest("section") === root,
    );

/**
 * Stops as scroll offsets: only each section's top, landing `NAVBAR_OFFSET_RATIO` of the navbar
 * height below the screen top so the fixed navbar doesn't sit on it — the height comes from
 * `scroll-padding-top: var(--navbar-height)` on <html>, the same value anchor jumps use. No stop at
 * a section's bottom: that would pull the page somewhere mid-content rather than to a section.
 *
 * Read fresh on every use (a handful of rects): section positions keep moving while sections stream
 * in and images load, and a cached list would land a few pixels off.
 */
const getStops = (root: HTMLElement) => {
    const navbarHeight = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const offset = navbarHeight * NAVBAR_OFFSET_RATIO;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    return collectSnapTargets(root).map((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        return Math.round(Math.min(maxScroll, Math.max(0, top - offset)));
    });
};

/**
 * Smooth wheel scrolling plus a "magnet" on every page section: once the scroll comes to rest within
 * `SNAP_DISTANCE` of a section's top, it eases onto it. Only a resting scroll is judged — a section
 * taller than the screen can still be read through instead of trapping the visitor. Skipped for reduced
 * motion — native scrolling stays untouched there.
 *
 * Not `lenis/snap`: it decides on a debounce after the last wheel event, measuring where the eased
 * scroll is *at that moment*. With lerp smoothing the page is still gliding then, far from where it
 * will stop, so a real wheel scroll almost never got pulled in.
 */
const SmoothScroll = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const root = document.querySelector<HTMLElement>(`[${SNAP_ROOT_ATTRIBUTE}]`);
        if (!root) return;

        const lenis = new Lenis({
            autoRaf: true,
            lerp: 0.1,
            anchors: true,
            // dropdowns, the mobile menu and other inner scrollers keep their own wheel
            allowNestedScroll: true,
        });

        // Lenis emits `scroll` every frame while the page moves — wheel glide, touch momentum,
        // keyboard, its own `scrollTo` — so a quiet gap means the scroll has really stopped. Our own
        // snap lands exactly on the stop, so the gap after it finds nothing to correct.
        let settle = 0;
        const snapWhenSettled = () => {
            window.clearTimeout(settle);
            settle = window.setTimeout(() => {
                const scroll = lenis.scroll;
                let nearest: number | undefined;
                for (const stop of getStops(root)) {
                    if (nearest === undefined || Math.abs(stop - scroll) < Math.abs(nearest - scroll)) {
                        nearest = stop;
                    }
                }
                if (nearest === undefined) return;

                const distance = Math.abs(nearest - scroll);
                if (distance > 1 && distance <= window.innerHeight * SNAP_DISTANCE) {
                    lenis.scrollTo(nearest, { duration: SNAP_DURATION, easing: easeOutCubic });
                }
            }, SETTLE_DELAY);
        };
        lenis.on("scroll", snapWhenSettled);

        return () => {
            window.clearTimeout(settle);
            lenis.destroy();
        };
    }, [pathname]);

    return null;
};

export default SmoothScroll;
