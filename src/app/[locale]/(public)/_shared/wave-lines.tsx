import cn from "@/lib/tw-merge";

/** Faint flowing curves behind the dark sections (services, portfolio). Decorative only. */
const WaveLines = ({ className }: { className?: string }) => (
    <svg
        aria-hidden
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        className={cn("pointer-events-none absolute inset-0 -z-10 size-full", className)}
        fill="none"
        stroke="var(--text-on-dark)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
    >
        <path d="M-40 180 C 320 60, 640 360, 1000 220 S 1440 120, 1500 260" strokeOpacity={0.08} />
        <path d="M-40 260 C 360 140, 700 460, 1040 300 S 1440 220, 1500 360" strokeOpacity={0.06} />
        <path d="M-40 520 C 300 420, 760 700, 1100 520 S 1440 460, 1500 600" strokeOpacity={0.05} />
    </svg>
);

export default WaveLines;
