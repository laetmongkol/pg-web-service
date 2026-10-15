import { getTranslations } from "next-intl/server"

import Section, { Eyebrow, Lead, Title } from "./section"

type Item = { tag: string; name: string; body: string }
type Metric = { value: string; label: string }

export default async function UseCases() {
  const t = await getTranslations("useCases")
  const rail = await getTranslations("rail")
  const items = t.raw("items") as Item[]
  const metrics = (await getTranslations("mock.cases")).raw("metrics") as Metric[]

  return (
    <Section id="use-cases" wide>
      <Eyebrow>{rail("use-cases")}</Eyebrow>
      <Title id="use-cases">{t("title")}</Title>
      <Lead>{t("lead")}</Lead>

      <ul className="mt-12 grid gap-3 md:grid-cols-2">
        {items.map((it, i) => (
          <li key={it.tag} className="glass grid grid-cols-[1fr_auto] gap-6 rounded-2xl p-6">
            <div>
              <p className="font-mono text-[11px] text-coral">{it.tag}</p>
              <p className="mt-3 text-[20px] leading-7 font-semibold text-ivory">{it.name}</p>
              <p className="mt-2 text-[14px] leading-[22px] text-mist">{it.body}</p>
            </div>
            <div className="w-28 border-l border-ivory/10 pl-5 text-right">
              <p className="text-[30px] leading-9 font-semibold text-gold">{metrics[i]?.value}</p>
              <p className="mt-1 text-[12px] leading-[18px] text-mist">{metrics[i]?.label}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] text-mist/70">{t("metricsLabel")}</p>
    </Section>
  )
}
