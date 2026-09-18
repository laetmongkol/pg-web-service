"use client"

import { useEffect, useState } from "react"

import { Menu,X } from "lucide-react"

import cn from "@/lib/tw-merge"
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service"

import LinkCustom from "@/components/link-custom.component"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { BUTTON_BASE_CLASSNAME } from "@/shared/ui/classes/button.classes"

// import ToggleTheme from "./toggle-theme"
import AppLogo from "../logo"
import { NavbarLabels,NavLinkItem } from "../navbar"
import LanguageSelector from "./language-selector"
import { NavMenuLinks } from "./nav-links"

interface MobileNavbarProps {
  language: LANGUAGE
  navLinks: NavLinkItem[]
  languages: LanguageResponseDto[]
  showLogo?: boolean
  labels: NavbarLabels
}

const MOBILE_SIGN_IN_CLASSNAME = cn(
  BUTTON_BASE_CLASSNAME,
  "min-h-9 px-4 py-1.5 text-sm",
  "border border-(--color-primary) bg-transparent text-(--color-primary)",
  "hover:bg-(--color-primary)/10",
)

export default function MobileNavbar({ language, navLinks, languages, showLogo = false, labels }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsOpen(false)
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  const close = () => setIsOpen(false)

  return (
    <>
      <div className="flex w-full flex-1 items-center justify-between gap-3 lg:hidden">
        {showLogo ? (
          <LinkCustom href={`/${language}`} className="shrink-0">
            <AppLogo />
          </LinkCustom>
        ) : (
          <div aria-hidden="true" />
        )}

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg",
              "hover:bg-(--color-primary-hover)",
              "hover:cursor-pointer text-white",
            )}
            aria-label="Open menu"
          >
            <Menu width="24" height="24"/>
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-200 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={close}
            aria-hidden="true"
          />

          <aside
            className={cn(
              "fixed inset-x-0 top-0 z-201",
              "flex max-h-dvh flex-col",
              "bg-(--surface-default)",
              "border-b border-(--border-default)",
              "px-4 py-3",
              "lg:hidden",
            )}
          >
            <div className="flex min-h-14 items-center justify-between gap-3">
              {showLogo ? (
                <LinkCustom href={`/${language}`} className="shrink-0" onClick={close}>
                  <AppLogo />
                </LinkCustom>
              ) : (
                <div aria-hidden="true" />
              )}

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={close}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-md",
                    "text-(--color-primary-400) hover:cursor-pointer",
                  )}
                  aria-label="Close menu"
                >
                  <X width="24" height="24" />
                </button>
              </div>
            </div>

            <hr className="my-3 border-0 border-t border-dashed border-(--border-default)" />

            <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
              <NavMenuLinks language={language} links={navLinks} labels={labels.navLinks} isMobile onLinkClick={close} />
            </nav>

            <div className="mt-4 shrink-0 border-t border-(--border-muted) pt-4 pb-1">
              <p className="mb-2 px-1 text-xs font-medium tracking-wide text-(--text-muted) uppercase">
                {labels.language}
              </p>
              <LanguageSelector currentLanguage={language} languages={languages} variant="mobile" />
            </div>
          </aside>
        </>
      )}
    </>
  )
}
