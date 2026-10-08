"use client";

import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";

import type { ReactNode } from "react";

/** Re-measures when the container itself resizes (not only the window), so slide widths never go stale. */
const ResizePlugin: KeenSliderPlugin = (slider) => {
    const observer = new ResizeObserver(() => slider.update());

    slider.on("created", () => observer.observe(slider.container));
    slider.on("destroyed", () => observer.unobserve(slider.container));
};

interface CapabilityBoardSliderProps {
    /** Each child must carry `keen-slider__slide`. */
    children: ReactNode;
}

/**
 * Opens halfway between the track's two ends. The board is symmetric around its middle column, so
 * this centres that column and cuts the outer two by the same amount on each side. It re-centres on
 * every re-measure (the container can be 0 wide at creation while the page loader is up, and a
 * breakpoint swap rebuilds the track from the first slide) until the visitor first drags.
 */
const CenterStartPlugin: KeenSliderPlugin = (slider) => {
    let hasDragged = false;

    const center = () => {
        const details = slider.track.details;
        if (hasDragged || !details) return;
        slider.track.add((details.min + details.max) / 2 - details.position);
    };

    slider.on("created", center);
    slider.on("updated", center);
    slider.on("optionsChanged", center);
    slider.on("dragStarted", () => {
        hasDragged = true;
    });
};

/**
 * Slides stay edge-aligned (default origin, no loop), so the track can only travel from flush-left
 * to flush-right: a drag past either end stretches (rubberband) and springs back instead of opening
 * an empty gap. `free` keeps it where it is let go — `snap` would pull it off the centred start.
 */
const CapabilityBoardSlider = ({ children }: CapabilityBoardSliderProps) => {
    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            mode: "free",
            rubberband: true,
            slides: { perView: 1.2, spacing: 16 },
            breakpoints: {
                "(min-width: 640px)": { slides: { perView: 2.5, spacing: 16 } },
                "(min-width: 1024px)": { slides: { perView: 4, spacing: 16 } },
            },
        },
        [ResizePlugin, CenterStartPlugin],
    );

    return (
        <div ref={sliderRef} className="keen-slider cursor-grab items-start active:cursor-grabbing">
            {children}
        </div>
    );
};

export default CapabilityBoardSlider;
