import { CalendarCheck, Eye, Layers, LifeBuoy, ShieldCheck, Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"

import Section, { Eyebrow, Lead, Title } from "./section"

type Reason = { title: string; body: string }

const ICONS = [Eye, Layers, Sparkles, ShieldCheck, CalendarCheck, LifeBuoy]

export default async function Why() {
  const t = await getTranslations("why")
  const mock = await getTranslations("mock.why")
  const reasons = [...(t.raw("reasons") as Reason[]), ...(mock.raw("reasons") as Reason[])]

  return (
    <Section id="why" wide>
      <Eyebrow>{t("label")}</Eyebrow>
      <Title id="why">{t("title")}</Title>
      <Lead>{t("lead")}</Lead>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => {
          const Icon = ICONS[i] ?? Eye
          return (
            <li key={r.title} className="glass rounded-2xl p-5">
              <Icon aria-hidden className="size-5 text-coral" strokeWidth={1.75} />
              <p className="mt-4 text-[18px] leading-7 font-semibold text-ivory">{r.title}</p>
              <p className="mt-2 text-[14.5px] leading-[23px] text-mist">{r.body}</p>
            </li>
          )
        })}
      </ul>

      <figure className="glass glass-accent mt-14 max-w-[720px] rounded-2xl p-7 text-ivory md:p-9">
        <blockquote className="text-[22px] leading-[34px] font-semibold md:text-[26px] md:leading-[38px]">
          “{mock("quote")}”
        </blockquote>
        <figcaption className="mt-4 text-[14px] font-medium text-gold">{mock("quoteBy")}</figcaption>
      </figure>
    </Section>
  )
}
