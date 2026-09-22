import { getTranslations } from "next-intl/server"

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
} from "@/shared/constants/company.constants"

import AppLogo from "./logo"

interface FooterProps {
  language?: LANGUAGE
}

/** `key` is the translate_values code; the label itself comes from the CMS catalog. */
interface FooterLinkItem {
  key: string
  href: string
}

const UTILITY_LINKS: FooterLinkItem[] = [
  { key: "footer.utility.property", href: "#" },
  { key: "footer.utility.ourMission", href: "/about-us#mission-and-vision" },
  { key: "footer.utility.ourVision", href: "/about-us#mission-and-vision" },
  { key: "footer.utility.ourHistory", href: "/about-us#our-history" },
  { key: "footer.utility.notFound", href: "/404" },
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
  { key: "footer.legal.termsOfService", href: "#" },
  { key: "footer.legal.privacy", href: "#" },
]

function resolveHref(language: LANGUAGE, href: string) {
  return href.startsWith("/") ? `/${language}${href === "/" ? "" : href}` : href
}

const HEADING_CLASSNAME = "text-xs font-semibold text-(--text-primary) lg:text-sm"
const BODY_CLASSNAME = "text-xs leading-relaxed text-(--text-secondary) lg:text-sm"
const BODY_LINK_CLASSNAME = cn(BODY_CLASSNAME, "transition-colors hover:text-(--text-primary)")

export default async function Footer({ language = LANGUAGE.TH }: FooterProps) {
  const t = await getTranslations()

  return (
    <footer className="relative w-full overflow-hidden bg-(--surface-default) text-(--text-primary)">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(120%_90%_at_50%_0%,var(--color-primary-50)_0%,transparent_70%)]",
        )}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:py-10">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-15 lg:gap-y-8">
          <div
            className={cn(
              "col-span-2 flex flex-col gap-5",
              "sm:col-span-3 sm:flex-row sm:items-start sm:justify-between",
              "lg:col-span-1 lg:flex-col lg:gap-0",
            )}
          >
            <div className="flex flex-col items-start">
              <AppLogo width={140} />
              <p className={cn("mt-4 max-w-xs lg:mt-5", BODY_CLASSNAME, "text-xs lg:text-xs")}>
                {t("footer.brandDescription")}
              </p>
            </div>

            <div className="flex flex-col items-start lg:mt-6">
            <p className="text-[0.625rem] text-(--text-secondary) lg:text-xs">{t("footer.followUs")}</p>

            <div className="mt-2.5 flex items-center gap-1 lg:mt-3 lg:gap-1.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <LinkCustom
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full lg:size-10",
                    "border border-(--border-default) bg-(--surface-default)/60",
                    "text-(--text-primary)",
                    "transition-colors! duration-300! motion-reduce:transition-none!",
                    "hover:border-transparent hover:bg-(--color-primary) hover:text-(--text-invert)",
                  )}
                >
                  <Icon className="size-4 lg:size-5" />
                </LinkCustom>
              ))}
            </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className={HEADING_CLASSNAME}>{t("footer.navigation.title")}</h3>
            <ul className="mt-4 flex flex-col gap-2 lg:mt-5 lg:gap-2.5">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <LinkCustom
                    href={resolveHref(language, href ? `/${href}` : "/")}
                    className={BODY_LINK_CLASSNAME}
                  >
                    {t(key)}
                  </LinkCustom>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className={HEADING_CLASSNAME}>{t("footer.utility.title")}</h3>
            <ul className="mt-4 flex flex-col gap-2 lg:mt-5 lg:gap-2.5">
              {UTILITY_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <LinkCustom href={resolveHref(language, href)} className={BODY_LINK_CLASSNAME}>
                    {t(key)}
                  </LinkCustom>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 flex flex-col sm:col-span-1">
            <h3 className={HEADING_CLASSNAME}>{t("footer.contact.title")}</h3>
            <ul className="mt-4 flex flex-col gap-2 lg:mt-5 lg:gap-2.5">
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
            "mt-6 flex flex-col gap-3 lg:mt-8 lg:gap-4",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p className="text-xs text-(--text-secondary) lg:text-sm">
            {`© ${COMPANY_BRAND_NAME} ${new Date().getFullYear()}`}
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {LEGAL_LINKS.map(({ key, href }) => (
              <LinkCustom
                key={key}
                href={resolveHref(language, href)}
                className={cn(
                  "text-xs text-(--text-secondary) lg:text-sm",
                  "transition-colors hover:text-(--text-primary)",
                )}
              >
                {t(key)}
              </LinkCustom>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
