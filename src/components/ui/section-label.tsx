import cn from "@/lib/tw-merge"

interface SectionLabelProps {
  children: React.ReactNode
  tone?: "light" | "dark"
  /** Ink square for coral surfaces, where a coral square would disappear. */
  square?: "coral" | "ink"
  className?: string
}

/** `01 / SERVICES` chapter marker — coral square + mono label (design system: label.*). */
export default function SectionLabel({ children, tone = "light", square = "coral", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[13px] leading-5 font-medium tracking-[0.04em]",
        tone === "light" ? "text-rust" : "text-ivory",
        className,
      )}
    >
      <span aria-hidden className={cn("size-2.5 shrink-0", square === "coral" ? "bg-coral" : "bg-ink")} />
      {children}
    </p>
  )
}
