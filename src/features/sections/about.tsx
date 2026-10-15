import { Compass, Hammer, TrendingUp } from "lucide-react"
import { getTranslations } from "next-intl/server"

import Section, { Eyebrow, Lead, Title } from "./section"

type Principle = { name: string; sub: string; body: string }
type Fact = { value: string; label: string }

const ICONS = [Compass, Hammer, TrendingUp]

export default async function About() {
  const t = await getTranslations("about")
  const principles = (await getTranslations("principles")).raw("items") as Principle[]
  const mock = await getTranslations("mock.about")
  const facts = mock.raw("facts") as Fact[]

  return (
    <Section id="about">
      <Eyebrow>{t("label")}</Eyebrow>
      <Title id="about">{t("title")}</Title>
      <Lead>{t("lead")}</Lead>
      <p className="mt-4 max-w-[58ch] text-[17px] leading-[29px] text-mist">{mock("story")}</p>

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ivory/10 pt-8 sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col-reverse">
            <dt className="mt-1 text-[13px] leading-5 text-mist">{f.label}</dt>
            <dd className="text-[32px] leading-10 font-semibold text-gold">{f.value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-14 text-[15px] font-medium text-ivory/70">{t("principlesTitle")}</h3>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {principles.map((p, i) => {
          const Icon = ICONS[i] ?? Compass
          return (
            <li key={p.name} className="glass rounded-2xl p-5">
              <Icon aria-hidden className="size-5 text-coral" strokeWidth={1.75} />
              <p className="mt-4 text-[18px] font-semibold text-ivory">{p.name}</p>
              <p className="mt-1 text-[14px] font-medium text-gold">{p.sub}</p>
              <p className="mt-3 text-[14px] leading-[22px] text-mist">{p.body}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
