import cn from "@/lib/tw-merge"

interface ChipProps {
  children: React.ReactNode
  variant?: "coral" | "stone"
  className?: string
}

/** Compact category badge (design system: badge). Coral chips always carry Ink text. */
export default function Chip({ children, variant = "stone", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-full px-3 font-mono text-[11px] font-medium tracking-[0.04em] text-ink",
        variant === "coral" ? "bg-coral" : "bg-stone",
        className,
      )}
    >
      {children}
    </span>
  )
}
