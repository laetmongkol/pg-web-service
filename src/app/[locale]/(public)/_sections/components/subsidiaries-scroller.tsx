"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import cn from "@/lib/tw-merge";

import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import FadeIn from "@/app/component/fade-in.components";

export type SubsidiaryItem = {
    image: string;
    name: string;
    thaiName: string;
    description: string;
    href: string;
};

interface SubsidiariesScrollerProps {
    items: SubsidiaryItem[];
    /** Section heading — pinned alongside the track on desktop, so it stays readable while scrolling. */
    header: ReactNode;
}

/** TODO: point at the real subsidiaries page once it exists. */
const MORE_HREF = "https://www.google.com";

const SIDE_PADDING = "px-6 sm:px-12 md:px-16";

const MoreLink = ({ className }: { className?: string }) => (
    <LinkCustom
        href={MORE_HREF}
        target="_blank"
        className={cn("group text-(--color-secondary) hover:underline", className)}
    >
        <span className="flex items-center gap-3 text-xl font-medium whitespace-nowrap">
            {"ดูข้อมูลบริษัทในเครือเพิ่มเติม"}
            <ArrowUpRight className="h-9 w-9 shrink-0 rounded-full border border-(--color-secondary) p-1 transition-transform duration-300 group-hover:scale-105" />
        </span>
    </LinkCustom>
);

/** Fires once, the first time the card is actually on screen — the track's transform counts. */
const useInView = (threshold = 0.35) => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setInView(true);
                observer.disconnect();
            },
            { threshold },
        );
        observer.observe(node);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
};

/** Each line waits a little longer than the one above it, so the block rises in order. */
const revealClass = (inView: boolean) =>
    cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
    );

const revealDelay = (delay: number) => ({ transitionDelay: `${delay}ms` });

/**
 * Same rise, but driven by hover on lg+ instead of by scrolling into view. `isOpen` is the
 * touch path: a landscape iPad is wide enough for `lg` yet has no hover at all, so a tap has
 * to be able to open the card too.
 */
const hoverRevealClass = (isOpen: boolean) =>
    cn(
        "transition-all duration-500 ease-out motion-reduce:transition-none",
        "lg:translate-y-2 lg:opacity-0",
        "lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
        "lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100",
        isOpen && "lg:translate-y-0 lg:opacity-100",
    );

const SubsidiaryCard = ({ item, className }: { item: SubsidiaryItem; className?: string }) => {
    const { ref, inView } = useInView();
    const [isOpen, setIsOpen] = useState(false);

    // mouse users already get this from hover; only touch/pen need the tap
    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") return;
        if ((event.target as HTMLElement).closest("a")) return;
        setIsOpen((current) => !current);
    };

    return (
        <div
            ref={ref}
            onPointerUp={onPointerUp}
            className={cn("group relative shrink-0 overflow-hidden rounded-3xl", className)}
        >
            <FillImage
                src={item.image}
                alt={item.name}
                width={1000}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 480px"
                draggable={false}
                wrapperClassName="h-full w-full"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <FadeIn className="absolute bottom-0 flex w-full flex-col items-start justify-start gap-3 rounded-b-3xl bg-gradient-to-t from-black/70 to-transparent p-6 backdrop-blur-sm">
                <h3
                    style={revealDelay(0)}
                    className={cn(
                        revealClass(inView),
                        "font-bold text-(--text-invert)",
                        "text-2xl sm:text-3xl text-start",
                    )}
                >
                    {item.name}
                </h3>
                <p
                    style={revealDelay(120)}
                    className={cn(
                        revealClass(inView),
                        "text-(--text-invert)",
                        "text-base sm:text-lg text-start",
                    )}
                >
                    {item.thaiName}
                </p>
                {/* desktop keeps this collapsed until hover so six open cards don't fight for
                    attention; below lg it is always open (there is no hover to wait for) */}
                <div className={cn(
                    "grid w-full grid-rows-[1fr] transition-[grid-template-rows] duration-500 motion-reduce:transition-none",
                    "lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]",
                    isOpen && "lg:grid-rows-[1fr]",
                )}>
                    <FadeIn delay={100} className="flex flex-col items-start gap-4 overflow-hidden">
                        {/* desktop only — the mobile stack stays short */}
                        <p
                            style={revealDelay(80)}
                            className={cn(
                                hoverRevealClass(isOpen),
                                "hidden lg:block pt-1 text-base text-start text-(--text-invert)/80",
                            )}
                        >
                            {item.description}
                        </p>
                        <LinkCustom
                            href={item.href}
                            style={revealDelay(200)}
                            className={cn(
                                hoverRevealClass(isOpen),
                                "flex items-center justify-center",
                                "bg-(--text-invert)/10 hover:bg-(--text-invert)/20",
                                "border border-(--text-invert) rounded-full px-8 py-3",
                            )}
                        >
                            <span className="text-xl font-medium text-(--text-invert) flex items-center gap-2">
                                {"ดูข้อมูลบริษัท"}
                                <ArrowUpRight className="size-6 inline-block w-6 h-6" />
                            </span>
                        </LinkCustom>
                    </FadeIn>
                </div>
            </FadeIn>
        </div>
    );
};

