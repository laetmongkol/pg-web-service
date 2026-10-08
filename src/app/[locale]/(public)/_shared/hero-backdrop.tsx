import cn from "@/lib/tw-merge";

// Ring radii in the 1000-unit SVG viewBox; outer rings fade out.
const HERO_RING_RADII = [120, 210, 300, 390];

interface HeroBackdropProps {
    children: React.ReactNode;
    id?: string;
    /** Extra decoration drawn above the glow but below the content (e.g. the home watermark). */
    decoration?: React.ReactNode;
    /** Classes for the rounded card — use to override its height on small screens. */
    cardClassName?: string;
}

/**
 * The rounded dark-blue hero card shared by every public page: bottom horizon glow with white
 * corners, a dark bowl carving it into an arc, and concentric rings around the headline.
 * Desktop is fixed at 16:8 (capped at 1080px tall); below lg the card sizes to its content.
 */
const HeroBackdrop = ({ children, id = "hero", decoration, cardClassName }: HeroBackdropProps) => (
    <section id={id} className="w-full bg-(--section-dark) p-2 sm:p-3 lg:p-4">
        <div
            className={cn(
                "relative isolate flex w-full flex-col overflow-hidden",
                "lg:aspect-[16/8] lg:max-h-[1080px]",
                "rounded-[1.75rem] sm:rounded-[2.25rem]",
                "bg-(--section-dark)",
                cardClassName,
            )}
        >
            {/* Horizon glow — primary blue rising from the bottom */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[image:var(--glow-horizon)]"
            />

            {/* Corner glows — white in the bottom-left and bottom-right corners */}
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0",
                    "bg-[image:var(--glow-corners)]",
                )}
            />

            {/* Dark bowl — reaches almost to the bottom centre, hugging the side edges */}
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute left-1/2 top-[-40%] h-[134%] w-[122%] -translate-x-1/2",
                    "bg-[radial-gradient(closest-side,var(--section-dark)_80%,transparent_100%)]",
                    "blur-xl",
                )}
            />

            {/* Concentric rings, centred on the headline */}
            <svg
                aria-hidden
                viewBox="0 0 1000 1000"
                className="pointer-events-none absolute left-1/2 top-[44%] h-[150%] min-h-[48rem] -translate-x-1/2 -translate-y-1/2"
                fill="none"
                stroke="var(--text-on-dark)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
            >
                {HERO_RING_RADII.map((r, i) => (
                    <circle key={r} cx={500} cy={500} r={r} strokeOpacity={0.14 - i * 0.025} />
                ))}
            </svg>

            {decoration}

            <div className="relative z-10 flex w-full flex-1 flex-col">{children}</div>
        </div>
    </section>
);

export default HeroBackdrop;
