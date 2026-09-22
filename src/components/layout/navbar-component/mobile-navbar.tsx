"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

import { X } from "lucide-react"

import cn from "@/lib/tw-merge"
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service"

import LinkCustom from "@/components/link-custom.component"

import AppLogo from "@/components/layout/logo"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { BUTTON_BASE_CLASSNAME } from "@/shared/ui/classes/button.classes"

// import ToggleTheme from "./toggle-theme"
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

const MENU_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!"

/** Never fires — the snapshot only flips once, when React leaves the server snapshot behind. */
const subscribeToNothing = () => () => {}

const MOBILE_SIGN_IN_CLASSNAME = cn(
  BUTTON_BASE_CLASSNAME,
  "min-h-9 px-4 py-1.5 text-sm",
  "border border-(--color-primary) bg-transparent text-(--color-primary)",
  "hover:bg-(--color-primary)/10",
)

export default function MobileNavbar({ language, navLinks, languages, showLogo = false, labels }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  /**
   * A portal can never be part of the server HTML, so the first client render has to agree that it
   * is not there yet. Testing `typeof document` made that render disagree with the server, which
   * threw this subtree away. This reports false through hydration and true only after it.
   */
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsOpen(false)
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("menu-open", isOpen)
    return () => root.classList.remove("menu-open")
  }, [isOpen])

  const close = () => setIsOpen(false)

  return (
    <>
      <div className="flex w-full flex-1 items-center justify-between gap-3 lg:hidden">
        {showLogo ? (
          <LinkCustom href={`/${language}`} className="shrink-0">
            <AppLogo width={80} className="h-5 sm:h-5" />
          </LinkCustom>
        ) : (
          <div aria-hidden="true" />
        )}

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg",
              "hover:bg-(--color-primary-hover)",
              "hover:cursor-pointer text-(--color-primary)",
            )}
            aria-label="Open menu"
          >
            <span aria-hidden className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      {isHydrated &&
        createPortal(
          <>
          <div
            className={cn(
              "fixed inset-0 z-200 bg-(--color-primary)/35 backdrop-blur-sm lg:hidden",
              "transition-[opacity,visibility]! motion-reduce:transition-none!",
              MENU_EASE,
              isOpen ? "visible opacity-100 duration-300!" : "invisible opacity-0 duration-200!",
            )}
            onClick={close}
            aria-hidden="true"
          />

          <aside
            className={cn(
              "fixed inset-x-5 top-4 z-201 sm:inset-x-6",
              "flex max-h-[calc(100dvh-2rem)] flex-col",
              "rounded-3xl border border-(--surface-default)/60 bg-(--surface-default)",
              "shadow-[var(--shadow-lg)] backdrop-blur-lg",
              "px-5 py-2.5",
              "lg:hidden",
              "origin-top transition-[opacity,visibility,translate,scale]! motion-reduce:transition-none!",
              MENU_EASE,
              isOpen
                ? "visible translate-y-0 scale-100 opacity-100 duration-300!"
                : "invisible -translate-y-2 scale-95 opacity-0 duration-200!",
            )}
          >
            <div className="flex min-h-12 items-center justify-between gap-3">
              {showLogo ? (
                <LinkCustom href={`/${language}`} className="shrink-0" onClick={close}>
                  <AppLogo width={80} className="h-5 sm:h-5" />
                </LinkCustom>
              ) : (
                <div aria-hidden="true" />
              )}

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={close}
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-md",
                    "text-(--color-primary-400) hover:cursor-pointer",
                  )}
                  aria-label="Close menu"
                >
                  <X width="20" height="20" />
                </button>
              </div>
            </div>

            <hr className="my-2.5 border-0 border-t border-(--border-default)" />

            <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
              <NavMenuLinks language={language} links={navLinks} isMobile onLinkClick={close} />
            </nav>

            <div className="mt-3 shrink-0 border-t border-(--border-muted) pt-3 pb-1">
              <p className="mb-2 px-1 text-xs font-medium tracking-wide text-(--text-secondary) uppercase">
                {labels.language}
              </p>
              <LanguageSelector currentLanguage={language} languages={languages} variant="segmented" />
            </div>
          </aside>
          </>,
          document.body,
        )}
    </>
  )
}
