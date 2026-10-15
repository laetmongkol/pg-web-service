import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import cn from "@/lib/tw-merge"

import Chip from "@/components/ui/chip"
import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading } from "./chapter"

type Row = { key: string; value: string }

export default async function Capability() {
  const t = await getTranslations("capability")
  const steps = t.raw("broker.steps") as string[]
  const rows = t.raw("ads.rows") as Row[]
  const extensions = t.raw("extensionItems") as string[]

  return (
    <Chapter id="capability" index={2} wide>
      <div className="rounded-panel bg-ink/92 p-6 md:p-10">
        <SectionLabel tone="dark">{t("label")}</SectionLabel>
        <ChapterHeading id="capability" title={t("title")} lead={t("lead")} tone="dark" />

        <div className="mt-10 grid gap-4">
          <article className="rounded-panel bg-ivory p-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-h3 font-semibold text-ink">{t("broker.name")}</h3>
                <p className="mt-1 text-[15px] text-muted">{t("broker.body")}</p>
              </div>
              <Chip variant="coral">{t("broker.tag")}</Chip>
            </header>
            <div className="mt-6 rounded-[12px] bg-ink p-5">
              <div className="flex justify-between font-mono text-[11px] text-stone">
                <span>{t("broker.stream")}</span>
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2 bg-coral" />
                  {t("broker.status")}
                </span>
              </div>
              <svg aria-hidden viewBox="0 0 560 90" className="mt-4 h-20 w-full" preserveAspectRatio="none">
                <path
                  d="M0 75 C 60 75, 80 30, 140 30 S 230 70, 290 62 S 370 15, 420 18 S 500 70, 560 6"
                  fill="none"
                  stroke="#ff6946"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {steps.map((s, i) => (
                  <li
                    key={s}
                    className={cn(
                      "flex items-center justify-between rounded-control px-3 py-2.5 font-mono text-[11px] text-ink",
                      i === 2 ? "bg-coral" : "bg-ivory",
                    )}
                  >
                    {s}
                    <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-5 text-[15px] leading-6 text-muted">{t("broker.detail")}</p>
          </article>

          <article className="rounded-panel bg-ivory p-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-h3 font-semibold text-ink">{t("ads.name")}</h3>
                <p className="mt-1 text-[15px] text-muted">{t("ads.body")}</p>
              </div>
              <Chip variant="coral">{t("ads.tag")}</Chip>
            </header>
            <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="flex flex-col justify-between rounded-[12px] bg-coral p-5 text-ink">
                <Chip className="self-start bg-ivory">{t("ads.creativeTag")}</Chip>
                <p className="mt-6 text-[22px] leading-8 font-semibold">{t("ads.creative")}</p>
              </div>
              <dl className="rounded-[12px] bg-ink px-5 py-2">
                {rows.map((r, i) => (
                  <div
                    key={r.key}
                    className="grid grid-cols-[2rem_6rem_1fr] items-center border-b border-ivory/15 py-3 last:border-0"
                  >
                    <span className="font-mono text-[11px] text-coral">{String(i + 1).padStart(2, "0")}</span>
                    <dt className="font-mono text-[11px] text-ivory">{r.key}</dt>
                    <dd className="text-[14px] text-stone">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-5 text-[15px] leading-6 text-muted">{t("ads.detail")}</p>
          </article>
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-panel border border-ivory/20 p-5 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-coral">{t("extensions")}</p>
          <ol className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[18px] font-medium text-ivory">
            {extensions.map((e, i) => (
              <li key={e} className="flex items-center gap-4">
                {i > 0 && <ArrowRight aria-hidden className="size-4 text-coral" strokeWidth={1.75} />}
                {e}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Chapter>
  )
}
