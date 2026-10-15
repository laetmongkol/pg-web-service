import { getTranslations } from "next-intl/server"

import ButtonLink from "@/components/ui/button-link"
import SectionLabel from "@/components/ui/section-label"

type Pillar = { title: string; body: string }

export default async function Hero() {
  const t = await getTranslations("hero")
  const pillars = t.raw("pillars") as Pillar[]

  return (
    <section aria-labelledby="top-title" className="relative">
      {/* Phones put the tower directly behind the headline; darken it for legibility. */}
      <div aria-hidden className="absolute inset-0 bg-ink/65 lg:hidden" />
      <div
        id="top"
        data-chapter-body={0}
        className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-between px-4 pt-32 pb-10 md:px-[72px]"
      >
        <div className="max-w-[640px]">
          <SectionLabel tone="dark" className="text-coral">
            {t("eyebrow")}
          </SectionLabel>
          <h1 id="top-title" className="mt-6 text-display font-semibold whitespace-pre-line text-ivory">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-[34rem] text-body text-stone">{t("lead")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href="#contact">{t("cta")}</ButtonLink>
            <p className="font-mono text-[12px] leading-5 whitespace-pre-line text-stone">{t("note")}</p>
          </div>
        </div>

        <div className="mt-16">
          <p className="font-mono text-[12px] text-stone">{t("flow")}</p>
          <p className="mt-1 text-[15px] text-ivory">{t("flowCaption")}</p>
          <ol className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-panel bg-stone/60 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <li key={p.title} className="bg-ivory p-5 md:p-6">
                <p className="font-mono text-[12px] text-rust">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-[19px] leading-7 font-semibold text-ink">{p.title}</p>
                <p className="mt-2 text-[14px] leading-6 text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-center gap-3 font-mono text-[12px] text-stone motion-reduce:hidden">
            <span aria-hidden className="h-px w-10 bg-coral" />
            {t("scroll")}
          </p>
        </div>
      </div>
    </section>
  )
}
