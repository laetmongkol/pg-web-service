"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { Briefcase, ChevronDown, Home, Info, LucideIcon, MessageCircleQuestion } from "lucide-react"

import cn from "@/lib/tw-merge"

import LinkCustom from "@/components/link-custom.component"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { NavLinkKey } from "@/shared/constants/nav-links.constants"

import { NavLinkItem } from "../navbar"

interface NavLinksProps {
  language: LANGUAGE
  links: NavLinkItem[]
  isMobile?: boolean
  onLinkClick?: () => void
}

const NAV_LINK_ICONS: Partial<Record<NavLinkKey, LucideIcon>> = {
  "navbar.home": Home,
  "navbar.about": Info,
  "navbar.ourBusinesses": Briefcase,
  "navbar.contactUs": MessageCircleQuestion,
}

const NAV_LINK_ACTIVE_CLASS = "font-semibold text-(--color-primary) px-3 py-1"
const NAV_LINK_INACTIVE_CLASS = "text-(--text-secondary) hover:text-(--color-primary) px-3 py-1"

function getNavHref(language: LANGUAGE, href: string) {
  return `/${language}${href ? `/${href}` : ""}`
}

function normalizePath(path: string) {
  const trimmed = path.replace(/\/$/, "")
  return trimmed || "/"
}

function isLinkActive(pathname: string, language: LANGUAGE, link: NavLinkItem): boolean {
  const currentPath = normalizePath(pathname)
  const linkPath = normalizePath(getNavHref(language, link.href))

  if (link.href === "") {
    if (currentPath === linkPath) return true
  } else if (currentPath === linkPath || currentPath.startsWith(`${linkPath}/`)) {
    return true
  }

  return link.children?.some((child) => isLinkActive(pathname, language, child)) ?? false
}

const DESKTOP_LINK_CLASSNAME = cn(
  "relative inline-flex items-center gap-1 whitespace-nowrap text-base",
  "transition-colors",
  "px-[0.5px] outline-none",
)

const DESKTOP_DROPDOWN_PANEL_CLASSNAME = cn(
  "z-110 min-w-48 rounded-md border border-(--border-default) bg-(--surface-default)",
  "p-1 shadow-lg",
  "max-h-96 overflow-y-auto overscroll-contain",
)

function DesktopNavLink({
  language,
  link,
  pathname,
}: {
  language: LANGUAGE
  link: NavLinkItem
  pathname: string
}) {
  const itemRef = useRef<HTMLLIElement>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActive = isLinkActive(pathname, language, link)
  const hasChildren = (link.children?.length ?? 0) > 0
  const linkClassName = cn(
    DESKTOP_LINK_CLASSNAME,
    isActive ? NAV_LINK_ACTIVE_CLASS : NAV_LINK_INACTIVE_CLASS,
  )

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const updateDropdownPosition = () => {
    if (!itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    setCoords({ top: rect.bottom, left: rect.left })
  }

  const openDropdown = () => {
    clearCloseTimer()
    updateDropdownPosition()
    setOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    if (!open) return

    const scrollParent = itemRef.current?.closest(".navbar-nav-scroll")
    const handlePositionUpdate = () => updateDropdownPosition()

    scrollParent?.addEventListener("scroll", handlePositionUpdate, { passive: true })
    window.addEventListener("resize", handlePositionUpdate)

    return () => {
      scrollParent?.removeEventListener("scroll", handlePositionUpdate)
      window.removeEventListener("resize", handlePositionUpdate)
    }
  }, [open])

  if (!hasChildren) {
    return (
      <li className="shrink-0">
        <LinkCustom href={getNavHref(language, link.href)} className={linkClassName}>
          {link.label}
        </LinkCustom>
      </li>
    )
  }

  return (
    <li
      ref={itemRef}
      className="relative shrink-0"
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleClose}
    >
      <LinkCustom href={getNavHref(language, link.href)} className={linkClassName}>
        {link.label}
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={cn("text-(--color-primary-400) transition-transform", open && "rotate-180")}
        />
      </LinkCustom>

      <div
        className={cn(
          "fixed z-110 w-max pt-2 transition-opacity",
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
        )}
        style={{ top: coords.top, left: coords.left }}
        role="menu"
        aria-hidden={!open}
        onMouseEnter={openDropdown}
        onMouseLeave={scheduleClose}
      >
        <div className={DESKTOP_DROPDOWN_PANEL_CLASSNAME}>
            {link.children?.map((child) => {
              const childPath = normalizePath(getNavHref(language, child.href))
              const childActive = normalizePath(pathname) === childPath

              return (
                <LinkCustom
                  key={child.key}
                  href={getNavHref(language, child.href)}
                  role="menuitem"
                  className={cn(
                    "block rounded-sm px-3 py-2 text-sm transition-colors",
                    childActive
                      ? "bg-(--color-primary)/10 font-medium text-(--color-primary-readable)"
                      : "text-(--text-primary) hover:bg-(--color-primary)/10",
                  )}
                >
                  {child.label}
                </LinkCustom>
              )
            })}
        </div>
      </div>
    </li>
  )
}

