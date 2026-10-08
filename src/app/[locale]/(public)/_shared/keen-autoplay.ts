import type { KeenSliderInstance, KeenSliderPlugin } from "keen-slider";

/**
 * keen-slider's loop mis-sizes a track with only a few slides (and leaves nothing to scroll to when
 * every card already fits), so slides are repeated until there are at least this many.
 */
export const MIN_SLIDES_FOR_LOOP = 8;

export const buildLoopSlides = <T,>(slides: T[], min = MIN_SLIDES_FOR_LOOP): T[] => {
    if (!slides.length) return [];
    const repeat = Math.ceil(min / slides.length);
    return Array.from({ length: repeat }, () => slides).flat();
};

/** Advances every `intervalMs`; paused while hovered or dragged so a reader can finish a card. */
export const createAutoplay =
    (intervalMs: number): KeenSliderPlugin =>
    (slider: KeenSliderInstance) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        let stopped = false;

        const clearNextTimeout = () => clearTimeout(timeout);
        const nextTimeout = () => {
            clearTimeout(timeout);
            if (stopped || mouseOver) return;
            timeout = setTimeout(() => {
                if (stopped || !slider.track?.details?.slides?.length) return;
                slider.next();
            }, intervalMs);
        };

        slider.on("created", () => {
            slider.container.addEventListener("mouseenter", () => {
                mouseOver = true;
                clearNextTimeout();
            });
            slider.container.addEventListener("mouseleave", () => {
                mouseOver = false;
                nextTimeout();
            });
            nextTimeout();
        });
        slider.on("destroyed", () => {
            stopped = true;
            clearNextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
    };
