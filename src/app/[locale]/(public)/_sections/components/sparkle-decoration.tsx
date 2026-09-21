import cn from "@/lib/tw-merge";

/** Position + size of one four-point star, as Tailwind utilities. */
export type SparkleSpec = {
    className: string;
    size: number;
};

interface SparkleDecorationProps {
    sparkles: SparkleSpec[];
    className?: string;
}

/**
 * The four-point stars scattered behind the hero. A concave-sided diamond, not a plus: each arm
 * curves back to the centre, which is what gives it the soft "sparkle" silhouette.
 */
const SparkleDecoration = ({ sparkles, className }: SparkleDecorationProps) => (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        {sparkles.map((sparkle) => (
            <svg
                key={sparkle.className}
                viewBox="0 0 24 24"
                width={sparkle.size}
                height={sparkle.size}
                className={cn("absolute text-(--color-secondary-400)", sparkle.className)}
                fill="currentColor"
            >
                <path d="M12 0c.6 5.7 5.7 10.8 12 12-6.3 1.2-11.4 6.3-12 12-.6-5.7-5.7-10.8-12-12C6.3 10.8 11.4 5.7 12 0Z" />
            </svg>
        ))}
    </div>
);

export default SparkleDecoration;
