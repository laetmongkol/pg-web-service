import { getLocale, getTranslations } from "next-intl/server"

import { assetPath } from "@/lib/asset-path"

import Logo from "@/components/brand/logo"
import ButtonLink from "@/components/ui/button-link"

import { LANGUAGE } from "@/shared/constants/common.constants"

/** Product identity left, sections centre-right, one coral action (design system: navigation.*). */
export default async function Navbar() {
  const t = await getTranslations("nav")
  const locale = await getLocale()
  const other = locale === LANGUAGE.TH ? LANGUAGE.EN : LANGUAGE.TH

  const links = [
    { href: "#services", label: t("services") },
    { href: "#capability", label: t("capability") },
    { href: "#process", label: t("process") },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-stone bg-ivory">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        {t("skip")}
      </a>
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 md:h-20 md:px-[72px]">
        <a href="#top" className="mr-auto shrink-0">
          <Logo width={120} priority />
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[15px] text-ink hover:text-rust">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Full page load: the locale owns <html lang>, and static hosting has no RSC payload to swap. */}
        <a
          href={assetPath(`/${other}/`)}
          hrefLang={other}
          aria-label={t("language")}
          className="font-mono text-[12px] text-ink underline-offset-4 hover:underline"
        >
          {t("languageShort")}
        </a>
        <ButtonLink href="#contact" size="sm" className="hidden sm:inline-flex">
          {t("cta")}
        </ButtonLink>
      </nav>
    </header>
  )
}
