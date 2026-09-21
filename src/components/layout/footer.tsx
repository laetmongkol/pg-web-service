import {
  IoLogoFacebook,
  IoLogoGoogle,
  IoLogoInstagram,
  IoLogoYoutube,
} from "react-icons/io5"

import cn from "@/lib/tw-merge"

import LinkCustom from "@/components/link-custom.component"

import type { ComponentType } from "react"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { NAV_LINKS } from "@/shared/constants/nav-links.constants"
import {
  COMPANY_ADDRESS,
  COMPANY_BRAND_NAME,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  COMPANY_SUMMARY,
} from "@/shared/constants/company.constants"

import AppLogo from "./logo"

interface FooterProps {
  language?: LANGUAGE
}

interface FooterLinkItem {
  label: string
  href: string
}

const NAVIGATION_LINKS: FooterLinkItem[] = NAV_LINKS.map(({ label, href }) => ({
  label,
  href: href ? `/${href}` : "/",
}))

const UTILITY_LINKS: FooterLinkItem[] = [
  { label: "Property", href: "#" },
  { label: "Our Mission", href: "/about-us#mission-and-vision" },
  { label: "Our Vision", href: "/about-us#mission-and-vision" },
  { label: "Our History", href: "/about-us#our-history" },
  { label: "404 Not Found", href: "/404" },
]

interface FooterContactItem {
  key: string
  value: string
  href?: string
}

const CONTACT_ITEMS: FooterContactItem[] = [
  { key: "address", value: COMPANY_ADDRESS },
  { key: "email", value: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}` },
  { key: "phone", value: COMPANY_PHONE, href: `tel:${COMPANY_PHONE.replace(/\s/g, "")}` },
]

interface FooterSocialItem {
  label: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

const SOCIAL_LINKS: FooterSocialItem[] = [
  { label: "Facebook", href: "#", Icon: IoLogoFacebook },
  { label: "Google", href: "#", Icon: IoLogoGoogle },
  { label: "Instagram", href: "#", Icon: IoLogoInstagram },
  { label: "YouTube", href: "#", Icon: IoLogoYoutube },
]

const LEGAL_LINKS: FooterLinkItem[] = [
  { label: "Term of service", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

function resolveHref(language: LANGUAGE, href: string) {
  return href.startsWith("/") ? `/${language}${href === "/" ? "" : href}` : href
}

const HEADING_CLASSNAME = "text-sm font-semibold text-(--text-primary)"
const BODY_CLASSNAME = "text-sm leading-relaxed text-(--text-secondary)"
const BODY_LINK_CLASSNAME = cn(BODY_CLASSNAME, "transition-colors hover:text-(--text-primary)")

export default function Footer({ language = LANGUAGE.TH }: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden bg-(--surface-default) text-(--text-primary)">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(120%_90%_at_50%_0%,var(--color-primary-50)_0%,transparent_70%)]",
        )}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-15">
          <div className="flex flex-col items-start">
            <AppLogo width={140} />

            <p className={cn("mt-8 max-w-xs", BODY_CLASSNAME)}>{COMPANY_SUMMARY}</p>

            <p className="mt-10 text-xs text-(--text-secondary)">{"Follow us"}</p>

            <div className="mt-5 flex items-center gap-1.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <LinkCustom
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex size-14 items-center justify-center rounded-full",
                    "border border-(--border-default) bg-(--surface-default)/60",
                    "text-(--text-primary)",
                    "transition-colors! duration-300! motion-reduce:transition-none!",
                    "hover:border-transparent hover:bg-(--color-primary) hover:text-(--text-invert)",
                  )}
                >
                  <Icon className="size-5" />
                </LinkCustom>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className={HEADING_CLASSNAME}>{"Navigation"}</h3>
            <ul className="mt-8 flex flex-col gap-4">
              {NAVIGATION_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <LinkCustom href={resolveHref(language, href)} className={BODY_LINK_CLASSNAME}>
                    {label}
                  </LinkCustom>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className={HEADING_CLASSNAME}>{"Utility Pages"}</h3>
            <ul className="mt-8 flex flex-col gap-4">
              {UTILITY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <LinkCustom href={resolveHref(language, href)} className={BODY_LINK_CLASSNAME}>
                    {label}
                  </LinkCustom>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className={HEADING_CLASSNAME}>{"Contact"}</h3>
            <ul className="mt-8 flex flex-col gap-4">
              {CONTACT_ITEMS.map(({ key, value, href }) => (
                <li key={key}>
                  {href ? (
                    <LinkCustom href={href} className={BODY_LINK_CLASSNAME}>
                      {value}
                    </LinkCustom>
                  ) : (
                    <span className={BODY_CLASSNAME}>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mt-14 flex flex-col gap-4 lg:mt-20",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p className="text-xs text-(--text-secondary) sm:text-sm">
            {`© ${COMPANY_BRAND_NAME} ${new Date().getFullYear()}`}
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {LEGAL_LINKS.map(({ label, href }) => (
              <LinkCustom
                key={label}
                href={resolveHref(language, href)}
                className={cn(
                  "text-xs text-(--text-secondary) sm:text-sm",
                  "transition-colors hover:text-(--text-primary)",
                )}
              >
                {label}
              </LinkCustom>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
