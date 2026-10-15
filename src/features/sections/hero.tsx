import { ArrowDown, ArrowUpRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { SCENES } from "@/features/tower/scenes"

type Stat = { value: string; label: string }

export default async function Hero() {
  const t = await getTranslations("hero")
  const mock = await getTranslations("mock.hero")
  const stats = mock.raw("stats") as Stat[]

  return (
    <section
      id="top"
      data-scene={SCENES.indexOf("top")}
      aria-labelledby="top-title"
      className="relative flex min-h-svh flex-col justify-end pt-28 pb-12"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-[72px]">
        <div className="max-w-[720px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-coral/40 bg-coral/10 px-3 py-1 font-mono text-[12px] text-coral">
            <span aria-hidden className="size-1.5 rounded-full bg-coral" />
            {t("eyebrow")}
          </p>
          <h1
            id="top-title"
            className="mt-6 text-[46px] leading-[54px] font-semibold tracking-[-0.02em] whitespace-pre-line text-ivory md:text-[76px] md:leading-[84px]"
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-[34rem] text-[18px] leading-[30px] text-mist">{t("lead")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex h-13 items-center gap-3 rounded-full bg-coral px-7 text-[16px] font-semibold text-night-950 transition-colors hover:bg-[#ff8463]"
            >
              {t("cta")}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
            </a>
            <a
              href="#services"
              className="inline-flex h-13 items-center gap-3 rounded-full border border-ivory/25 px-7 text-[16px] font-medium text-ivory transition-colors hover:border-ivory/60"
            >
              {t("cta2")}
            </a>
          </div>
        </div>

        <dl className="glass mt-20 grid max-w-[880px] grid-cols-2 divide-ivory/10 rounded-2xl max-md:[&>*:nth-child(-n+2)]:border-b max-md:[&>*:nth-child(-n+2)]:border-ivory/10 md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-5 py-5 max-md:odd:border-r max-md:odd:border-ivory/10">
              <dt className="text-[13px] leading-5 text-mist">{s.label}</dt>
              <dd className="mt-2 text-[30px] leading-9 font-semibold text-ivory">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 flex items-center gap-2 text-[13px] text-mist motion-reduce:hidden">
          <ArrowDown aria-hidden className="size-4 animate-bounce text-coral" strokeWidth={1.75} />
          {t("scroll")}
        </p>
      </div>
    </section>
  )
}
