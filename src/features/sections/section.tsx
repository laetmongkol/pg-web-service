import cn from "@/lib/tw-merge"

import { SCENES, type SceneId } from "@/features/tower/scenes"

interface SectionProps {
  id: SceneId
  children: React.ReactNode
  /** wide sections (grids) take more of the screen; text sections leave the tower visible */
  wide?: boolean
  className?: string
}

/**
 * One page section over the 3D tower. `data-scene` tells the scroll director which camera pose
 * belongs to it.
 */
export default function Section({ id, children, wide, className }: SectionProps) {
  return (
    <section
      id={id}
      data-scene={SCENES.indexOf(id)}
      aria-labelledby={`${id}-title`}
      className={cn("relative flex min-h-svh items-center py-28 md:py-32", className)}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-[72px]">
        <div className={wide ? "lg:max-w-[68%]" : "lg:max-w-[50%]"}>{children}</div>
      </div>
    </section>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-[14px] font-medium text-coral", className)}>
      <span aria-hidden className="h-px w-8 bg-coral" />
      {children}
    </p>
  )
}

export function Title({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <h2
      id={`${id}-title`}
      className={cn(
        "mt-5 text-[34px] leading-[44px] font-semibold tracking-[-0.015em] whitespace-pre-line text-ivory md:text-[46px] md:leading-[56px]",
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mt-6 max-w-[58ch] text-[17px] leading-[29px] text-mist", className)}>{children}</p>
}
