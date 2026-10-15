import { getTranslations } from "next-intl/server"

import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading, Panel } from "./chapter"

type Item = { tag: string; name: string; body: string }

export default async function UseCases() {
  const t = await getTranslations("useCases")
  const items = t.raw("items") as Item[]

  return (
    <Chapter id="use-cases" index={6} wide>
      <Panel>
        <SectionLabel>{t("label")}</SectionLabel>
        <ChapterHeading id="use-cases" title={t("title")} lead={t("lead")} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.tag} className="flex flex-col rounded-panel border border-stone bg-paper p-6">
              <p className="font-mono text-[11px] text-rust">{item.tag}</p>
              <h3 className="mt-6 text-[22px] leading-8 font-semibold text-ink">{item.name}</h3>
              <p className="mt-3 text-[15px] leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </Chapter>
  )
}
