import { getTranslations } from "next-intl/server"

import cn from "@/lib/tw-merge"
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service"

import { LANGUAGE } from "@/shared/constants/common.constants"

import DesktopNavbar from "./navbar-component/desktop-navbar"
import MobileNavbar from "./navbar-component/mobile-navbar"

export interface NavLinkItem {
  key: string
  href: string
  children?: NavLinkItem[]
}

export interface NavbarLabels {
  signIn: string
  startTrading: string
  language: string
  navLinks: Record<string, string>
}

interface NavbarProps {
  language: LANGUAGE
  languages: LanguageResponseDto[]
  menuItems?: NavLinkItem[]
  showLogo?: boolean
}

function collectNavKeys(items: NavLinkItem[]): string[] {
  return items.flatMap((item) => [item.key, ...(item.children ? collectNavKeys(item.children) : [])])
}

function buildNavLinkLabels(
  t: Awaited<ReturnType<typeof getTranslations>>,
  items: NavLinkItem[],
): Record<string, string> {
  return Object.fromEntries(
    collectNavKeys(items).map((key) => [key, t(key)]),
  )
}

const Navbar = async ({ language, languages, menuItems = [], showLogo = false }: NavbarProps) => {
  const t = await getTranslations()
  const labels: NavbarLabels = {
    signIn: t("navbar.signIn"),
    startTrading: t("navbar.startTrading"),
    language: t("navbar.language"),
    navLinks: buildNavLinkLabels(t, menuItems),
  }

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-100 w-full border-b py-2",
          "max-lg:border-(--border-muted) max-lg:bg-(--surface-default)",
          "lg:border-transparent lg:bg-(--surface-navbar)",
        )}
      >
        <div className={cn("mx-auto flex min-h-14 w-full items-center justify-between gap-3 py-2 px-6")}>
          <DesktopNavbar language={language} languages={languages} navLinks={menuItems} showLogo={showLogo} labels={labels} />
          <MobileNavbar language={language} languages={languages} navLinks={menuItems} showLogo={showLogo} labels={labels} />
        </div>
      </nav>
      <div aria-hidden className="h-(--navbar-height) shrink-0" />
    </>
  )
}

export default Navbar
