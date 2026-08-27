"use client"

import cn from "@/lib/tw-merge"

import LinkCustom from "@/components/link-custom.component"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { BUTTON_BASE_CLASSNAME } from "@/shared/ui/classes/button.classes"

// TODO: change later
export const NAVBAR_ROUTES = {
  signIn: "https://google.com/",
  startTrading: "/register",
} as const

export type NavbarRouteKey = keyof typeof NAVBAR_ROUTES

export function getNavbarHref(language: LANGUAGE, route: NavbarRouteKey) {
  const path = NAVBAR_ROUTES[route]
  // Absolute / protocol URLs leave the app as-is — do not prefix locale.
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path
  }
  return `/${language}${path}`
}
interface NavbarActionsProps {
  language: LANGUAGE
  signInLabel: string
  startTradingLabel: string
}

const SIGN_IN_LINK_CLASSNAME = cn(
  BUTTON_BASE_CLASSNAME,
  "min-h-9 shrink-0 px-3 py-1.5 text-md whitespace-nowrap",
  "border border-transparent bg-transparent text-(--color-primary-readable)",
  "hover:bg-(--color-primary)/10",
)

const CTA_LINK_CLASSNAME = cn(
  BUTTON_BASE_CLASSNAME,
  "navbar-cta-button min-h-9 shrink-0 px-5 py-1.5 text-md whitespace-nowrap text-white",
  "border-0 shadow-none",
)

function handleCtaMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  event.currentTarget.style.setProperty("--cta-x", `${x}%`)
  event.currentTarget.style.setProperty("--cta-y", `${y}%`)
}

export default function NavbarActions({ language, signInLabel, startTradingLabel }: NavbarActionsProps) {
  const signInHref = getNavbarHref(language, "signIn")
  const startTradingHref = getNavbarHref(language, "startTrading")

  return (
    <div className="flex shrink-0 items-center gap-3">
      <LinkCustom href={signInHref} target="_blank" className={SIGN_IN_LINK_CLASSNAME}>
        {/* {signInLabel} */}
        Sign In
      </LinkCustom>
      <LinkCustom href={startTradingHref} onMouseMove={handleCtaMouseMove} className={CTA_LINK_CLASSNAME}>
        {/* {startTradingLabel} */}
        Register
      </LinkCustom>
    </div>
  )
}

