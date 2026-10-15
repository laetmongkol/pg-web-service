import { BarChart3, Bot, Globe, LayoutTemplate, Megaphone, ShoppingBag, Users, Workflow } from "lucide-react"
import { getTranslations } from "next-intl/server"

import cn from "@/lib/tw-merge"

import Section, { Eyebrow, Lead, Title } from "./section"

type Item = { name: string; tag: string; body: string }

const ICONS = [BarChart3, Megaphone, Bot, Workflow, Users, ShoppingBag, LayoutTemplate, Globe]

export default async function Services() {
  const t = await getTranslations("services")
  const rail = await getTranslations("rail")
  const items = t.raw("items") as Item[]

  return (
    <Section id="services" wide>
      <Eyebrow>{rail("services")}</Eyebrow>
      <Title id="services">{t("title")}</Title>
      <Lead>{t("lead")}</Lead>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((it, i) => {
          const Icon = ICONS[i] ?? Globe
          const core = i < 2
          return (
            <li
              key={it.name}
              className={cn(
                "glass group flex flex-col rounded-2xl p-5",
                core && "glass-accent",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-xl",
                    core ? "bg-coral text-night-950" : "bg-ivory/10 text-ivory ring-1 ring-ivory/15",
                  )}
                >
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <span className="font-mono text-[11px] text-mist">{it.tag}</span>
              </div>
              <p className="mt-6 text-[19px] leading-7 font-semibold text-ivory">{it.name}</p>
              <p className="mt-2 text-[14px] leading-[22px] text-mist">{it.body}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 max-w-[70ch] border-l-2 border-gold pl-4 text-[15px] leading-6 text-ivory/80">{t("note")}</p>
    </Section>
  )
}