const SubsidiariesScroller = ({ items, header }: SubsidiariesScrollerProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    /** Horizontal overflow in px — also how much extra page height the section claims. */
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const sticky = stickyRef.current;
        const track = trackRef.current;
        if (!wrapper || !sticky || !track) return;

        let frame = 0;

        const overflowOf = () =>
            // offsetHeight is 0 below lg, where the whole wrapper is display:none
            sticky.offsetHeight === 0 ? 0 : Math.max(0, track.scrollWidth - sticky.clientWidth);

        const update = () => {
            frame = 0;
            const overflow = overflowOf();
            if (overflow <= 0) {
                track.style.transform = "";
                return;
            }
            const scrollable = wrapper.offsetHeight - sticky.offsetHeight;
            if (scrollable <= 0) return;

            const progress = Math.min(Math.max(-wrapper.getBoundingClientRect().top / scrollable, 0), 1);
            track.style.transform = `translate3d(${-progress * overflow}px, 0, 0)`;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        const measure = () => {
            setDistance(overflowOf());
            onScroll();
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(track);
        observer.observe(sticky);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", measure);
        };
    }, [items.length]);

    return (
        <>
            {/* mobile-first: plain stack */}
            <div className="flex flex-col gap-8 lg:hidden">
                {header}
                {items.map((item) => (
                    <SubsidiaryCard key={item.name} item={item} className="aspect-square md:aspect-4/3 w-full" />
                ))}
                {items.length > 0 ? <MoreLink className="self-center" /> : null}
            </div>

            {/* desktop: the page scroll drives the track sideways while the viewport is pinned */}
            <div
                ref={wrapperRef}
                className="relative hidden lg:block"
                style={distance > 0 ? { height: `calc(100vh + ${distance}px)` } : undefined}
            >
                <div
                    ref={stickyRef}
                    className="sticky top-0 -mx-6 flex h-screen flex-col gap-6 overflow-hidden py-10 sm:-mx-12 md:-mx-16"
                >
                    {/* pinned with the cards so the heading stays on screen for the whole scroll */}
                    <div className={SIDE_PADDING}>{header}</div>

                    <div
                        ref={trackRef}
                        className={cn("flex min-h-0 w-max flex-1 gap-6 will-change-transform", SIDE_PADDING)}
                    >
                        {items.map((item) => (
                            <SubsidiaryCard key={item.name} item={item} className="aspect-3/4 h-full w-auto" />
                        ))}
                        {/* rides at the end of the track, so it scrolls in after the last card */}
                        <div className="flex shrink-0 items-center pr-10 pl-4">
                            <MoreLink />
                        </div>
                    </div>

                    <FadeIn delay={items.length * 100} className={cn("h-0.5 overflow-hidden rounded-full", "mx-6 sm:mx-12 md:mx-16")}>
                        <div
                            ref={progressRef}
                            className="h-full origin-left scale-x-0"
                        />
                    </FadeIn>
                </div>
            </div>
        </>
    );
};

export default SubsidiariesScroller;
