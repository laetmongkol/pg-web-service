import { ArrowUpRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import cn from "@/lib/tw-merge"

import Chip from "@/components/ui/chip"
import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading, Panel } from "./chapter"

type Item = { name: string; tag: string; body: string }

export default async function Services() {
  const t = await getTranslations("services")
  const items = t.raw("items") as Item[]

  return (
    <Chapter id="services" index={1} wide>
      <Panel>
        <SectionLabel>{t("label")}</SectionLabel>
        <ChapterHeading id="services" title={t("title")} lead={t("lead")} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => {
            const core = i < 2
            return (
              <li
                key={item.name}
                className={cn(
                  "flex min-h-44 flex-col rounded-panel border p-5",
                  core ? "border-ink bg-ink text-ivory" : "border-stone bg-paper text-ink",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn("font-mono text-[12px]", core ? "text-coral" : "text-rust")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Chip variant={core ? "coral" : "stone"}>{item.tag}</Chip>
                </div>
                <p className="mt-auto pt-6 text-h3 font-semibold">{item.name}</p>
                <div className="mt-1 flex items-end justify-between gap-4">
                  <p className={cn("text-[15px] leading-6", core ? "text-stone" : "text-muted")}>{item.body}</p>
                  <ArrowUpRight aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                </div>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 flex flex-col gap-3 rounded-panel bg-stone p-5 text-[15px] leading-6 text-ink sm:flex-row sm:items-center sm:justify-between">
          <span className="flex gap-4">
            <span aria-hidden className="mt-1 size-4 shrink-0 bg-coral" />
            {t("note")}
          </span>
          <span className="shrink-0 font-mono text-[11px] text-rust">{t("noteTag")}</span>
        </p>
      </Panel>
    </Chapter>
  )
}
