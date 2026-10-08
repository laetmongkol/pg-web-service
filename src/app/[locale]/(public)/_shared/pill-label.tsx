import cn from "@/lib/tw-merge";

interface PillLabelProps {
    children: React.ReactNode;
    /** `light` on the pale panels, `dark` on the navy sections. */
    tone?: "light" | "dark";
    className?: string;
}

/** Small rounded kicker above a section heading (about / services / contact pages). */
const PillLabel = ({ children, tone = "light", className }: PillLabelProps) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.08em]",
            tone === "light"
                ? "border-(--border-on-light) bg-(--surface-card) text-(--text-on-light)"
                : "border-(--border-on-dark) bg-(--glass-on-dark) text-(--text-body-on-dark)",
            className,
        )}
    >
        {children}
    </span>
);

export default PillLabel;
