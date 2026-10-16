import Link from "next/link"
import type { CSSProperties } from "react"

import { type Company, pick } from "@/companies/companies"
import { assetPath } from "@/lib/asset-path"
import cn from "@/lib/tw-merge"

import { displayFont } from "./fonts"
import { About, Contact, Hero, Partners, Pillars, Services, Showcase, Testimonials, type SectionCtx } from "./sections"
import CompanyStage from "./stage/company-stage"
import { SECTION_IDS } from "./stage/poses"
import { uiFor } from "./ui"

/** The brand as CSS variables; everything below the wrapper reads only these. */
function themeVars(company: Company, family: string): CSSProperties {
  const th = company.theme
  return {
    "--c-bg": th.bg,
    "--c-surface": th.surface,
    "--c-ink": th.ink,
    "--c-muted": th.muted,
    "--c-primary": th.primary,
    "--c-on-primary": th.onPrimary,
    "--c-accent": th.accent,
    "--c-veil": `color-mix(in oklab, ${th.bg} 72%, transparent)`,
    "--c-display": family,
    colorScheme: th.mode,
  } as CSSProperties
}

/**
 * A company landing page: the building in 3D behind, the company's own story in front, one
 * section per camera stop. Server-rendered; only the stage (3D + HUD) runs on the client.
 */
export default function CompanyPage({ company, locale }: { company: Company; locale: string }) {
  const ui = uiFor(locale)
  const t = (l: Parameters<typeof pick>[0]) => pick(l, locale)
  const ctx: SectionCtx = { t, locale, ui }
  const c = company.content
  const font = displayFont(company.theme.display)
  const other = locale === "en" ? "th" : "en"
  const name = t(company.name)

  return (
    <div className={cn(font.className, "min-h-svh bg-transparent text-(--c-ink)")} style={themeVars(company, font.family)}>
      <header className="fixed inset-x-0 top-0 z-30 px-3 pt-3 md:px-6 md:pt-5">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-lg focus:bg-(--c-primary) focus:px-4 focus:py-2 focus:text-(--c-on-primary)"
        >
          {ui.skip}
        </a>
        <nav className="cglass mx-auto flex h-14 max-w-[1320px] items-center gap-5 rounded-full pr-2 pl-5 md:h-16 md:pl-7">
          <a href="#top" className="mr-auto font-display text-[15px] font-semibold tracking-[0.04em] text-(--c-ink) md:text-[17px]">
            {company.mark}
          </a>
          <ul className="hidden items-center gap-7 lg:flex">
            {(["about", "services", "showcase", "contact"] as const).map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="text-[15px] text-(--c-muted) transition-colors hover:text-(--c-ink)">
                  {ui.nav[id]}
                </a>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/`} className="hidden text-[14px] text-(--c-muted) hover:text-(--c-ink) sm:inline">
            {ui.allDesigns}
          </Link>
          {/* Full page load: the locale owns <html lang>, and static hosting has no RSC payload to swap. */}
          <a
            href={assetPath(`/${other}/${company.slug}/`)}
            hrefLang={other}
            aria-label={ui.language}
            className="text-[13px] font-semibold text-(--c-ink) underline-offset-4 hover:underline"
          >
            {ui.languageShort}
          </a>
          <a
            href="#contact"
            className="inline-flex h-10 items-center rounded-full bg-(--c-primary) px-5 text-[14px] font-semibold text-(--c-on-primary) md:h-12"
          >
            {ui.nav.contact}
          </a>
        </nav>
      </header>

      <CompanyStage
        slug={company.slug}
        mark={company.mark}
        mood={company.mood}
        primary={company.theme.primary}
        loader={ui.loader}
        timeline={{ label: ui.timeline, stops: SECTION_IDS.map((id) => ({ id, name: ui.stops[id] })) }}
      />

      <main id="main" className="relative overflow-x-clip">
        <Hero c={c.hero} ctx={ctx} name={name} />
        <Partners c={c.partners} ctx={ctx} />
        <About c={c.about} ctx={ctx} />
        <Pillars c={c.pillars} ctx={ctx} />
        <Services c={c.services} ctx={ctx} />
        <Showcase c={c.showcase} ctx={ctx} />
        <Testimonials c={c.testimonials} ctx={ctx} />
        <Contact cta={c.cta} contact={c.contact} ctx={ctx} />
      </main>

      <footer className="relative border-t border-(--c-ink)/12 bg-(--c-bg)">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:px-12 lg:px-16">
          <div className="max-w-[60ch]">
            <p className="font-display text-[18px] font-semibold text-(--c-ink)">{name}</p>
            <p className="mt-3 text-[14px] leading-[1.7] text-(--c-muted)">{t(c.footer.blurb)}</p>
            {c.footer.note && <p className="mt-4 text-[12px] leading-[1.6] text-(--c-muted)/80">{t(c.footer.note)}</p>}
          </div>
          <div className="flex flex-col gap-2 text-[14px] md:items-end">
            {company.slug !== "pip-group" && (
              <Link href={`/${locale}/pip-group/`} className="text-(--c-ink) underline-offset-4 hover:underline">
                {ui.group}
              </Link>
            )}
            <p className="text-(--c-muted)">
              © 2026 {name}. {ui.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
