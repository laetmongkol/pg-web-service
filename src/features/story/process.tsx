import { getTranslations } from "next-intl/server"

import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading, Panel } from "./chapter"

type Step = { name: string; body: string }

export default async function Process() {
  const t = await getTranslations("process")
  const steps = t.raw("steps") as Step[]

  return (
    <Chapter id="process" index={4}>
      <Panel>
        <SectionLabel>{t("label")}</SectionLabel>
        <ChapterHeading id="process" title={t("title")} lead={t("lead")} />
        <ol className="mt-10 grid gap-3">
          {steps.map((step, i) => (
            <li key={step.name} className="grid grid-cols-[3rem_1fr] rounded-panel border border-stone bg-paper p-5">
              <span className="font-mono text-[13px] text-rust">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[20px] leading-7 font-semibold text-ink">{step.name}</h3>
                <p className="mt-1 text-[15px] leading-6 text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 border-y border-ink py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[18px] leading-7 font-semibold text-ink">{t("summary")}</p>
          <p className="shrink-0 font-mono text-[11px] text-rust">{t("summaryTag")}</p>
        </div>
      </Panel>
    </Chapter>
  )
}
