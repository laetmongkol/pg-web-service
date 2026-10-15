import { getTranslations } from "next-intl/server"

import Section, { Eyebrow, Lead, Title } from "./section"

type Step = { name: string; body: string }

export default async function Process() {
  const t = await getTranslations("process")
  const rail = await getTranslations("rail")
  const steps = t.raw("steps") as Step[]

  return (
    <Section id="process" wide>
      <Eyebrow>{rail("process")}</Eyebrow>
      <Title id="process">{t("title")}</Title>
      <Lead>{t("lead")}</Lead>

      <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.name} className="glass rounded-2xl p-5">
            <p className="font-mono text-[28px] leading-none text-coral">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-5 text-[18px] leading-7 font-semibold text-ivory">{s.name}</p>
            <p className="mt-2 text-[14px] leading-[22px] text-mist">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[16px] font-medium text-ivory">{t("summary")}</p>
        <p className="font-mono text-[12px] text-gold">{t("summaryTag")}</p>
      </div>
    </Section>
  )
}
