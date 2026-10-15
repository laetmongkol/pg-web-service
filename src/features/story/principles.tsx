import { getTranslations } from "next-intl/server"

import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading } from "./chapter"

type Item = { name: string; sub: string; body: string }

export default async function Principles() {
  const t = await getTranslations("principles")
  const items = t.raw("items") as Item[]

  return (
    <Chapter id="principles" index={3}>
      <div className="rounded-panel bg-ink/92 p-6 md:p-10">
        <SectionLabel tone="dark">{t("label")}</SectionLabel>
        <ChapterHeading id="principles" title={t("title")} tone="dark" />
        <ul className="mt-10 grid gap-3">
          {items.map((item) => (
            <li key={item.name} className="rounded-panel bg-ink-raised p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-ivory">{item.name}</h3>
                <span aria-hidden className="size-2.5 bg-coral" />
              </div>
              <p className="mt-2 text-[15px] font-medium text-coral">{item.sub}</p>
              <p className="mt-3 text-[15px] leading-6 text-stone">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  )
}