function MobileNavLink({
  language,
  link,
  pathname,
  onLinkClick,
}: {
  language: LANGUAGE
  link: NavLinkItem
  pathname: string
  onLinkClick?: () => void
}) {
  const [expanded, setExpanded] = useState(() => isLinkActive(pathname, language, link))
  const Icon = NAV_LINK_ICONS[link.key]
  const isActive = isLinkActive(pathname, language, link)
  const hasChildren = (link.children?.length ?? 0) > 0

  const rowClassName = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors",
    isActive && !hasChildren
      ? "bg-(--color-primary)/10 text-(--color-primary-readable)"
      : "text-(--text-primary) hover:bg-(--color-primary)/5",
  )

  if (hasChildren) {
    return (
      <li>
        <div
          className={cn(
            "flex w-full items-center rounded-lg transition-colors",
            isActive && "bg-(--color-primary)/10",
          )}
        >
          <LinkCustom
            href={getNavHref(language, link.href)}
            onClick={onLinkClick}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors",
              isActive
                ? "text-(--color-primary-readable)"
                : "text-(--text-primary) hover:bg-(--color-primary)/5",
            )}
          >
            {Icon && <Icon size={20} strokeWidth={1.75} className="shrink-0 text-(--color-primary-400)" />}
            <span className="flex-1 text-left">{link.label}</span>
          </LinkCustom>
          <button
            type="button"
            onClick={() => setExpanded((prev: boolean) => !prev)}
            className={cn(
              "mr-1 inline-flex shrink-0 items-center justify-center rounded-md p-2",
              "text-(--color-primary-400) hover:bg-(--color-primary)/5 hover:cursor-pointer",
            )}
            aria-expanded={expanded}
            aria-label={`Toggle ${link.label} submenu`}
          >
            <ChevronDown
              size={18}
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </button>
        </div>

        {expanded && (
          <ul className="mt-1 flex flex-col gap-0.5 pl-11 pr-1">
            {link.children?.map((child) => {
              const childPath = normalizePath(getNavHref(language, child.href))
              const childActive = normalizePath(pathname) === childPath

              return (
                <li key={child.key}>
                  <LinkCustom
                    href={getNavHref(language, child.href)}
                    onClick={onLinkClick}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      childActive
                        ? "bg-(--color-primary)/10 font-medium text-(--color-primary-readable)"
                        : "text-(--text-secondary) hover:bg-(--color-primary)/5 hover:text-(--text-primary)",
                    )}
                  >
                    {child.label}
                  </LinkCustom>
                </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <LinkCustom href={getNavHref(language, link.href)} onClick={onLinkClick} className={rowClassName}>
        {Icon && <Icon size={20} strokeWidth={1.75} className="shrink-0 text-(--color-primary-400)" />}
        <span className="flex-1">{link.label}</span>
      </LinkCustom>
    </li>
  )
}

export function NavMenuLinks({ language, links, isMobile, onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  if (isMobile) {
    return (
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <MobileNavLink
            key={link.key}
            language={language}
            link={link}
            pathname={pathname}
            onLinkClick={onLinkClick}
          />
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn("flex w-max items-center gap-2 xl:gap-4")}>
      {links.map((link) => (
        <DesktopNavLink key={link.key} language={language} link={link} pathname={pathname} />
      ))}
    </ul>
  )
}
