import { getTranslations } from "next-intl/server"

import cn from "@/lib/tw-merge"

import Section, { Eyebrow, Lead, Title } from "./section"

type Column = { step: string; name: string; items: string[] }

export default async function Ecosystem() {
  const t = await getTranslations("ecosystem")
  const rail = await getTranslations("rail")
  const columns = t.raw("columns") as Column[]

  return (
    <Section id="ecosystem" wide>
      <Eyebrow>{rail("ecosystem")}</Eyebrow>
      <Title id="ecosystem">{t("title")}</Title>
      <Lead>{t("lead")}</Lead>

      {/* A flow, so it reads left to right with a connecting rail; AI is where the system decides. */}
      <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
        <span aria-hidden className="absolute top-12 right-10 left-10 hidden h-px bg-gradient-to-r from-ivory/10 via-coral to-ivory/10 md:block" />
        {columns.map((col, i) => {
          const ai = i === 2
          return (
            <li key={col.name} className={cn("glass rounded-2xl p-5", ai && "glass-accent")}>
              <span
                className={cn(
                  "relative z-10 grid size-14 place-items-center rounded-full border font-mono text-[13px]",
                  ai ? "border-coral bg-coral text-night-950" : "border-ivory/25 bg-ivory/10 text-ivory",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-5 font-mono text-[11px] text-mist">{col.step.replace(/^\d+ \/ /, "")}</p>
              <p className={cn("mt-1 text-[20px] font-semibold", ai ? "text-coral" : "text-ivory")}>{col.name}</p>
              <ul className="mt-3 space-y-1.5">
                {col.items.map((item) => (
                  <li key={item} className="text-[14px] leading-[22px] text-mist">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>
      <p className="mt-10 font-mono text-[12px] text-gold">{t("loop")}</p>
    </Section>
  )
}
