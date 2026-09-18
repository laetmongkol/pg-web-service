import cn from "@/lib/tw-merge";

interface SkeletonCustomProps {
    /** Tailwind sizing/shape utilities, e.g. "h-8 w-48 rounded-lg". */
    className?: string;
}

/**
 * Shimmer placeholder. Colors come from theme tokens only (`--surface-muted`),
 * so it follows dark/light automatically. Purely decorative — hidden from a11y tree.
 */
const SkeletonCustom = ({ className }: SkeletonCustomProps) => (
    <span className={cn("block animate-pulse rounded-md bg-(--surface-muted)", className)} aria-hidden />
);

export default SkeletonCustom;
