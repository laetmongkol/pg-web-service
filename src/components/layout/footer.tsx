import { IoLogoFacebook, IoLogoLinkedin } from "react-icons/io5"

import { Mail, MapPin, MessageSquare, Phone, type LucideIcon } from "lucide-react"

import cn from "@/lib/tw-merge"

import LinkCustom from "@/components/link-custom.component"

import type { ComponentType } from "react"

import { LANGUAGE } from "@/shared/constants/common.constants"
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
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

interface FooterLinkGroup {
  heading: string
  links: FooterLinkItem[]
}

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: "เกี่ยวกับเรา",
    links: [
      { label: "ภาพรวมบริษัท", href: "/about-us" },
      { label: "ประวัติของเรา", href: "/about-us" },
      { label: "วิสัยทัศน์และพันธกิจ", href: "/about-us" },
      { label: "ทีมผู้บริหาร", href: "/about-us" },
    ],
  },
  {
    heading: "ธุรกิจของเรา",
    links: [
      { label: "อสังหาริมทรัพย์", href: "/our-businesses" },
      { label: "บริการทางการเงิน", href: "/our-businesses" },
      { label: "เทคโนโลยี", href: "/our-businesses" },
      { label: "การบริการและไลฟ์สไตล์", href: "/our-businesses" },
    ],
  },
  {
    heading: "แหล่งข้อมูล",
    links: [
      { label: "ข่าวสารและอัปเดต", href: "#" },
      { label: "นักลงทุนสัมพันธ์", href: "#" },
      { label: "ร่วมงานกับเรา", href: "#" },
      { label: "ความยั่งยืน", href: "#" },
    ],
  },
]

interface FooterContactItem {
  key: string
  Icon: LucideIcon
  value: string
  href?: string
}

const CONTACT_ITEMS: FooterContactItem[] = [
  { key: "address", Icon: MapPin, value: COMPANY_ADDRESS },
  { key: "phone", Icon: Phone, value: COMPANY_PHONE, href: `tel:${COMPANY_PHONE.replace(/\s/g, "")}` },
  { key: "email", Icon: Mail, value: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}` },
]

interface FooterSocialItem {
  label: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

const SOCIAL_LINKS: FooterSocialItem[] = [
  { label: "LinkedIn", href: "#", Icon: IoLogoLinkedin },
  { label: "Facebook", href: "#", Icon: IoLogoFacebook },
  { label: "Line", href: "#", Icon: MessageSquare },
]

const LEGAL_LINKS: FooterLinkItem[] = [
  { label: "นโยบายความเป็นส่วนตัว", href: "#" },
  { label: "ข้อกำหนดและเงื่อนไข", href: "#" },
  { label: "ธรรมาภิบาล", href: "#" },
]

function resolveHref(language: LANGUAGE, href: string) {
  return href.startsWith("/") ? `/${language}${href}` : href
}

const HEADING_CLASSNAME = "text-sm font-bold text-(--color-secondary) xl:text-base"
const SECTION_DIVIDER_CLASSNAME = "max-lg:border-t max-lg:border-(--text-invert)/12 max-lg:pt-6"
const BODY_LINK_CLASSNAME = cn(
  "text-xs text-(--text-invert)/80 xl:text-sm",
  "transition-colors hover:text-(--text-invert)",
)

export default function Footer({ language = LANGUAGE.TH }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden text-(--text-invert)",
        "bg-linear-to-b from-(--color-primary) to-(--color-primary-350)",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.06]",
          "[background-image:radial-gradient(circle,#fff_1px,transparent_1px)]",
          "[background-size:22px_22px]",
        )}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-8 xl:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 xl:gap-12">
          <div className="flex flex-col gap-3 lg:w-[28%]">
            <div className="flex items-center gap-3">
              <AppLogo width={64} />
              <span className="text-lg font-bold xl:text-2xl">{COMPANY_NAME}</span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-(--text-invert)/75 xl:text-sm">
              {COMPANY_SUMMARY}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-5 xl:gap-6">
            <div className={cn(SECTION_DIVIDER_CLASSNAME, "grid flex-1 gap-6 sm:grid-cols-3 sm:gap-x-6")}>
              {LINK_GROUPS.map(({ heading, links }) => (
                <div key={heading} className="flex min-w-0 flex-col gap-3">
                  <h3 className={HEADING_CLASSNAME}>{heading}</h3>
                  <ul className="flex flex-col gap-2">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <LinkCustom href={resolveHref(language, href)} className={BODY_LINK_CLASSNAME}>
                          {label}
                        </LinkCustom>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={cn(SECTION_DIVIDER_CLASSNAME, "flex min-w-0 flex-col gap-3 lg:w-[34%]")}>
              <h3 className={HEADING_CLASSNAME}>{"ติดต่อเรา"}</h3>
              <ul className="flex flex-col gap-2">
                {CONTACT_ITEMS.map(({ key, Icon, value, href }) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <Icon
                      className="mt-0.5 size-3.5 shrink-0 text-(--color-secondary) xl:size-4"
                      strokeWidth={1.8}
                    />
                    {href ? (
                      <LinkCustom href={href} className={BODY_LINK_CLASSNAME}>
                        {value}
                      </LinkCustom>
                    ) : (
                      <span className="text-xs text-(--text-invert)/80 xl:text-sm">{value}</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-1 flex items-center gap-2.5">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <LinkCustom
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full",
                      "border border-(--color-secondary)/60 text-(--color-secondary)",
                      "transition-colors hover:bg-(--color-secondary) hover:text-(--color-primary)",
                    )}
                  >
                    <Icon className="size-4.5" />
                  </LinkCustom>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mt-8 flex flex-col items-start gap-3 border-t border-(--text-invert)/15 pt-5 lg:mt-6 lg:pt-4 xl:mt-8 xl:pt-5",
            "lg:flex-row lg:items-center lg:justify-between",
          )}
        >
          <p className="text-xs text-(--text-invert)/70 xl:text-sm">
            {`© ${new Date().getFullYear()} ${COMPANY_LEGAL_NAME} สงวนลิขสิทธิ์`}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {LEGAL_LINKS.map(({ label, href }, index) => (
              <div key={label} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden className="text-(--text-invert)/30">
                    {"|"}
                  </span>
                )}
                <LinkCustom href={resolveHref(language, href)} className={BODY_LINK_CLASSNAME}>
                  {label}
                </LinkCustom>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
