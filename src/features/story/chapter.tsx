import cn from "@/lib/tw-merge"

interface ChapterProps {
  id: string
  index: number
  children: React.ReactNode
  /** extra classes for the content column */
  className?: string
  wide?: boolean
}

/**
 * One floor of the tower. The empty spacer above the body is scroll distance the camera uses to
 * spiral down to this chamber; the body is what the camera holds on while it is read.
 */
export default function Chapter({ id, index, children, className, wide }: ChapterProps) {
  return (
    <section aria-labelledby={`${id}-title`} className="relative">
      {index > 0 && <div aria-hidden className="h-[115vh] motion-reduce:h-16" />}
      <div id={id} data-chapter-body={index} className="mx-auto w-full max-w-[1440px] scroll-mt-20 px-4 md:px-[72px]">
        <div className={cn(wide ? "lg:max-w-[64%]" : "lg:max-w-[54%]", className)}>{children}</div>
      </div>
    </section>
  )
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-panel bg-ivory p-6 md:p-10", className)}>{children}</div>
}

export function ChapterHeading({
  id,
  title,
  lead,
  tone = "light",
}: {
  id: string
  title: string
  lead?: string
  tone?: "light" | "dark"
}) {
  return (
    <>
      <h2
        id={`${id}-title`}
        className={cn(
          "mt-5 text-h1 font-semibold tracking-[-0.01em] whitespace-pre-line text-balance",
          tone === "light" ? "text-ink" : "text-ivory",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-5 max-w-[60ch] text-body", tone === "light" ? "text-muted" : "text-stone")}>{lead}</p>
      )}
    </>
  )
}
