import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import cn from "@/lib/tw-merge"

import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading, Panel } from "./chapter"

type Column = { step: string; name: string; items: string[] }

export default async function Ecosystem() {
  const t = await getTranslations("ecosystem")
  const columns = t.raw("columns") as Column[]

  return (
    <Chapter id="ecosystem" index={5} wide>
      <Panel className="bg-stone">
        <SectionLabel>{t("label")}</SectionLabel>
        <ChapterHeading id="ecosystem" title={t("title")} lead={t("lead")} />
        <div className="mt-10 rounded-panel bg-ink p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] text-ivory">{t("map")}</p>
            <p className="flex items-center gap-2 text-[13px] text-stone">
              <span aria-hidden className="size-2.5 bg-coral" />
              {t("mapNote")}
            </p>
          </div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {columns.map((col, i) => {
              const ai = i === 2
              return (
                <li key={col.name} className={cn("rounded-[12px] p-5", ai ? "bg-coral" : "bg-ivory")}>
                  <p className={cn("font-mono text-[11px]", ai ? "text-ink/70" : "text-rust")}>{col.step}</p>
                  <h3 className="mt-3 flex items-center justify-between text-h3 font-semibold text-ink">
                    {col.name}
                    {i < columns.length - 1 && (
                      <ArrowRight aria-hidden className={cn("size-4", ai ? "text-ink" : "text-coral")} strokeWidth={1.75} />
                    )}
                  </h3>
                  <ul className="mt-4">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "flex items-center gap-3 border-b py-2 text-[14px] text-ink last:border-0",
                          ai ? "border-ink/25" : "border-stone",
                        )}
                      >
                        <span aria-hidden className={cn("size-1.5", ai ? "bg-ink" : "bg-coral")} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
          <p className="mt-5 flex items-center justify-end gap-3 border-t border-ivory/15 pt-4 font-mono text-[11px] text-ivory">
            <span aria-hidden className="size-2.5 bg-coral" />
            {t("loop")}
          </p>
        </div>
      </Panel>
    </Chapter>
  )
}
