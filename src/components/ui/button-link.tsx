import { ArrowUpRight } from "lucide-react"

import cn from "@/lib/tw-merge"

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "ink"
  size?: "md" | "sm"
}

/** Primary action link. Coral buttons use Ink text; one primary action per region. */
export default function ButtonLink({ variant = "primary", size = "md", className, children, ...rest }: ButtonLinkProps) {
  return (
    <a
      {...rest}
      className={cn(
        "inline-flex items-center gap-3 rounded-control font-semibold transition-colors",
        size === "md" ? "h-13 px-6 text-[17px]" : "h-11 px-4 text-[15px]",
        variant === "primary" ? "bg-coral text-ink hover:bg-[#ff7d5e]" : "bg-ink text-ivory hover:bg-ink-raised",
        className,
      )}
    >
      {children}
      <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
    </a>
  )
}
