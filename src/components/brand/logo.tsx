import Image from "next/image"

interface LogoProps {
  tone?: "ink" | "ivory"
  width?: number
  className?: string
  priority?: boolean
}

// Supplied lockup artwork (design system: never redraw or recolour parts). 1031×152 source.
export default function Logo({ tone = "ink", width = 132, className, priority }: LogoProps) {
  return (
    <Image
      src={`/brand/pg-solution-logo-${tone}.png`}
      alt="PG Solution"
      width={width}
      height={Math.round((width * 152) / 1031)}
      className={className}
      priority={priority}
    />
  )
}
