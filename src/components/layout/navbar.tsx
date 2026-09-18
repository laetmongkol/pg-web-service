import { getTranslations } from "next-intl/server"

import { LanguageResponseDto } from "@/services/generated-cli/api-app-service"

import { LANGUAGE } from "@/shared/constants/common.constants"

import DesktopNavbar from "./navbar-component/desktop-navbar"
import MobileNavbar from "./navbar-component/mobile-navbar"
import NavbarShell from "./navbar-component/navbar-shell"

export interface NavLinkItem {
  key: string
  href: string
  label: string
  children?: NavLinkItem[]
}

export interface NavbarLabels {
  signIn: string
  startTrading: string
  language: string
}

interface NavbarProps {
  language: LANGUAGE
  languages: LanguageResponseDto[]
  menuItems?: NavLinkItem[]
  showLogo?: boolean
}

const Navbar = async ({ language, languages, menuItems = [], showLogo = false }: NavbarProps) => {
  const t = await getTranslations()
  const labels: NavbarLabels = {
    signIn: t("navbar.signIn"),
    startTrading: t("navbar.startTrading"),
    language: t("navbar.language"),
  }

  return (
    <>
      <NavbarShell>
        <DesktopNavbar language={language} languages={languages} navLinks={menuItems} showLogo={showLogo} labels={labels}/>
        <MobileNavbar language={language} languages={languages} navLinks={menuItems} showLogo={showLogo} labels={labels} />
      </NavbarShell>
      <div aria-hidden className="h-(--navbar-height) shrink-0" />
    </>
  )
}

export default Navbar
