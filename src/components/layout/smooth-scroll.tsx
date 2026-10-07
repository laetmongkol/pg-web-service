"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { usePathname } from "next/navigation";

import "lenis/dist/lenis.css";

/** Marks the element whose direct page sections become snap points (set in the public layout). */
const SNAP_ROOT_ATTRIBUTE = "data-snap-root";

/**
 * The page's own sections: every `<section>` under the snap root whose nearest section ancestor is
 * the root itself — a section nested inside another one is part of that block, not a stop.
 */
const collectSnapTargets = (root: HTMLElement): HTMLElement[] => {
    const sections = Array.from(root.querySelectorAll<HTMLElement>("section")).filter(
        (section) => section.parentElement?.closest("section") === root,
    );
    const footer = document.querySelector<HTMLElement>("footer");

    return footer ? [...sections, footer] : sections;
};

/**
 * Smooth wheel scrolling plus a "magnet" on every page section. `proximity` only pulls when the
 * scroll comes to rest near a section edge (within `distanceThreshold` of the viewport), so a
 * section taller than the screen can still be read through instead of trapping the visitor. Skipped for reduced motion —
 * native scrolling stays untouched there.
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

        const snap = new Snap(lenis, {
            type: "proximity",
            distanceThreshold: "5%",
            duration: 0.9,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            debounce: 50,
        });

        // Snap points are plain scroll offsets rather than `addElement`, so each can sit a navbar
        // height above its section — the fixed navbar would otherwise cover the section's top. The
        // height comes from `scroll-padding-top: var(--navbar-height)` on <html>, the same offset
        // anchor jumps already use.
        // A section taller than the screen also gets a stop at its bottom so it can settle flush; a
        // shorter one only snaps by its top — a bottom stop there would sit a few pixels from the
        // next section's top and tug the page back and forth between the two.
        const register = () => {
            const navbarHeight = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const points = new Set<number>();

            for (const target of collectSnapTargets(root)) {
                const rect = target.getBoundingClientRect();
                const top = rect.top + window.scrollY;

                points.add(Math.round(Math.max(0, top - navbarHeight)));
                if (rect.height > window.innerHeight - navbarHeight) {
                    points.add(Math.round(Math.min(maxScroll, top + rect.height - window.innerHeight)));
                }
            }

            const removers = Array.from(points, (point) => snap.add(point));
            return () => removers.forEach((remove) => remove());
        };

        let removeTargets = register();

        // Offsets go stale whenever the page height moves — sections streaming in (Suspense, CMS
        // data), images loading, a viewport resize — so recompute when the snap root resizes.
        let pending = 0;
        const reRegister = () => {
            window.clearTimeout(pending);
            pending = window.setTimeout(() => {
                removeTargets();
                removeTargets = register();
            }, 200);
        };
        const observer = new ResizeObserver(reRegister);
        observer.observe(root);
        window.addEventListener("resize", reRegister);

        return () => {
            window.clearTimeout(pending);
            observer.disconnect();
            window.removeEventListener("resize", reRegister);
            removeTargets();
            snap.destroy();
            lenis.destroy();
        };
    }, [pathname]);

    return null;
};

export default SmoothScroll;
